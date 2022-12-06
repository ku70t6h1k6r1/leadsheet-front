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
        next_grids,
        past_grids
    } from './grid.js';
import { 
    cursor2gridId, 
    gridId2cursor,
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
        get_background,
        get_notecolor
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

export var note_status_flat = -1;
export var note_status_natural = 0;
export var note_status_sharp = 1;
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
    load_command();
}

function load_command(){
    var nextMeasureBtn = document.getElementById("next-measure");
    nextMeasureBtn.addEventListener('click', next_pianoroll)
    var pastMeasureBtn = document.getElementById("past-measure");
    pastMeasureBtn.addEventListener('click', past_pianoroll)

}

export const  load_pianoroll = () => {
    if(score.length == 0){
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
                var h_absolute = h + start_grid_n;
                if(h_absolute < score[v].length){
                    pianoroll[v][h] = score[v][h_absolute];

                }
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

    //<note on>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]){
                note_on_by_note_id(pianoroll[v][h], pianoroll, notes_status_sharpflap)
            }
        }
    }
    //</note on>

    //<mouse>
    canvas_element.addEventListener("mousedown", mousedown);
    canvas_element.addEventListener("mousemove", mousemove);
    canvas_element.addEventListener("mouseup", mouseup);    
    //</mouse>

}


function next_pianoroll(){   
    dump_score()
    next_grids()
    load_pianoroll();
}

function past_pianoroll(){   
    dump_score()
    past_grids()
    load_pianoroll();
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
}

//<mouse event handler>
function mousemove(e){
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

function mouseup(e){
    //<クリックしただけ>
    if(grid_on && grid_sx==grid_ex){
        note_on(grid_sx, grid_sy, grid_ex, grid_ey, pianoroll, notes_status_sharpflap);
    }
    //</クリックしただけ>
    grid_on = false;
}

function mousedown(e){
    //色が変わるのはすでにオンになっているところだけ。
    //notes_status_sharpflapのステータスは変更。

    const rect = e.target.getBoundingClientRect();
    const viewX = e.clientX - rect.left;
    const viewY = e.clientY - rect.top;

    grid_sx = viewX*scale_width;
    grid_sy = viewY*scale_height;
    grid_ex = grid_sx;
    grid_ey = grid_sy;
    [grid_id_sx, grid_id_sy] = cursor2gridId(grid_sx, grid_sy);
    [grid_id_ex, grid_id_ey] = cursor2gridId(grid_ex, grid_ey);


    //<note status change or delete>
    if(grid_enable(pianoroll, grid_id_sx)){
        var note_id = get_random();
        pianoroll[grid_id_sy][grid_id_sx] = note_id;
        if(pitch_sharpflat[grid_id_sy%grid_par_octave]){
            notes_status_sharpflap[note_id] = note_status_flat
        }else{
            notes_status_sharpflap[note_id] = note_status_natural
        }
        grid_on = true;
    }else{
        grid_on = false;
        //すでにONになっている。
        var note_id = pianoroll[grid_id_sy][grid_id_sx];
        if(note_id){
            if(pitch_sharpflat[grid_id_sy%grid_par_octave]){
                var status = notes_status_sharpflap[note_id]
                console.log(status);
                if(status === note_status_natural ){
                    console.log("この条件にはこないはず1")
                }else if(status === note_status_sharp ){
                    delete notes_status_sharpflap[note_id];
                    note_off(note_id, pianoroll, notes_status_sharpflap);                
                }else if(status === note_status_flat ){
                    notes_status_sharpflap[note_id] = note_status_sharp;
                    note_on_by_note_id(note_id,  pianoroll, notes_status_sharpflap);
                }else if(status === undefined){
                    console.log("この条件にはこないはず2")
                    notes_status_sharpflap[note_id] = note_status_flat;
                    note_on_by_note_id(note_id,  pianoroll, notes_status_sharpflap);
                }else{
                    console.log("この条件にはこないはず3")
                }
            }else{
                delete notes_status_sharpflap[note_id]
                note_off(note_id, pianoroll); 
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
    var note_color = get_notecolor(notes_status_sharpflap[note_id]);
    rectangle(context, sx, sy, ex, ey, note_color, null);
}

function note_on(sx_cursor, sy_cursor, ex_cursor, ey_cursor, pianoroll, notes_status_sharpflap){
    var context = canvas_element.getContext("2d");    
    var [grid_sx_id, grid_sy_id] = cursor2gridId(sx_cursor, sy_cursor);
    var [grid_ex_id, grid_ey_id] = cursor2gridId(ex_cursor, ey_cursor);
    var [sx, sy, _, _] = gridId2axis(grid_sx_id, grid_sy_id);
    var [_, _, ex, ey] = gridId2axis(grid_ex_id, grid_ey_id);

    var note_id = pianoroll[grid_sy_id][grid_sx_id]
    
    for(let y=grid_sy_id; y<=grid_ey_id; y++){
        for(let x=grid_sx_id; x<=grid_ex_id; x++){
            pianoroll[y][x]=note_id
        }
    }
    //</manage pianoroll>

    var note_color = get_notecolor(notes_status_sharpflap[note_id]);
    rectangle(context, sx, sy, ex, ey, note_color, null);
}

function note_off(note_id, pianoroll){
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]==note_id){
                note_reset(h, v, pianoroll_measure, pitch_sharpflat, grid_par_octave)
                pianoroll[v][h] = null;
            }
        }
    }
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