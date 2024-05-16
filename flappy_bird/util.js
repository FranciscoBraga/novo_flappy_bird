class Obj{
    constructor(x,y,width,height, imagem){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imagem = imagem

    }

    draw(){
        let img = new Image()
        img.src = this.imagem
        canvas.drawImage(img,this.x, this.y, this.width, this.height)
    }
}