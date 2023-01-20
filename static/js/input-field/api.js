import {
    score2json
} from './formatter.js';

function save_score_listener() {
    var data = JSON.parse(this.responseText);
    //console.log(data);

}

export const save_score=(score, notes_status_sharpflap)=>{
    console.log(score);
    var score_json = score2json(score, notes_status_sharpflap);
    var req = new XMLHttpRequest();
    req.addEventListener("load", save_score_listener);
    const fd = new FormData();
    fd.append('score', score_json);
    //console.log(value);
    req.open("POST", "/input-api");
    req.send(fd);
}
