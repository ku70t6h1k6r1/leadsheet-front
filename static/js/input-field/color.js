export var background_color_odd = "#FFFFFF";
export var background_color_sharpflat_odd  = "#F0F0F0";
export var background_color_even = "#F8F8F8";
export var background_color_sharpflat_even =  "#ECECEC";
export var grid_color = "#c0b994";
export var grid_bold_color = "#4c3c71";
export var note_natural = "#5B37CC";
export var note_sharp = "#E33059";

export const  get_background=(v, h, pianoroll_measure, pitch_sharpflat, grid_par_octave)=>{
    var background_color;

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