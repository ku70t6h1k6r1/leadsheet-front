window.addEventListener("load", el_change_drawer);

function el_change_drawer(){
    var menu = document.getElementById("menu");
    menu.addEventListener('click', change_drawer)
}

function change_drawer(){
    var drawer = document.getElementById("drawer");
    var classname = drawer.className;
    if(classname == "open"){
        drawer.setAttribute("class", "")
    }else{
        drawer.setAttribute("class", "open")
    }


    var main = document.getElementById("main");
    classname = main.className;
    if(classname == "open"){
        main.setAttribute("class", "")
    }else{
        main.setAttribute("class", "open")
    }

}