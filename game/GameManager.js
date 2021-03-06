var screenHeight=640, screenWidth=800, posX=screenWidth/2, playerRect, borderRect;
var highScore, gameOver=false, lifes=3, invencible=false; invencibleTime=2000, scoreNum=0, enemyPoints=10;
var canShot = true, enemyCanShot=true, canRandEnemy=true, player, playerShots, enemyShots, enemies, currentEnemy;
var moveSpeed = 5, shotSpeed = 8, enemySpeed=1, playerSize = 32, enemyDownSpeed=8;
var heightLimit=screenHeight-playerSize-11, widthLimit=screenWidth-playerSize-1;
var moveLeft = false, moveRight = false, moveEnemyLeft=false, lastEnemy=false;
var difficult=1, MinTurn=2, turnsToUpSpeed=MinTurn, win=false, endButtonCreated=false, endButton;
var bkRect;

function update(){
  if (!player) {
    nextLevel();

    bkRect = document.documentElement.querySelector('.background').getBoundingClientRect();
  }

  if (!gameOver){
    if (enemies) {
      for (var i=0; i < enemies.length; i++){
        var enemyRect = enemies[i].getBoundingClientRect();

        if (enemyRect.bottom >= playerRect.top) {
          var hitSnd = new Audio("sounds/hit.ogg"); // buffers automatically when created
          hitSnd.play();
          lifes = -1;
          scoreNum -= 200;
          gameOver = true;
        }
      }
      /*enemies.forEach(function(e) {
        var enemyRect = e.getBoundingClientRect();

        if (enemyRect.bottom >= playerRect.top) {
          var hitSnd = new Audio("../sounds/hit.ogg"); // buffers automatically when created
          hitSnd.play();
          lifes = -1;
          scoreNum -= 200;
          gameOver = true;
        }
      });*/

      if (enemies.length > 1){
        enemies = document.querySelectorAll('.enemy');
        if (enemyCanShot && canRandEnemy){
          canRandEnemy = false;
          var rand = Math.floor((Math.random() * enemies.length));
          currentEnemy = enemies[rand];
          initShot('enemyShot', false);
        }
      } else {
        if (!lastEnemy){
          lastEnemy = true;
          enemySpeed+=2;
        }
      }

      moveEnemies();
    }

    if (enemies.length <= 0) {
      win = true;
    }

    movePlayer();
    movePlayerShots();
    
    moveEnemyShots();

    if (lifes < 0 || win) {
      gameOver = true;
    }
  }
  else {
    WriteCookie();
    if (!win) {
      if (!endButtonCreated){
        endButtonCreated = true;

        deleteAllEnemies();
        deleteAllShots();
        player.parentNode.removeChild(player);
        
        endGame_Lost();
      }
    }
    else {
      if (!endButtonCreated){
        endButtonCreated = true;

        deleteAllShots();
        player.parentNode.removeChild(player);

        endGame_Win();
      }
    }
  }
}

// ------------ Keyboard -------------
function keyPress(evt) {
  if (lifes < 0)
    return;

  var charCode = evt.keyCode || evt.which;

  if ((charCode == '122' || charCode == '32') && canShot) { //Z or SPACE
    if (!win){
      initShot('playerShot', true);
    } else {

    }
  }
};

function checkKeyDown(e) {
  if (lifes < 0 || win)
    return;

  e = e || window.event;

  if (e.keyCode == '37') { //<-
    moveLeft = true;
    moveRight = false;
  }
  else if (e.keyCode == '39') { //->
    moveRight = true;
    moveLeft = false;
  }
  movePlayer();
}

function checkKeyUp(e) {
  if (lifes < 0)
    return;

  e = e || window.event;

  if (e.keyCode == '37') { //<-
    moveLeft = false;
  }
  else if (e.keyCode == '39') { //->
    moveRight = false;
  }
}

// ------------ Cookies -------------
function WriteCookie(/*cExDays*/) {
  /*var d = new Date();
  d.setTime(d.getTime() + (cExDays*24*60*60*1000));*/
  if (window.localStorage.highscore === undefined || window.localStorage.highscore < scoreNum){
    window.localStorage.highscore = scoreNum/*+'; expires='+d.toUTCString()*/;
    console.log ('Setting localStorage : Score: ' + window.localStorage.highscore);
  }
}

function ReadCookie() {
  if (window.localStorage.highscore === undefined) {
    return 0;
  } else {
    return window.localStorage.highscore;;
  }
}

// ------------ Delete Stuff ------------
function deleteAllEnemies(){
  var cont;
  if (enemies) {
    cont = enemies.length;
    for (var i=0; i < cont; i++){
      enemies[i].parentNode.removeChild(enemies[i]);
    }
  }
}

