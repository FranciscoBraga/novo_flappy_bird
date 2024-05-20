console.log("flappy bird");
let frames = 0
const HIT = new Audio()
const sprites = new Image();
sprites.src = './sprites.png';
HIT.src = './efeitos/hit.wav';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function fazColisao(flappyBird, chao){
  const flappyBirdy = flappyBird.y  + flappyBird.altura
  const chaoy = chao.y

  if(flappyBirdy >= chaoy){
     return true
  }
     return false

}
//flappyBird
function criaFlappyBird(){
    const flappyBird = {
        spriteX:0,
        spriteY:0,
        largura : 33,
        altura:24,
        x:10,
        y:50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula(){
            flappyBird.velocidade = -flappyBird.pulo
        },
        atualiza(){
            if(fazColisao(flappyBird,globais.chao)){
                HIT.play()
                    mudaParaTela(TELAS.GAME_OVER);
                return
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            {spriteX:0, spriteY:0,},//asa para cima
            {spriteX:0, spriteY:26,}, //asa no meio
            {spriteX:0, spriteY:52,}, //asa para baixo
        ],
        frameAtual:0,
        atualizaFrameAtual(){
            const intervalDeFrames =10
            const passouDoIntervalo = frames % intervalDeFrames  === 0

          if(passouDoIntervalo){
            const baseDoIncremento = 1
            const incremento = baseDoIncremento + flappyBird.frameAtual
            const baseRepeticao = flappyBird.movimentos.length
            flappyBird.frameAtual = incremento  % baseRepeticao
            // console.log("[incremento]",incremento)
            // console.log("[baseRepeticao]",baseRepeticao)
            // console.log("[flappyBird.frameAtual]",flappyBird.frameAtual)
          }
            
        },
        desenha(){
            flappyBird.atualizaFrameAtual()
            const {spriteX,spriteY} = flappyBird.movimentos[flappyBird.frameAtual]
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    
    }

    return flappyBird
}

function criaChao(){
  const chao = {
    spriteX:0,
    spriteY:610,
    largura :224,
    altura:112,
    x:0,
    y:canvas.height-112,
    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );

        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
        );
    },
    atualiza(){
        const movimentoChao = 1;
        const repeteEm = chao.largura/2
        const movimentacao  = chao.x -movimentoChao

    //     console.log(['movimentoChao'],movimentoChao)
    //     console.log(['repeteEm'],repeteEm)
    //    console.log(['movimentação'],movimentacao)

       chao.x =movimentacao % repeteEm

      }
  }

  return chao
}

function criaCano(){
    const cano = {
      largura :52,
      altura:400,
     chao:{
        spriteX: 0,
        spriteY: 169,
     },
     ceu:{
        spriteX: 52,
        spriteY: 169,
     },
     espaco:80,
      desenha(){
        cano.pares.forEach(function(par) {
            const yRandom = par.y;
            const espacamentoEntreCanos = 90;
            const canoCeuX = par.x;
            const canoCeuY = yRandom;
              contexto.drawImage(
                  sprites,
                  cano.ceu.spriteX, cano.ceu.spriteY,
                  cano.largura, cano.altura,
                  canoCeuX, canoCeuY,
                  cano.largura, cano.altura,
              )
    
              const canoChaoX = par.x;
              const canoChaoY = cano.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    cano.chao.spriteX, cano.chao.spriteY,
                    cano.largura, cano.altura,
                    canoChaoX, canoChaoY,
                    cano.largura, cano.altura,
                )
                par.canoCeu = {
                    x:canoCeuX,
                    y:cano.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
           })
          },
          temColisaoComFlappyBird(par){
            const cabecaDoFlappy  = globais.flappyBird.y
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if(((globais.flappyBird.x + globais.flappyBird.largura)-5) >=par.x){
                
                if(cabecaDoFlappy <= par.canoCeu.y){
                    return true
                }
                if(peDoFlappy >= par.canoChao.y){

                    return true
                }
                return false
            }
          },
         pares:[],
         atualiza(){
            const passou100Frames = frames % 100 === 0
            if(passou100Frames){
                cano.pares.push({
                    x:canvas.width,
                    y:-150*(Math.random()+1)
                })
            }
            cano.pares.forEach(function(par){
                par.x = par.x -2

            if(cano.temColisaoComFlappyBird(par)){
                //console.log("Você perdeu")
                HIT.play()
                mudaParaTela(TELAS.GAME_OVER)
            }

             if(par.x + cano.largura <= 0){
                cano.pares.shift()
             }
         })

         },
     }
      return cano
}

