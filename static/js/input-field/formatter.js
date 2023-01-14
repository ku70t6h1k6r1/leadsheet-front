import {
    midinote_bottom_do ,
    pitch_range
} from './grid.js';

export const score2json=(score)=>{
    //validation
    if(score.length != pitch_range){
        return false;
    }


    var score_json = Array(score[0].length); 
    score_json.fill(null);

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
            score_json[beat] = -1;
        }else{
            //違った時
            if(note_id_current){
                score_json[beat] = pitch2midinote(pitch_onbeat);
            }else{
                score_json[beat] = -2;   
            }
            
            //note_id_past更新
            note_id_past = note_id_current
        }
    }

    if(score_json[0] == -1){
        score_json[0] = -2
    }
    console.log(score_json);


    

}

function pitch2midinote(pitch){
    return midinote_bottom_do - 1 + (pitch_range - pitch);
}