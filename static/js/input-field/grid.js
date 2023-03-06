import { 
    get_pitch_sharpflat
}  from './grid-funcs.js';

//<canvas>
export var canvas_width;
export var canvas_height;
export var canvas_element = document.getElementById("pianoroll");
export var scale_width;
export var scale_height;
//<//canvas>

//<canvas-chord>
export var canvas_width_chord;
export var canvas_height_chord;
export var canvas_element_chord = document.getElementById("chord");
export var scale_width_chord;
export var scale_height_chord;
export var grid_height_chord;
export var grid_width_chord;
//<//canvas-chord>


//<grid base config>
export var pitch_range = 32;
export var midinote_bottom = 53;
export const pitch_sharpflat = get_pitch_sharpflat(midinote_bottom, pitch_range);
export var beat_range = 32;
export var beat_range_chord = 8;
export var grid_par_measure = 16;
export var grid_par_quarter = 4;
export var start_grid_n = 8;
export var start_grid_n_chord = 2;
export var move_grid_n = 8;
export var move_grid_n_chord = 2;
export var grid_height;
export var grid_width;
//</grid base config>

export const load_canvas=()=>{
    //pianoroll
    canvas_width = canvas_element.clientWidth; //キャンバス実サイズ
    canvas_height = canvas_element.clientHeight;　//キャンバス実サイズ
    scale_width = canvas_element.width/canvas_width;　//　キャンパス仮想サイズ/キャンバス実サイズ
    scale_height = canvas_element.height/canvas_height; //　キャンパス仮想サイズ/キャンバス実サイズ
    grid_height = parseInt(canvas_height*scale_height / pitch_range)
    grid_width = parseInt(canvas_width*scale_width / beat_range);

    //chord
    canvas_width_chord = canvas_element_chord.clientWidth; //キャンバス実サイズ
    canvas_height_chord = canvas_element_chord.clientHeight;　//キャンバス実サイズ
    scale_width_chord = canvas_element_chord.width/canvas_width_chord;　//　キャンパス仮想サイズ/キャンバス実サイズ
    scale_height_chord = canvas_element_chord.height/canvas_height_chord; //　キャンパス仮想サイズ/キャンバス実サイズ
    grid_height_chord = parseInt(canvas_height_chord*scale_height_chord)
    grid_width_chord = parseInt(canvas_width_chord*scale_width_chord / beat_range_chord);

    //console.log(canvas_width_chord, canvas_width);
    //console.log(grid_width_chord, grid_width);
}

export const next_grids=()=>{
    start_grid_n = start_grid_n + move_grid_n;
    start_grid_n_chord = start_grid_n_chord + move_grid_n_chord;
}


export const past_grids=()=>{
    if(start_grid_n >= move_grid_n){
        start_grid_n = start_grid_n - move_grid_n;
    }
    if(start_grid_n_chord >= move_grid_n_chord){
        start_grid_n_chord = start_grid_n_chord - move_grid_n_chord;
    }
}
