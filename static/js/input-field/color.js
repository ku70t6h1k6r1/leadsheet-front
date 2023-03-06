import{
    note_status_flat,
    note_status_natural,
    note_status_sharp
} from './main.js'
 
export var background_color_odd = "#FFFFFF";
export var background_color_sharpflat_odd  = "#F0F0F0";
export var background_color_even = "#F8F8F8";
export var background_color_sharpflat_even =  "#ECECEC";
export var grid_color = "#c0b994";
export var grid_bold_color = "#4c3c71";
export var note_natural = "#5B37CC";
export var note_sharp = "#E33059";


export const  get_background=(v, h, workspace_measure, pitch_sharpflat)=>{
    var background_color;

    if(workspace_measure[v][h]%2 == 0){
        if(pitch_sharpflat[v]){
            background_color = background_color_sharpflat_even 
        }else{
            background_color = background_color_even
        }
    }else{
        if(pitch_sharpflat[v]){
            background_color = background_color_sharpflat_odd 
        }else{
            background_color = background_color_odd
        } 
    }
    return background_color
}

export const  get_notecolor=(note_status)=>{
    if(note_status==note_status_flat){
        return note_natural
    }else if(note_status==note_status_natural){
        return note_natural
    }else if(note_status==note_status_sharp){
        return note_sharp
    }else{
        return note_natural
    }
}
