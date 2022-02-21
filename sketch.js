var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var player, player_correndo, player_colidiu, ataque;
var solo, soloinvisivel, imagemdosolo;

var life = 3;
var vidaIMG;

var backg;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var imgFimDeJogo,imgReiniciar
var somSalto , somCheckPoint, somMorte

function preload(){
  player_correndo = loadAnimation("corrida/corrida.png","corrida/corrida1.png","corrida/corrida2.png","corrida/corrida3.png","corrida/corrida4.png","corrida/corrida5.png","corrida/corrida6.png","corrida/corrida7.png");
  player_colidiu = loadAnimation("dano.png");
  ataque = loadAnimation("ataque/ataque1.png","ataque/ataque2.png","ataque/ataque3.png","ataque/ataque4.png")

  imagemdosolo = loadImage("road.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  backg = loadImage("sky.png")

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgReiniciar = loadImage("restart.png");
  imgFimDeJogo = loadImage("gameOver.png");
  vidaIMG  = loadImage("armor5.png");
  
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  
  player = createSprite(50,180,20,50);
  
  player.addAnimation("running", player_correndo);
  player.addAnimation("collided", player_colidiu);
  player.addAnimation("atacou", ataque)
  
  player.scale = 1,0;
  
  solo = createSprite(100,20,10000,20);
  solo.addImage("ground",imagemdosolo);
  //solo.x = solo.width /2;
  solo.scale = 0.4  

  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
    
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
      
  player.setCollider("rectangle",0,0,player.width,player.height);
  player.debug = true
  pontuacao = 0;
  
  
}

function draw() {
  console.log(player);
  background(backg);
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
  
  
  
  if(estadoJogo === JOGAR){
    
    showLife();

    fimDeJogo.visible = false
    reiniciar.visible = false
    //mudar a animação do player
    
    player.changeAnimation("running", player_correndo);
    solo.velocityX = -(4 + 3* pontuacao/100)
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameRate()/60);
    
    if(pontuacao>0 && pontuacao%100 === 0){
      somCheckPoint.play() 
    }
    
    if (solo.x < 200){
      solo.x = solo.width/5;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& player.y >= 150) {x
       player.velocityY = -13;
       somSalto.play();
 
  }

    if(keyDown("LEFT_ARROW")){
      player.changeAnimation("atacou",ataque);
    }
  
    //adicionar gravidade
    player.velocityY = player.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(player.isTouching(grupodeobstaculos)&& player.animation == ataques){
       //player.velocityY = -12;
        somSalto.play();
        life -=1;
        somMorte.play()
        grupodeobstaculos.destroyEach()
      
    }
    if(life ===0){
      estadoJogo = ENCERRAR
    }
  }
     else if (estadoJogo === ENCERRAR) {
      fimDeJogo.visible = true;
      reiniciar.visible = true;
      //altera a animação do player
      player.changeAnimation("collided", player_colidiu);
      if(mousePressedOver(reiniciar)){
       reset();
      
     
      }
       
       
      solo.velocityX = 0;
      player.velocityY = 0
       
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);   
     }
  
  
  //evita que o player caia no solo
  player.collide(soloinvisivel);
  
  
    
  drawSprites();
}

function reset(){
  estadoJogo = JOGAR;
  
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  life = 3;

  pontuacao = 0;
}


function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -(6 + pontuacao/100);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = player.depth;
    player.depth = player.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

function showLife(){
  for(var i = 0; i < life; i++){
    imageMode(CENTER);
    image(vidaIMG, 20 + 20*i, 30, 20, 20);
  }

}

