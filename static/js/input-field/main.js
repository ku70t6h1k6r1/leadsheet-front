import {
        load_canvas,
        canvas_element,
        scale_width,        
        scale_height,
        pitch_range,
        midinote_bottom,
        pitch_sharpflat,
        beat_range,
        beat_range_chord,
        grid_par_measure,
        grid_par_quarter,
        start_grid_n,
        start_grid_n_chord,
        next_grids,
        past_grids,

        canvas_element_chord,
        scale_width_chord,
        scale_height_chord,
        grid_height_chord,
        grid_width_chord   

    } from './grid.js';
import { 
    cursor2gridId, 
    gridId2cursor,
    gridId2axis, 
    grid_enable, 
    get_random,

    cursor2gridId_for_chord,
    gridId2axis_for_chord,
    get_chord
}  from './grid-funcs.js';
import { 
    line, 
    rectangle,
    text
}  from './grid-draw.js';
import { 
        grid_color, 
        grid_bold_color, 
        note_natural, 
        note_sharp,
        background_color_odd,
        get_background,
        get_notecolor
    }  from './color.js';
    
import {
    save_score
} from './api.js'
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
var score_chord = [];
var workspace_chord = [];
var score = [];
var workspace_melody = [];
var notes_status_sharpflap = {};
var workspace_measure=[]
//</status dicts>

window.addEventListener("load", canvas);
 
function canvas(){
    load_canvas();
    load_workspace();
    load_chord();
    load_command();
}

function next_workspace(){   
    dump_score()
    next_grids()
    load_workspace();
    load_chord();
}

function past_workspace(){   
    dump_score()
    past_grids()
    load_workspace();
    load_chord();
}

function dump_score(){
    //Note
    for(let v = 0; v < pitch_range; v++){
        if(score.length <= v ){
            score[v] = [];
            for(let i=0; i < start_grid_n; i++){
                score[v][i] = null;
            }
        }
        for(let h = 0; h < beat_range; h++){
            score[v][h+start_grid_n] = workspace_melody[v][h];
        }
    }

    //Chord
    //----initialize
    if(score_chord.length == 0){
        for(let i=0; i < start_grid_n_chord; i++){
            score_chord[i] = null;
        }          
    }

    for(let h = 0; h < beat_range_chord; h++){
        score_chord[h+start_grid_n_chord] = workspace_chord[h];
    }
}

function execute_save_score(){
    dump_score();
    save_score(score, notes_status_sharpflap);
}

function load_command(){
    var nextMeasureBtn = document.getElementById("next-measure");
    nextMeasureBtn.addEventListener('click', next_workspace)
    var pastMeasureBtn = document.getElementById("past-measure");
    pastMeasureBtn.addEventListener('click', past_workspace)
    var saveBtn = document.getElementById("save");
    saveBtn.addEventListener('click', execute_save_score);

}

export const load_workspace = () => {
    //Note
    if(score.length == 0){
        for(let v = 0; v < pitch_range; v++){
            workspace_melody[v] = [];
            for(let h = 0; h < beat_range; h++){
                workspace_melody[v][h] = null;
            }
        }
    }else{
        for(let v = 0; v < pitch_range; v++){
            workspace_melody[v] = [];
            for(let h = 0; h < beat_range; h++){
                var h_absolute = h + start_grid_n;
                if(h_absolute < score[v].length){
                    workspace_melody[v][h] = score[v][h_absolute];

                }
            }
        }
    }

    //<base measure_id>
    for(let v = 0; v < pitch_range; v++){
        workspace_measure[v] = [];
        for(let h = 0; h < beat_range; h++){
            var add_measure_id = Math.floor( (h+start_grid_n) /grid_par_measure);
            workspace_measure[v][h] = measure_id + add_measure_id;
        }
    }  
    //</base measure_id>

    //<base grid>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            note_reset(h, v, workspace_measure, pitch_sharpflat)
        }
    }    
    //</base grid>

    //<note on>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(workspace_melody[v][h]){
                note_on_by_note_id(workspace_melody[v][h], workspace_melody, notes_status_sharpflap)
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

export const load_chord = () => {
    const buttonClose = document.getElementsByClassName('modalClose')[0];
    buttonClose.addEventListener('click', close_chordmodal);
    const buttonSubmit = document.getElementsByClassName('modalSubmit')[0];
    buttonSubmit.addEventListener('click', submit_chordmodal);


    canvas_element_chord.addEventListener("click",open_chordmodal);
    var context_chord = canvas_element_chord.getContext("2d");

    //Chord
    if(score_chord.length == 0){
        workspace_chord = [];
        for(let h = 0; h < beat_range_chord; h++){
            workspace_chord[h] = null;
        }     
    }else{
        workspace_chord = []; 
        for(let h = 0; h < beat_range_chord; h++){
            var h_absolute = h + start_grid_n_chord;
            if(score_chord[h_absolute]!==undefined){
                workspace_chord[h] = score_chord[h_absolute];
            }else{
                workspace_chord[h] = null; 
            }      
        }

    }    
    
    for(let x=0; x < beat_range_chord; x++){
        var [sx, sy, ex, ey] = gridId2axis_for_chord(x)
        rectangle(context_chord, sx, sy, ex, ey, background_color_odd, "#000000");
        
        if(workspace_chord[x] !== null){
            text(context_chord, sx, sy, ex, ey, get_chord(workspace_chord[x]));
        }else{
            text(context_chord, sx, sy, ex, ey, "");
        }  
    }

    var select_chord_root = document.getElementById('chord-root');
    select_chord_root.addEventListener('change', display_chordSymbol);
    var select_chord_kind = document.getElementById('chord-kind');
    select_chord_kind.addEventListener('change', display_chordSymbol );
}

