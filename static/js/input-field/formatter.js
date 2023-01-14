import {
    midinote_bottom_do ,
    pitch_range
} from './grid.js';

export const score2json=(score)=>{
    console.log(score[0].length);
    var score_json = Array(score[0].length); //配列が空だったらエラーが出る。
    score_json.fill(null);

    var note_id_past = null;
    for(let pitch=0; pitch < score.length; pitch++ ){
        for(let beat=0; beat < score[pitch].length; beat++){
            if(score_json[beat] === null){
                if(score[pitch][beat]){
                    if(note_id_past==score[pitch][beat]){
                        score_json[beat] = -1;
                    }else{
                        score_json[beat] = pitch2midinote(pitch);
                    }
                    
                    console.log(pitch2midinote(pitch));
                    note_id_past = score[pitch][beat];
                }else{
                    if(note_id_past==-2){
                        score_json[beat] = -1;
                    }else{
                        score_json[beat] = -2;
                    }               
                    note_id_past = -2
                }    
            }
        }
    }

    console.log(score_json);

}

function pitch2midinote(pitch){
    return midinote_bottom_do - 1 + (pitch_range - pitch);
}