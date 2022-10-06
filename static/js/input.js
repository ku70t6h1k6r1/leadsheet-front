//<common>
var canvas_width;
var canvas_height;
var canvas_element;
var scale_width;
var scale_height;

var pitch_range = 24;
var beat_range = 32;

var measure_id = 0;
var grid_par_measure = 16;
var grid_par_quarter = 4;
var grid_par_octave = 12;
var start_beat_position = 8;
var beat_position_cue_distance = 8;
var pitch_sharpflat = [false, true, false, true, false, true, false, false, true, false, true, false];
//</common>

//<grid>
var grid_width;
var grid_height;
var grid_sx;
var grid_sy;
var grid_ex;
var grid_ey;
var grid_on = false;
var note_status_flat = -1;
var note_status_natural = 0;
var note_status_sharp = 1;
var note_status_default = note_status_flat;
//</grid>

//<color>
//var background_color = "#FFFFFF"
var background_color_odd = "#FFFFFF";
var background_color_sharpflat_odd  = "#F0F0F0";
var background_color_even = "#F8F8F8";
var background_color_sharpflat_even =  "#ECECEC";
var grid_color = "#C5E9FB";
var grid_bold_color = "#5BC2F4";
var note_natural = "#5B37CC";
var note_sharp = "#E33059";
//</color>

//<status dicts>
var pianoroll = [];
var pianoroll_beat = [];
var notes_status_sharpflap = {};
var pianoroll_measure=[]
//</status dicts>

window.onload = function(){
    canvas();
}
 
function canvas(){
    canvas_element = document.getElementById("pianoroll");
    canvas_width = canvas_element.clientWidth;
    canvas_height = canvas_element.clientHeight;
    scale_width = canvas_element.width/canvas_width;
    scale_height = canvas_element.height/canvas_height;

    load_pianoroll();
    load_command();


    canvas_element.addEventListener("mousedown",e=>{
        const rect = e.target.getBoundingClientRect();
        const viewX = e.clientX - rect.left;
        const viewY = e.clientY - rect.top;

        grid_sx = viewX*scale_width;
        grid_sy = viewY*scale_height;
        grid_ex = grid_sx;
        grid_ey = grid_sy;
        [grid_id_sx, grid_id_sy] = cursor2gridId(grid_sx, grid_sy);
        [grid_id_ex, grid_id_ey] = cursor2gridId(grid_ex, grid_ey);


        if(!pianoroll_beat[grid_id_sx]){
            grid_on = true;
        }else{
            grid_on = false;
        }

        //<note status change or delete>
        if(!grid_on){
            note_id = pianoroll[grid_id_sy][grid_id_sx];
            if(note_id){
                if(pitch_sharpflat[grid_id_sy%grid_par_octave]){
                    var status = notes_status_sharpflap[note_id]
                    if(status == note_status_natural || status == note_status_sharp ){
                        note_off(note_id); 
                    }else{
                        note_on_by_note_id(note_id);
                    }   
                }else{
                    note_off(note_id); 
                }

            }    
        }
        //</note status change or delete>


    });
    canvas_element.addEventListener("mousemove",e=>{

        if(grid_on){
            const rect = e.target.getBoundingClientRect();
            const viewX = e.clientX - rect.left;
            grid_ex_temp = viewX*scale_width;
            [grid_id_ex_temp, _] = cursor2gridId(grid_ex_temp, 0);
            
    
            if(grid_id_ex_temp > grid_id_ex){
                if(!pianoroll_beat[grid_id_ex_temp]){
                    grid_ex=grid_ex_temp;
                    [grid_id_ex, _] = cursor2gridId(grid_ex, 0);
                }else{
                    grid_on = false;
                }
            }


            note_on(grid_sx, grid_sy, grid_ex, grid_ey);
            
            for(let i=grid_id_sx; i<=grid_id_ex; i++){
                pianoroll_beat[i] = true;
            }
        }
    });
    canvas_element.addEventListener("mouseup",e=>{
        //<クリックしただけ>
        if(grid_on && grid_sx==grid_ex && !pianoroll_beat[grid_id_sx]){
            note_on(grid_sx, grid_sy, grid_ex, grid_ey);
            pianoroll_beat[grid_id_sx] = true;
        }
        //</クリックしただけ>
        grid_on = false;
    });
}