function open_chordmodal(e) {
    var modal = document.getElementById('chord-modal');
    modal.style.display = 'block';
    const rect = e.target.getBoundingClientRect();
    const viewX = e.clientX - rect.left;

    var x = viewX*scale_width_chord;
    var grid_id_x = cursor2gridId_for_chord(x);

    //初期化(同じ要素使い回しているから、毎回初期化が必要)
    var chordSymbol = document.getElementById("chord-symbol");
    chordSymbol.dataset.gridid =  grid_id_x;
    if(workspace_chord[grid_id_x] !== null){
        chordSymbol.dataset.root = workspace_chord[grid_id_x][0];
        chordSymbol.dataset.kind = workspace_chord[grid_id_x][1]; 
        var chordRoot = document.getElementById("chord-root"); 
        chordRoot.value = chordSymbol.dataset.root;
        var chordKind = document.getElementById("chord-kind");
        chordKind.value = chordSymbol.dataset.kind;
        chordSymbol.innerText = `${chordRoot.options[chordRoot.selectedIndex].innerText}${chordKind.options[chordKind.selectedIndex].innerText}`;
    }else{
        var chordRoot = document.getElementById("chord-root"); 
        chordRoot.value = chordRoot.options[0].value;
        var chordKind = document.getElementById("chord-kind");
        chordKind.value = chordKind.options[0].value;
        chordSymbol.innerText = `${chordRoot.options[0].innerText}${chordKind.options[0].innerText}`;

    }
}


function submit_chordmodal() {
    var modal = document.getElementById('chord-modal');
    var chordSymbol = document.getElementById("chord-symbol");
    //if(chordSymbol.dataset.gridid !== ""){
    var grid_id = parseInt(chordSymbol.dataset.gridid); 
    workspace_chord[grid_id] = [chordSymbol.dataset.root, chordSymbol.dataset.kind];
    //}
    modal.style.display = 'none';
    edit_chord(parseInt(chordSymbol.dataset.gridid));
}

function close_chordmodal() {
    var modal = document.getElementById('chord-modal');
    modal.style.display = 'none';
}


//<mouse event handler>
function mousemove(e){
   if(grid_on){
        const rect = e.target.getBoundingClientRect();
        const viewX = e.clientX - rect.left;
        var grid_ex_temp = viewX*scale_width;
        var [grid_id_ex_temp, _] = cursor2gridId(grid_ex_temp, 0);
        
    
        if(grid_id_ex_temp > grid_id_ex){
            if(grid_enable(workspace_melody, grid_id_ex_temp)){
                grid_ex=grid_ex_temp;
                [grid_id_ex, _] = cursor2gridId(grid_ex, 0);
            }else{
                grid_on = false;
            }
        }
        note_on(grid_sx, grid_sy, grid_ex, grid_ey, workspace_melody, notes_status_sharpflap);
    }
}

