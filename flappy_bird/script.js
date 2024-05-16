let canvas = document.getElementById("canvas").getContext("2d");

let obj = new Obj(0,0,360,620,"assets/images/sky.png");

function draw(){
    obj.draw();
}

function update(){
    
}

function main(){
    canvas.clearRect(0,0,360,620);
    draw();
    update();
}

setInterval(main, 100)