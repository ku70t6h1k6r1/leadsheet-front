import {
    grid_height,
    grid_width,
    pitch_range,
    beat_range
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
export const gridId2axis=(grid_x_id, grid_y_id)=>{
    //console.log(grid_width, grid_height)
    var sx = grid_x_id*grid_width;
    var sy = grid_y_id*grid_height;
    var ex = (grid_x_id+1)*grid_width;
    var ey = (grid_y_id+1)*grid_height;

    return [sx, sy, ex, ey]
}

export const grid_enable=(pianoroll, grid_x_id)=>{
    var enable = true;
    for(let v = 0; v < pitch_range; v++){
        if (pianoroll[v][grid_x_id] != null){
            enable = false;
            break
        }
    }
    return enable
}