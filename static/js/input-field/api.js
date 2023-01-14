import {
    score2json
} from './formatter.js';

function save_score_listener() {
    var data = JSON.parse(this.responseText);
    //console.log(data);

}

export const save_score=(score)=>{
    score2json(score);
    var req = new XMLHttpRequest();
    req.addEventListener("load", save_score_listener);
    const fd = new FormData();
    fd.append('score', JSON.stringify(score));
    //console.log(value);
    req.open("POST", "/input-api");
    req.send(fd);
}