function mouseup(e){
    //<クリックしただけ>
    if(grid_on && grid_sx==grid_ex){
        note_on(grid_sx, grid_sy, grid_ex, grid_ey, workspace_melody, notes_status_sharpflap);
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
    if(grid_enable(workspace_melody, grid_id_sx)){
        var note_id = get_random();
        workspace_melody[grid_id_sy][grid_id_sx] = note_id;
        if(pitch_sharpflat[grid_id_sy]){
            notes_status_sharpflap[note_id] = note_status_flat
        }else{
            notes_status_sharpflap[note_id] = note_status_natural
        }
        grid_on = true;
    }else{
        grid_on = false;
        //すでにONになっている。
        var note_id = workspace_melody[grid_id_sy][grid_id_sx];
        if(note_id){
            if(pitch_sharpflat[grid_id_sy]){
                var status = notes_status_sharpflap[note_id]
                console.log(status);
                if(status === note_status_natural ){
                    console.log("この条件にはこないはず1")
                }else if(status === note_status_sharp ){
                    delete notes_status_sharpflap[note_id];
                    note_off(note_id, workspace_melody, notes_status_sharpflap);                
                }else if(status === note_status_flat ){
                    notes_status_sharpflap[note_id] = note_status_sharp;
                    note_on_by_note_id(note_id,  workspace_melody, notes_status_sharpflap);
                }else if(status === undefined){
                    console.log("この条件にはこないはず2")
                    notes_status_sharpflap[note_id] = note_status_flat;
                    note_on_by_note_id(note_id,  workspace_melody, notes_status_sharpflap);
                }else{
                    console.log("この条件にはこないはず3")
                }
            }else{
                delete notes_status_sharpflap[note_id]
                note_off(note_id, workspace_melody); 
            }
        }
    }
    //</note status change or delete>
}
//</mouse event handler>


function edit_chord(grid_id_x){
    var chordRoot = document.getElementById("chord-root"); 
    
    var context_chord = canvas_element_chord.getContext("2d");
    var [sx, sy, ex, ey] = gridId2axis_for_chord(grid_id_x)
    rectangle(context_chord, sx, sy, ex, ey, background_color_odd, "#000000");
    
    //var beat_id = start_grid_n_chord + grid_id_x;
    if(workspace_chord[grid_id_x] !== null){           
        text(context_chord, sx, sy, ex, ey, get_chord(workspace_chord[grid_id_x]));
    }else{
        text(context_chord, sx, sy, ex, ey, "NULL");
    } 
}

function display_chordSymbol(){
    var chordRootSelect = document.getElementById("chord-root");
    var chordRoot = chordRootSelect.options[chordRootSelect.selectedIndex].text;
    var chordRootValue = chordRootSelect.options[chordRootSelect.selectedIndex].value;
    var chordKindSelect = document.getElementById("chord-kind");
    var chordKind = chordKindSelect.options[chordKindSelect.selectedIndex].text;
    var chordKindValue = chordKindSelect.options[chordKindSelect.selectedIndex].value;
    var chordSymbol = document.getElementById("chord-symbol");
    chordSymbol.innerText = `${chordRoot}${chordKind}`;
    chordSymbol.dataset.root = chordRootValue;
    chordSymbol.dataset.kind = chordKindValue;
}

function note_on_by_note_id(note_id, workspace_melody, notes_status_sharpflap){
    var context = canvas_element.getContext("2d");    
    var grid_id_sx_temp = null;
    var grid_id_sy_temp = null;
    var grid_id_ex_temp = null;
    var grid_id_ey_temp = null;

    //<manage workspace>
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(workspace_melody[v][h]==note_id){
                if(grid_id_sx_temp===null){
                    grid_id_sx_temp = h;
                    grid_id_sy_temp = v;
                }
                grid_id_ex_temp = h;
                grid_id_ey_temp = v;
            }
        }
    }
    //</manage workspace>

    var [sx, sy, _, _] = gridId2axis(grid_id_sx_temp, grid_id_sy_temp);
    var [_, _, ex, ey] = gridId2axis(grid_id_ex_temp, grid_id_ey_temp);
    var note_color = get_notecolor(notes_status_sharpflap[note_id]);
    rectangle(context, sx, sy, ex, ey, note_color, null);
}

function note_on(sx_cursor, sy_cursor, ex_cursor, ey_cursor, workspace_melody, notes_status_sharpflap){
    var context = canvas_element.getContext("2d");    
    var [grid_sx_id, grid_sy_id] = cursor2gridId(sx_cursor, sy_cursor);
    var [grid_ex_id, grid_ey_id] = cursor2gridId(ex_cursor, ey_cursor);
    var [sx, sy, _, _] = gridId2axis(grid_sx_id, grid_sy_id);
    var [_, _, ex, ey] = gridId2axis(grid_ex_id, grid_ey_id);

    var note_id = workspace_melody[grid_sy_id][grid_sx_id]
    
    for(let y=grid_sy_id; y<=grid_ey_id; y++){
        for(let x=grid_sx_id; x<=grid_ex_id; x++){
            workspace_melody[y][x]=note_id
        }
    }
    //</manage workspace>

    var note_color = get_notecolor(notes_status_sharpflap[note_id]);
    rectangle(context, sx, sy, ex, ey, note_color, null);
}

function note_off(note_id, workspace_melody){
    for(let v = 0; v < pitch_range; v++){
        for(let h = 0; h < beat_range; h++){
            if(workspace_melody[v][h]==note_id){
                note_reset(h, v, workspace_measure, pitch_sharpflat)
                workspace_melody[v][h] = null;
            }
        }
    }
}

function note_reset(h, v, workspace_measure, pitch_sharpflat){
    var context = canvas_element.getContext("2d"); 
    var [sx, sy, ex, ey] = gridId2axis(h, v);
    var background_color = get_background(v, h, workspace_measure, pitch_sharpflat);
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
    var midinote_id = (midinote_bottom+12)%12;
    if(midinote_id == 12 - 1){
        [sx, sy, _, _] = gridId2axis(h, v+1);
        [_, _, ex, ey] = gridId2axis(h, v);
        line(context, sx, sy, ex, ey, grid_bold_color);
    }
    if(midinote_id == 0){
        [sx, sy, _, _] = gridId2axis(h, v);
        [_, _, ex, ey] = gridId2axis(h, v-1);
        line(context, sx, sy, ex, ey, grid_bold_color);
    }
    //</horizontal>
}