function criaPlacar(){
    const placar = {
        pontuacao:0,
        desenha(){
            contexto.font = '35px "VT323"'
            contexto.textAlign='right'
            contexto.fillStyle = 'white'
            contexto.fillText(`Pontuação ${placar.pontuacao}`,canvas.width-10,35);
            placar.pontuacao    
        },
        atualiza(){
            const intervalDeFrames = 30
            const passouDoIntervalo = frames % intervalDeFrames  === 0
            if(passouDoIntervalo){
                this.pontuacao = this.pontuacao + 1
            }
        }
    }
    return placar
}

function criaMoeda(){
    const moeda = {
        spriteX:0,
        spriteY:78,
        largura : 44,
        altura:44,
        x : (canvas.width / 2)-78/2,
        y:50,
        desenha(){  
            contexto.drawImage(
                sprites,
                moeda.spriteX,moeda.spriteY,
                moeda.largura, moeda.altura,
                moeda.x, moeda.y,
            )
        },
        atualiza(){

        }
    }
    return moeda
}

const planoDeFundo = {
    spriteX:390,
    spriteY:0,
    largura : 275,
    altura:204,
    x:0,
    y:canvas.height-204,
    desenha(){
        contexto.fillStyle ='#70c5ce';
        contexto.fillRect(0,0,canvas.width,canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x+planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

const mensagemGetReady = {
    spriteX:134,
    spriteY:0,
    largura : 174,
    altura:152,
    x: (canvas.width / 2)-174/2,
    y:50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    }
}

const mensagemGameOver = {
    spriteX:134,
    spriteY:153,
    largura :226,
    altura:200,
    x: (canvas.width / 2)-226/2,
    y:50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGameOver.spriteX, mensagemGameOver.spriteY,
            mensagemGameOver.largura, mensagemGameOver.altura,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura,
        );
    }
}

const globais = {}
let telaAtiva ={}
function mudaParaTela(novaTela){
    telaAtiva = novaTela

    if(telaAtiva.inicializa){
        telaAtiva.inicializa()
        
    }
}
const TELAS = {
    INICIO:{
        inicializa(){
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao()
            globais.cano = criaCano()
        },
        desenha(){
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.flappyBird.desenha()
            mensagemGetReady.desenha()
        },
        click(){
            mudaParaTela(TELAS.JOGO)
        },
        atualiza(){
            globais.chao.atualiza()
        }
    },
    JOGO : {
        inicializa(){
            globais.placar = criaPlacar()
            globais.moeda = criaMoeda()
        },
        desenha(){
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.cano.desenha()
            globais.placar.desenha()
            globais.flappyBird.desenha()
        },
        click(){
            globais.flappyBird.pula()
        },
        atualiza(){
            globais.cano.atualiza()  
            globais.chao.atualiza()
            globais.placar.atualiza()
            globais.flappyBird.atualiza()
        }
    },
    GAME_OVER: {

        desenha(){
            mensagemGameOver.desenha()
            globais.moeda.desenha()
        },
        atualiza(){
            
        },
        click(){
            mudaParaTela(TELAS.INICIO)
        }
    }
}

function loop(){
    telaAtiva.desenha()
    telaAtiva.atualiza()
    frames = frames +1;
    requestAnimationFrame(loop);
}

window.addEventListener('click',function(){
    if(telaAtiva.click){
        telaAtiva.click()

    }
})

mudaParaTela(TELAS.INICIO)

loop();