function load_pianoroll(){
    var context = canvas_element.getContext("2d");
    //<base info>
    grid_height = parseInt(canvas_height*scale_height / pitch_range)
    grid_width = parseInt(canvas_width*scale_width / beat_range);
    //</base info>

    //<base manage_grid_id>
    for(let v = 0; v < pitch_range; v++){
        pianoroll[v] = [];
        for(let h = 0; h < beat_range; h++){
            pianoroll[v][h] = null;
            pianoroll_beat[h] = false;
        }
    }
    //</base manage_grid_id>

    //<base measure_id>
    for(let v = 0; v < pitch_range; v++){
        pianoroll_measure[v] = [];
        for(let h = 0; h < beat_range; h++){
            var add_measure_id = Math.floor( (h+start_beat_position) /grid_par_measure);
            pianoroll_measure[v][h] = measure_id + add_measure_id;
        }
    }  
    //</base measure_id>

    //<base grid>
    // 水平
    for(let v = 0; v < pitch_range; v++){
        // 垂直
        for(let h = 0; h < beat_range; h++){
            note_reset(context, h, v)
        }
    }    
    //</base grid>
}

function load_command(){
    var nextMeasureBtn = document.getElementById("next-measure");
    nextMeasureBtn.addEventListener('click', reload_pianoroll)
}

function note_on_by_note_id(note_id){
    var context = canvas_element.getContext("2d");    
   
    grid_sx_id = null;
    grid_sy_id = null;
    grid_ex_id = null;
    grid_ey_id = null;
    //<manage pianoroll>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]==note_id){
                if(grid_sx_id===null){
                    grid_sx_id = h;
                    grid_sy_id = v;
                }
                grid_ex_id = h;
                grid_ey_id = v;
            }
        }
    }
    //</manage pianoroll>


    var [sx, sy, _, _] = gridId2axis(grid_sx_id, grid_sy_id);
    var [_, _, ex, ey] = gridId2axis(grid_ex_id, grid_ey_id);
    rectangle(context, sx, sy, ex, ey, note_sharp, null);

    //<manage note status>
    notes_status_sharpflap[note_id] = note_status_sharp
    //</manage note status>
}


function note_on(sx_cursor, sy_cursor, ex_cursor, ey_cursor){
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

function note_off(note_id){
    var context = canvas_element.getContext("2d"); 
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]==note_id){
                note_reset(context, h, v)
                pianoroll[v][h] = null;
                pianoroll_beat[h] = false;
            }
        }
    }

    //<manage note status>
    delete notes_status_sharpflap[note_id]
    //</manage note status>

}

function note_reset(context, h, v){
    [sx, sy, ex, ey] = gridId2axis(h, v);
    var background_color = get_background(v, h)
    rectangle(context, sx, sy, ex, ey, background_color, grid_color);
    //<vetical>
    if(h%grid_par_quarter == 0){
        [ex, ey, _, _] = gridId2axis(h, v+1);
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

function line(context, sx, sy, ex, ey, color_stroke){
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(ex, ey);  
    context.strokeStyle = color_stroke;
    context.lineWidth = 1;
    context.stroke();
}

function get_random(){
    return Math.floor(Math.random() * 10000) + 1;
}

function rectangle(context, sx, sy, ex, ey, color, color_stroke){
    context.beginPath ();
    if(color_stroke != null){
        context.rect( sx, sy, ex-sx, ey-sy ) ;
    }else{
        context.rect( sx+1, sy+1, ex-sx-2, ey-sy-2 )
    }
    context.fillStyle = color ;
    context.fill() ;

    if(color_stroke != null){
        context.strokeStyle = color_stroke ;
        context.lineWidth = 1 ;
        context.stroke() ;
    }
}

function cursor2gridId(x_cursor, y_cursor){
    grid_x_id = 0;
    grid_y_id = 0;

    for(let h = 0; h < beat_range; h++){
        if((grid_x_id+1)*grid_width<x_cursor){
            grid_x_id += 1;
        }else{
            break
        }
    }

    for(let v = 0; v < pitch_range; v++){
        if((grid_y_id+1)*grid_height<y_cursor){
            grid_y_id += 1;
        }else{
            break
        }
    }
    return [grid_x_id, grid_y_id]
}

function gridId2axis(grid_x_id, grid_y_id){
    var sx = grid_x_id*grid_width;
    var sy = grid_y_id*grid_height;
    var ex = (grid_x_id+1)*grid_width;
    var ey = (grid_y_id+1)*grid_height;

    return [sx, sy, ex, ey]
}

function get_background(v, h){
    var background_color


    if(pianoroll_measure[v][h]%2 == 0){
        if(pitch_sharpflat[v%grid_par_octave]){
            background_color = background_color_sharpflat_even 
        }else{
            background_color = background_color_even
        }
    }else{
        if(pitch_sharpflat[v%grid_par_octave]){
            background_color = background_color_sharpflat_odd 
        }else{
            background_color = background_color_odd
        } 
    }


    return background_color
}

function reload_pianoroll(){
   var start_beat_position_pre = start_beat_position;
   start_beat_position = start_beat_position + beat_position_cue_distance;
   load_pianoroll();
}