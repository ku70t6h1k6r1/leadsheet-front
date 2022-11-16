import {
        load_canvas,
        canvas_element,
        scale_width,        
        scale_height,
        pitch_range,
        pitch_sharpflat,
        beat_range,
        grid_par_measure,
        grid_par_quarter,
        grid_par_octave,
        start_grid_n,
        next_grids
    } from './grid.js';
import { 
    cursor2gridId, 
    gridId2axis, 
    grid_enable, 
    get_random
}  from './grid-funcs.js';
import { 
    line, 
    rectangle
}  from './grid-draw.js';
import { 
        grid_color, 
        grid_bold_color, 
        note_natural, 
        note_sharp,
        get_background
    }  from './color.js';
    
//<grid>
var grid_sx;
var grid_sy;
var grid_ex;
var grid_ey;
var grid_id_sx;
var grid_id_sy;
var grid_id_ex;
var grid_id_ey;
var grid_on = false;

var note_status_flat = -1;
var note_status_natural = 0;
var note_status_sharp = 1;
var note_status_default = note_status_flat;
//</grid>

//</common>
var measure_id = 0;

//<status dicts>
var score = [];
var pianoroll = [];
var notes_status_sharpflap = {};
var pianoroll_measure=[]
//</status dicts>


window.addEventListener("load", canvas);
 
function canvas(){
    load_canvas();
    load_pianoroll();

    canvas_element.addEventListener("mousedown", {pianoroll:pianoroll, notes_status_sharpflap:notes_status_sharpflap, handleEvent:mousedown});
    canvas_element.addEventListener("mousemove", {pianoroll:pianoroll, notes_status_sharpflap:notes_status_sharpflap, handleEvent:mousemove});
    canvas_element.addEventListener("mouseup", {pianoroll:pianoroll, notes_status_sharpflap:notes_status_sharpflap, handleEvent:mouseup});

    load_command();
}

function load_command(){
    var nextMeasureBtn = document.getElementById("next-measure");
    nextMeasureBtn.addEventListener('click', reload_pianoroll)
}

export const  load_pianoroll = () => {
    if(pianoroll.length == 0){
        for(let v = 0; v < pitch_range; v++){
            pianoroll[v] = [];
            for(let h = 0; h < beat_range; h++){
                pianoroll[v][h] = null;
            }
        }
    }else{
        for(let v = 0; v < pitch_range; v++){
            pianoroll[v] = [];
            for(let h = 0; h < beat_range; h++){
                pianoroll[v][h] = null;
            }
        }
    }


    //<base measure_id>
    for(let v = 0; v < pitch_range; v++){
        pianoroll_measure[v] = [];
        for(let h = 0; h < beat_range; h++){
            var add_measure_id = Math.floor( (h+start_grid_n) /grid_par_measure);
            pianoroll_measure[v][h] = measure_id + add_measure_id;
        }
    }  
    //</base measure_id>

    //<base grid>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            note_reset(h, v, pianoroll_measure, pitch_sharpflat, grid_par_octave)
        }
    }    
    //</base grid>
}


function reload_pianoroll(){   
    dump_score()
    next_grids()
    load_pianoroll();
}



//<mouse event handler>
function mousemove(e){
    var pianoroll=this.pianoroll;
    var notes_status_sharpflap=this.notes_status_sharpflap;

    if(grid_on){
        const rect = e.target.getBoundingClientRect();
        const viewX = e.clientX - rect.left;
        var grid_ex_temp = viewX*scale_width;
        var [grid_id_ex_temp, _] = cursor2gridId(grid_ex_temp, 0);
        
    
        if(grid_id_ex_temp > grid_id_ex){
            if(grid_enable(pianoroll, grid_id_ex_temp)){
                grid_ex=grid_ex_temp;
                [grid_id_ex, _] = cursor2gridId(grid_ex, 0);
            }else{
                grid_on = false;
            }
        }
        note_on(grid_sx, grid_sy, grid_ex, grid_ey, pianoroll, notes_status_sharpflap);

    }
}

function dump_score(){
    for(let v = 0; v < pitch_range; v++){
        if(score.length <= v ){
            score[v] = [];
            for(let i=0; i < start_grid_n; i++){
                score[v][i] = null;
            }
        }
        for(let h = 0; h < beat_range; h++){
            score[v][h+start_grid_n] = pianoroll[v][h];
        }
    }
    console.log(score);

}

function mouseup(e){
    var pianoroll=this.pianoroll;
    var notes_status_sharpflap=this.notes_status_sharpflap;

    //<クリックしただけ>
    if(grid_on && grid_sx==grid_ex && grid_enable(pianoroll,grid_id_sx)){
        note_on(grid_sx, grid_sy, grid_ex, grid_ey, pianoroll, notes_status_sharpflap);
    }
    //</クリックしただけ>
    grid_on = false;
}

