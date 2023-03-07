import {
    pitch_range,
    
    beat_range,
    grid_height,
    grid_width,
    
    beat_range_chord,
    grid_height_chord,
    grid_width_chord,

    beat_range_rehearsal,
    grid_height_rehearsal,
    grid_width_rehearsal,
} from './grid.js';


export const get_random=()=>{
    return Math.floor(Math.random() * 10000) + 1;
}

export const cursor2gridId=(x_cursor, y_cursor)=>{
    var grid_x_id = 0;
    var grid_y_id = 0;

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


export const gridId2cursor=(grid_x_id, grid_y_id)=>{

    var x_cursor = grid_width * (grid_x_id + 0.5);
    var y_cursor = grid_height * (grid_y_id + 0.5);

    return [x_cursor, y_cursor]
}

export const gridId2axis=(grid_x_id, grid_y_id)=>{
    //console.log(grid_width, grid_height)
    var sx = grid_x_id*grid_width;
    var sy = grid_y_id*grid_height;
    var ex = (grid_x_id+1)*grid_width;
    var ey = (grid_y_id+1)*grid_height;

    return [sx, sy, ex, ey]
}

export const grid_enable=(workspace, grid_x_id)=>{
    var enable = true;
    for(let v = 0; v < pitch_range; v++){
        if (workspace[v][grid_x_id] != null){
            enable = false;
            break
        }
    }
    return enable
}

export const get_pitch_sharpflat=(midinote_bottom, pitch_range)=>{
    var pitch_sharpflat_1oct = [false, true, false, true, false, false, true, false, true, false, true,false];
    var pitch_sharpflat = Array(pitch_range);
    var midinote_rel = midinote_bottom%12 ;  

    for(let i=0; i < pitch_range; i++){
        pitch_sharpflat[i] = pitch_sharpflat_1oct[ (midinote_rel + i)%12 ];
    };
    var pitch_sharpflat_rev = pitch_sharpflat.reverse();

    return pitch_sharpflat_rev
}

export const cursor2gridId_for_chord=(x_cursor)=>{
    var grid_x_id = 0;

    for(let h = 0; h < beat_range_chord; h++){
        if((grid_x_id+1)*grid_width_chord<x_cursor){
            grid_x_id += 1;
        }else{
            break
        }
    }
    return grid_x_id
}

export const cursor2gridId_for_rehearsal=(x_cursor)=>{
    var grid_x_id = 0;

    for(let h = 0; h < beat_range_rehearsal; h++){
        if((grid_x_id+1)*grid_width_rehearsal<x_cursor){
            grid_x_id += 1;
        }else{
            break
        }
    }
    return grid_x_id
}

export const gridId2axis_for_chord=(grid_x_id)=>{
    var grid_y_id  = 0;
    var sx = grid_x_id*grid_width_chord;
    var sy = grid_y_id*grid_height_chord;
    var ex = (grid_x_id+1)*grid_width_chord;
    var ey = (grid_y_id+1)*grid_height_chord;

    return [sx, sy, ex, ey]
}

export const gridId2axis_for_rehearsal=(grid_x_id)=>{
    var grid_y_id  = 0;
    var sx = grid_x_id*grid_width_rehearsal;
    var sy = grid_y_id*grid_height_rehearsal;
    var ex = (grid_x_id+1)*grid_width_rehearsal;
    var ey = (grid_y_id+1)*grid_height_rehearsal;

    return [sx, sy, ex, ey]
}

export const get_chord=(content)=>{
    var root = chordRoot_by_rootId(content[0]);
    var kind = chordSymbol_by_kindname(content[1]);

    return `${root}${kind}`
}

export const chordSymbol_by_kindname=(kindname)=>{
    var chordKind = document.getElementById("chord-kind");
    var options = chordKind.options;
    var chordSymbol = null;
    for(let i = 0; i < options.length; i++ ){
        if(options[i].value == kindname ){
            chordSymbol = options[i].innerText; 
            break
        }
    }

    return chordSymbol;
}

export const chordRoot_by_rootId=(roortId)=>{
    var chordRoot = document.getElementById("chord-root");
    var options = chordRoot.options;
    var chordRoot = null;
    for(let i = 0; i < options.length; i++ ){
        if(options[i].value == roortId ){
            chordRoot = options[i].innerText; 
            break
        }
    }

    return chordRoot;
}

export const display_chordSymbol=()=>{
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

export const display_rehearsalMark=()=>{
    var rehearsalMarkSelect = document.getElementById("rehearsal-mark");
    var rehearsalMark = rehearsalMarkSelect.options[rehearsalMarkSelect.selectedIndex].text;
    var rehearsalMarkValue = rehearsalMarkSelect.options[rehearsalMarkSelect.selectedIndex].value;
    var rehearsalMarkSymbol = document.getElementById("rehearsal-mark-symbol");
    rehearsalMarkSymbol.innerText = `${rehearsalMark}`;
    rehearsalMarkSymbol.dataset.rehearsal = rehearsalMarkValue ;
}