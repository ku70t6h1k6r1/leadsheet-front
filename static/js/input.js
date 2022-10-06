var canvas_width;
var canvas_height;
var canvas_element;
var scale_width;
var scale_height;

var pitch_range = 24;
var beat_range = 32;

//<grid>
var grid_width;
var grid_height;
var grid_sx;
var grid_sy;
var grid_ex;
var grid_ey;
var grid_on = false;
var pianoroll = [];
var pianoroll_beat = [];
var notes_status_sharpflap = {};
var note_status_flat = -1
var note_status_natural = 0
var note_status_sharp = 1
var note_status_default = note_status_flat
//</grid>


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
                console.log(notes_status_sharpflap);
                var status = notes_status_sharpflap[note_id]
                if(status == note_status_natural || status == note_status_sharp ){
                    note_off(note_id); 
                }else{
                    notes_status_sharpflap[note_id] = note_status_sharp
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

    //<base grid>
    // 水平
    for(let v = 0; v < pitch_range; v++){
        // 垂直
        for(let h = 0; h < beat_range; h++){
            var sx = grid_width*h;
            var sy = grid_height*v;
            var ex = grid_height*(h+1);
            var ey = grid_height*(v+1);
            rectangle(context, sx, sy, ex, ey, "purple", "white");
        }
    }    
    //</base grid>


}

function note_on(sx_cursor, sy_cursor, ex_cursor, ey_cursor){
    var context = canvas_element.getContext("2d");    
    var [grid_sx_id, grid_sy_id] = cursor2gridId(sx_cursor, sy_cursor);
    var [grid_ex_id, grid_ey_id] = cursor2gridId(ex_cursor, ey_cursor);
    var [sx, sy, _, _] = gridId2axis(grid_sx_id, grid_sy_id);
    var [_, _, ex, ey] = gridId2axis(grid_ex_id, grid_ey_id);


    rectangle(context, sx, sy, ex, ey, "yellow", "black");

    //<manage pianoroll>
    var note_id = get_random();
    for(let y=grid_sy_id; y<=grid_ey_id; y++){
        for(let x=grid_sx_id; x<=grid_ex_id; x++){
            pianoroll[y][x]=note_id
        }
    }
    //</manage pianoroll>

    //<manage note status>
    notes_status_sharpflap[note_id] = note_status_default
    //</manage note status>

    //console.log(pianoroll);
    //var input_ = document.getElementById("note")
    //input_.value = `${grid_sx_id},${grid_sy_id},${grid_ex_id},${grid_ey_id}`
}

function note_off(note_id){
    var context = canvas_element.getContext("2d"); 
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(pianoroll[v][h]==note_id){
                [sx, sy, ex, ey] = gridId2axis(h, v);
                rectangle(context, sx, sy, ex, ey, "purple", "white");
                pianoroll[v][h] = null;
                pianoroll_beat[h] = false;
            }
        }
    }

    //<manage note status>
    delete notes_status_sharpflap[note_id]
    //</manage note status>

}

//#####################################################################
//Common Functions
//#####################################################################

function line(context, sx, sy, ex, ey){
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(ex, ey);  
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.stroke();
}

function rectangle(context, sx, sy, ex, ey, color, color_stroke){
    context.beginPath ();
    context.rect( sx, sy, ex-sx, ey-sy ) ;
    context.fillStyle = color ;
    context.fill() ;
    context.strokeStyle = color_stroke ;
    context.lineWidth = 1 ;
    context.stroke() ;

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

function get_random(){
    return Math.floor(Math.random() * 10000) + 1;
}