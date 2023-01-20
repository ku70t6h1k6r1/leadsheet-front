export const line = (context, sx, sy, ex, ey, color_stroke) => {
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(ex, ey);  
    context.strokeStyle = color_stroke;
    context.lineWidth = 1;
    context.stroke();
}

export const rectangle = (context, sx, sy, ex, ey, color, color_stroke) => {
    context.beginPath ();
    if(color_stroke != null){
        context.rect( sx, sy, ex-sx, ey-sy ) ;
    }else{
        context.rect( sx+1, sy+1, ex-sx-2, ey-sy-2 )
    }
    context.fillStyle = color ;
    context.fill() ;

    if(color_stroke != null){
        context.strokeStyle = color_stroke ;
        context.lineWidth = 1 ;
        context.stroke() ;
    }
}

export const text = (context, sx,sy, ex, ey, displayText) => {
    //指定したCANVASの縦横比に依存する。
    //縦:横 = (150+150+2700) : 2700 = 10:9 だとつぶれずに表示される。

    context.textAlign = "left";
    context.textBaseline = "ideographic" 
    context.font = `${80}pt serif` //cavasのheightに依存する。
    context.fillText(displayText, sx, ey);
};