function deleteAllShots(){
  console.log (enemyShots);
  var cont;
  if (enemyShots){
    cont = enemyShots.length;
    console.log('EnemyShots: ' + cont);
    for (var i=0; i < cont; i++) {
      // var enemyShot = enemyShots[i];
      if (enemyShots[i]){
        console.log (enemyShots[i]);
        enemyShots[i].parentNode.removeChild(enemyShots[i]);
        enemyShots[i] = null;
      }
    }
    enemyShots = document.querySelectorAll('.enemyShots');
  }

  console.log (playerShots);
  if (playerShots){
    cont = playerShots.length;
    console.log('PlayerShots: ' + cont);
    for (var i=0; i < cont; i++){
      if (playerShots[i]){
        playerShots[i].parentNode.removeChild(playerShots[i]);
        playerShots[i] = null;
      }
    }
    playerShots = document.querySelectorAll('.playerShots');
  }
}

// ------------ Spawn Shots -------------
function initShot(name, isPlayer) {
  if (isPlayer){
    canShot = false;
    window.setTimeout(resetShotPlayer, 100);
  } else {
    enemyCanShot = false;
    window.setTimeout(resetShotEnemy, 300);
  }

  var divShot = document.createElement('div');
  document.documentElement.querySelector('.background').appendChild(divShot);
  divShot.className = name;
  var shotSnd;

  if (isPlayer){
    shotSnd = new Audio("sounds/playerShot.ogg"); // buffers automatically when created
    shotSnd.play();
    divShot.style.left = (parseInt(player.style.left) + playerSize/2) + "px";
    divShot.style.top = parseInt(player.style.top) + "px";
    playerShots = document.documentElement.querySelectorAll('.' + name);
  }
  else {
    shotSnd = new Audio("sounds/enemyShot.ogg"); // buffers automatically when created
    shotSnd.play();
    if (currentEnemy){
      divShot.style.left = (parseInt(currentEnemy.style.left) + playerSize/2) + "px";
      divShot.style.top = parseInt(currentEnemy.style.top) + "px";
    }/* else {
      divShot.parentNode.removeChild(divShot);
    }*/
    /*if (enemyShots){
      enemyShots[enemyShots.length] = divShot;
    }
    else {
      enemyShots = document.querySelectorAll('.' + name);
    }*/
    enemyShots = document.documentElement.querySelectorAll('.' + name);
  }
}

// ------------ End Game -------------
function endGame_Lost(){
  document.documentElement.querySelector('.score').innerHTML = '';
  
  createTextDiv('highScoreText', 'HightScore: ' + ReadCookie());
  createTextDiv('gameOverText', 'Se Fodeu');
  createTextDiv('finalScoreText', 'Score: ' + scoreNum);

  createTextDiv('waitNextTurn', '"Wait 6 seconds to New Game"');
  window.setTimeout(resetBtnClick, 6000);
}

function endGame_Win(){
  document.documentElement.querySelector('.score').innerHTML = '';

  createTextDiv('gameWinText', 'Level ' + difficult + ' concluído');
  createTextDiv('finalScoreText', 'Score: ' + scoreNum);

  createTextDiv('waitNextTurn', '"Wait 5 seconds to Next Level"');
  window.setTimeout(nextBtnClick, 5000);
}

function createTextDiv(className, text){
  var divText = document.createElement('div');
  document.documentElement.querySelector('.background').appendChild(divText);
  divText.className = className;
  document.documentElement.querySelector('.' + className).innerHTML = text;
}

// ------------ Reset Game / Next Level -------------
function nextBtnClick(){
  difficult++;
  lifes++;

  var text = document.querySelector('.gameWinText');
  text.parentNode.removeChild(text);

  var text2 = document.querySelector('.finalScoreText');
  text2.parentNode.removeChild(text2);

  var text3 = document.querySelector('.waitNextTurn');
  text3.parentNode.removeChild(text3);

  nextLevel();
  //endButton.parentNode.removeChild(endButton);
}

function resetBtnClick(){
  difficult=1;

  lifes = 3;
  scoreNum = 0;

  var text = document.querySelector('.highScoreText');
  text.parentNode.removeChild(text);

  var text2 = document.querySelector('.gameOverText');
  text2.parentNode.removeChild(text2);

  var text3 = document.querySelector('.finalScoreText');
  text3.parentNode.removeChild(text3);

  var text4 = document.querySelector('.waitNextTurn');
  text4.parentNode.removeChild(text4);

  nextLevel();
  //endButton.parentNode.removeChild(endButton);
}

function nextLevel(){
  highScore = ReadCookie();
  document.documentElement.querySelector('.score').innerHTML = 'HighScore: ' + highScore + ' ------ Score: ' + scoreNum + ' ------ Lives: ' + lifes;

  player = document.createElement('div');
  document.documentElement.querySelector('.background').appendChild(player);
  player.className = 'player';

  //player = document.querySelector('.player');
  posX=screenWidth/2
  player.style.left = posX + "px";
  player.style.top = heightLimit + "px";

  playerRect = player.getBoundingClientRect();
  
  enemySpeed = difficult;

  enemies = null;
  enemyShots = null;
  playerShots = null;

  spawnEnemy();

  screenCorrection=70;
  gameOver = false;
  win = false;
  endButtonCreated = false;
  shot = false;
  moveRight = false;
  moveLeft = false;
  lastEnemy=false
}

// ------------ Events -------------
document.addEventListener('keypress', keyPress);
document.addEventListener('keydown', checkKeyDown);
document.addEventListener('keyup', checkKeyUp);

window.setInterval (update, 1000/60);