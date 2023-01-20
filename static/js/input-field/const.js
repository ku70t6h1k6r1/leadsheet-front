//musicai-leadsheetのcommon\const.pyと同期

export const get_const_values=()=>{
    var const_values = {
        "type____chord_progression" : "chord-progression",
        "type____chord_progression_symbol" : "chord-progression-symbol",
        "type____key" : "key",
        "type____melody" : "melody",
        "note_hold" : -1,
        "note_rest" : -2,
        "midinote_lowest" : 55,
        "midinote_highest" : 86,
        "midinote_G4" : 67,
        "midinote_lowest_root" : 58,
        "midinote_highest_root" : 69,
        "scale_quality____major" : 0,
        "scale_quality____naturalminor" : 1,
        "scale_quality____harmonicminor" : 2,
        "timesignature_44" : "4/4",
        "timesignature_34" : "3/4",
        "division_1" : 1,
        "division_2" : 2,
        "division_16" : 16,
        "division_12" : 12
    };
    return const_values
}


export const keyFifths=(root, quality)=>{
    var const_values = get_const_values()

    if(quality==const_values.scale_quality____naturalminor || quality==const_values.scale_quality____harmonicminor ){
        root = (root + 3 ) % 12;
    }
        
    
    if(root == 0){
        //C Am
        return 0
    }else if(root == 7){
        //G Em
        return 1
    }else if(root == 2){
        //D Bm
        return 2
    }else if(root == 9){
        //A F#m
        return 3
    }else if(root == 4){
        //E C#m
        return 4
    }else if(root == 11){
        //B G#m
        return 5
    }else if(root == 5){
        //F Dm
        return -1 
    }else if(root == 10){
        //Bb Gm
        return -2
    }else if(root == 3){
        //Eb Cm
        return -3
    }else if(root == 8){
        //Ab Fm
        return -4
    }else if(root == 1){
        //Db Bbm
        return -5
    }else if(root == 6){
        //Gb Ebm
        return -6
    }else{
        return 0
    }    
}