function mousedown(e){
    var pianoroll=this.pianoroll;
    var notes_status_sharpflap=this.notes_status_sharpflap;

    const rect = e.target.getBoundingClientRect();
    const viewX = e.clientX - rect.left;
    const viewY = e.clientY - rect.top;

    grid_sx = viewX*scale_width;
    grid_sy = viewY*scale_height;
    grid_ex = grid_sx;
    grid_ey = grid_sy;
    [grid_id_sx, grid_id_sy] = cursor2gridId(grid_sx, grid_sy);
    [grid_id_ex, grid_id_ey] = cursor2gridId(grid_ex, grid_ey);

    grid_on = grid_enable(pianoroll, grid_id_sx);

    //<note status change or delete>
    if(!grid_on){
        var note_id = pianoroll[grid_id_sy][grid_id_sx];
        if(note_id){
            if(pitch_sharpflat[grid_id_sy%grid_par_octave]){
                var status = notes_status_sharpflap[note_id]
                if(status == note_status_natural || status == note_status_sharp ){
                    note_off(note_id, pianoroll, notes_status_sharpflap); 
                }else{
                    note_on_by_note_id(note_id,  pianoroll, notes_status_sharpflap);
                }   
            }else{
                note_off(note_id, pianoroll, notes_status_sharpflap); 
            }

        }    
    }
    //</note status change or delete>
}

//</mouse event handler>

function note_on_by_note_id(note_id, pianoroll, notes_status_sharpflap){
    var context = canvas_element.getContext("2d");    
   
    var grid_id_sx_temp = null;
    var grid_id_sy_temp = null;
    var grid_id_ex_temp = null;
    var grid_id_ey_temp = null;
    //<manage pianoroll>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]==note_id){
                if(grid_id_sx_temp===null){
                    grid_id_sx_temp = h;
                    grid_id_sy_temp = v;
                }
                grid_id_ex_temp = h;
                grid_id_ey_temp = v;
            }
        }
    }
    //</manage pianoroll>


    var [sx, sy, _, _] = gridId2axis(grid_id_sx_temp, grid_id_sy_temp);
    var [_, _, ex, ey] = gridId2axis(grid_id_ex_temp, grid_id_ey_temp);
    rectangle(context, sx, sy, ex, ey, note_sharp, null);

    //<manage note status>
    notes_status_sharpflap[note_id] = note_status_sharp
    //</manage note status>
}


function note_on(sx_cursor, sy_cursor, ex_cursor, ey_cursor, pianoroll, notes_status_sharpflap){
    var context = canvas_element.getContext("2d");    
    var [grid_sx_id, grid_sy_id] = cursor2gridId(sx_cursor, sy_cursor);
    var [grid_ex_id, grid_ey_id] = cursor2gridId(ex_cursor, ey_cursor);
    var [sx, sy, _, _] = gridId2axis(grid_sx_id, grid_sy_id);
    var [_, _, ex, ey] = gridId2axis(grid_ex_id, grid_ey_id);


    rectangle(context, sx, sy, ex, ey, note_natural, null);

    //<manage pianoroll>
    if (pianoroll[grid_sy_id][grid_sx_id] === null){
        var note_id = get_random();
    }else{
        var note_id = pianoroll[grid_sy_id][grid_sx_id]
    }
    
    for(let y=grid_sy_id; y<=grid_ey_id; y++){
        for(let x=grid_sx_id; x<=grid_ex_id; x++){
            pianoroll[y][x]=note_id
        }
    }
    //</manage pianoroll>

    //<manage note status>
    notes_status_sharpflap[note_id] = note_status_default
    //</manage note status>
}

function note_off(note_id, pianoroll, notes_status_sharpflap){
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]==note_id){
                note_reset(h, v, pianoroll_measure, pitch_sharpflat, grid_par_octave)
                pianoroll[v][h] = null;
            }
        }
    }

    //<manage note status>
    delete notes_status_sharpflap[note_id]
    //</manage note status>

}

function note_reset(h, v, pianoroll_measure, pitch_sharpflat, grid_par_octave){
    var context = canvas_element.getContext("2d"); 
    var [sx, sy, ex, ey] = gridId2axis(h, v);
    var background_color = get_background(v, h, pianoroll_measure, pitch_sharpflat, grid_par_octave);
    rectangle(context, sx, sy, ex, ey, background_color, grid_color);
    //<vetical>
    if(h%grid_par_quarter == 0){
        var [ex, ey, _, _] = gridId2axis(h, v+1);
        line(context, sx, sy, ex, ey, grid_bold_color);
    }
    if(h%grid_par_quarter == (grid_par_quarter-1)){
        [sx, sy, _, _] = gridId2axis(h+1, v);
        line(context, sx, sy, ex, ey, grid_bold_color);
    }
    //</vetical>

    //<horizontal>
    if(v%grid_par_octave == (grid_par_octave-1)){
        [sx, sy, _, _] = gridId2axis(h, v+1);
        [_, _, ex, ey] = gridId2axis(h, v);
        line(context, sx, sy, ex, ey, grid_bold_color);
    }
    if(v%grid_par_octave == 0){
        [sx, sy, _, _] = gridId2axis(h, v);
        [_, _, ex, ey] = gridId2axis(h, v-1);
        line(context, sx, sy, ex, ey, grid_bold_color);
    }
    //</horizontal>
}

