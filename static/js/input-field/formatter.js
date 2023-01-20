import {
    grid_par_measure,
    midinote_bottom,
    pitch_range,
    start_grid_n
} from './grid.js';

import {
    get_const_values,
    keyFifths
} from './const.js';

var const_values = get_const_values();

export const score2json=(score, notes_status_sharpflap)=>{
    //validation
    if(score.length != pitch_range){
        return JSON.stringify(Array(0)), JSON.stringify(Array(0)); 
    }
    //validation

    var score_proced = Array(score[0].length); 
    score_proced.fill(null);
    var score_proced_sharpflat = Array(score[0].length); 
    score_proced_sharpflat.fill(null);

    var note_id_past = null;
    for(let beat=0; beat < score[0].length; beat++){
        //
        var pitch_onbeat = null;

        //そのビートのピッチを抽出
        var note_id_current = null
        for(let pitch=0; pitch < pitch_range; pitch++ ){
            if(score[pitch][beat]){
                note_id_current = score[pitch][beat];
                pitch_onbeat = pitch;
            }
        }

        //前のビートと比較
        if(note_id_current == note_id_past){
            //同じだった時
            score_proced[beat] = const_values.note_hold;
        }else{
            //違った時
            if(note_id_current){
                score_proced[beat] = pitch2midinote(pitch_onbeat);
                if(note_id_current !==null){
                    score_proced_sharpflat[beat] = notes_status_sharpflap[note_id_current]
                }
            }else{
                score_proced[beat] = const_values.note_rest;   
            }
            
            //note_id_past更新
            note_id_past = note_id_current
        }
    }

    //最初の処理
    if(score_proced[0] == const_values.note_hold){
        score_proced[0] = const_values.note_rest
    }
    //最後、端切れの処理
    for(let i=0; i < score_proced.length % grid_par_measure; i++){
        if(i==0){
            score_proced.push(const_values.note_rest)
        }else{
            score_proced.push(const_values.note_hold)
        }
    }
    

    //JSON化
    var bar = null;
    var content = Array(0);
    var bars = Array(0);
    var key = keyFifths(0, const_values.scale_quality____major);
    var timesignature = const_values.timesignature_44;
    var division = const_values.division_16;
    
    for(let i=0; i < score_proced.length; i++){
        if(i%division==0){
            if(bar !== null){
                bar.content = content;
                bar.division = division;
                bar.key = key;
                bar.timesignature = timesignature;
                bars.push(bar);
            }
            bar = template_bar();
            content = Array(division);
            
        }
        content[i%division]=[score_proced[i], score_proced_sharpflat[i]];
    }

    //最後の処理
    if(bar !== null){
        bar.content = content;
        bar.division = division;
        bar.key = key;
        bar.timesignature = timesignature;
        bars.push(bar);
    }


    return JSON.stringify(bars)

}

function pitch2midinote(pitch){
    return midinote_bottom - 1 + (pitch_range - pitch);
}

function template_bar(){
    var bar = {
        "key" : null,
        "timesignature" : null,
        "division" : null,
        "content" : Array(0)

     }
    return bar 
}