//<canvas>
export var canvas_width;
export var canvas_height;
export var canvas_element = document.getElementById("pianoroll");
export var scale_width;
export var scale_height;
//<//canvas>

//<grid base config>
export var pitch_range = 24;
export const pitch_sharpflat = [false, true, false, true, false, true, false, false, true, false, true, false];
export var beat_range = 32;
export var grid_par_measure = 16;
export var grid_par_quarter = 4;
export var grid_par_octave = 12;
export var start_grid_n = 8;
export var move_grid_n = 8;
export var grid_height;
export var grid_width;
//</grid base config>

export const load_canvas=()=>{
    canvas_width = canvas_element.clientWidth; //キャンバス実サイズ
    canvas_height = canvas_element.clientHeight;　//キャンバス実サイズ
    scale_width = canvas_element.width/canvas_width;　//　キャンパス仮想サイズ/キャンバス実サイズ
    scale_height = canvas_element.height/canvas_height; //　キャンパス仮想サイズ/キャンバス実サイズ

    grid_height = parseInt(canvas_height*scale_height / pitch_range)
    grid_width = parseInt(canvas_width*scale_width / beat_range);
}

export const next_grids=()=>{
    start_grid_n = start_grid_n + move_grid_n;
}


export const past_grids=()=>{
    if(start_grid_n >= move_grid_n){
        start_grid_n = start_grid_n - move_grid_n;
    }
}
