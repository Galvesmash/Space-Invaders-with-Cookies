var screenHeight=640, screenWidth=800, posX=screenWidth/2, playerRect;
var highScore, gameOver=false, lifes=3, invencible=false; invencibleTime=2000, scoreNum=0, enemyPoints=10;
var canShot = true, enemyCanShot=true, canRandEnemy=true, player, playerShots, enemyShots, enemies, currentEnemy;
var moveSpeed = 5, shotSpeed = 8, enemySpeed=1, playerSize = 32, enemyDownSpeed=8;
var heightLimit=screenHeight-playerSize-11, widthLimit=screenWidth-playerSize-1;
var moveLeft = false, moveRight = false, moveEnemyLeft=false;
var difficult=1, MinTurn=2, turnsToUpSpeed=MinTurn, win=false, endButtonCreated=false, endButton;

function update(){
  if (!player) {
    nextLevel();
  }

  if (!gameOver){
    if (enemies) {
      enemies.forEach(function(e) {
        var enemyRect = e.getBoundingClientRect();

        if (enemyRect.bottom >= playerRect.top) {
          lifes = -1;
          scoreNum -= 200;
          gameOver = true;
        }
      });

      if (enemyCanShot && canRandEnemy){
        enemies = document.querySelectorAll('.enemy');
        canRandEnemy = false;
        var rand = Math.floor((Math.random() * enemies.length) - 1);
        currentEnemy = enemies[rand];
        initShot('enemyShot', false);
      }

      if (moveEnemyLeft){
        // console.log(getLeftBorderEnemy() + ' > ' + 13);
        if (getLeftBorderEnemy() > 10){
          enemies.forEach(function(e){
            e.style.left = (parseInt(e.style.left)-enemySpeed) + "px";
          });
        }
        else if (getLeftBorderEnemy() <= 10) {
          enemies.forEach(function(e){
            e.style.top = (parseInt(e.style.top)+enemyDownSpeed) + "px";
          });
          moveEnemyLeft = false;
        }
      } else {
        // console.log(getRightBorderEnemy() + ' < ' + widthLimit);
        if (getRightBorderEnemy() < screenWidth+12){
          enemies.forEach(function(e){
            e.style.left = (parseInt(e.style.left)+enemySpeed) + "px";
          });
        }
        else if (getRightBorderEnemy() >= screenWidth+12){
          enemies.forEach(function(e){
            e.style.top = (parseInt(e.style.top)+enemyDownSpeed) + "px";
          });
          turnsToUpSpeed--
            if (turnsToUpSpeed <= 0){
              turnsToUpSpeed=MinTurn;
              enemySpeed++;
            }
          moveEnemyLeft = true;
        }
      }
    }

    if (enemies.length <= 0) {
      win = true;
    }

    moveEnemyShots();

    movePlayerShots();

    movePlayer();

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

        endButton= document.createElement('button');
        endButton= document.createElement('input');

        endButton.setAttribute('type', 'button');
        endButton.setAttribute('value', 'Reset game');
        endButton.setAttribute('onclick', 'resetBtnClick();');

        //endButton.className = 'endButton';

        document.body.querySelector('.background').appendChild(endButton);
      }
    }
    else {
      if (!endButtonCreated){
        endButtonCreated = true;
        deleteAllShots();
        player.parentNode.removeChild(player);

        endGame_Win();

        endButton= document.createElement('input');
        // endButton.innerHTML = 'Next level';
        endButton.setAttribute('type', 'button');
        endButton.setAttribute('value', 'Next level');
        endButton.setAttribute('onclick', 'nextBtnClick();');

        //endButton.className = 'endButton';

        document.body.querySelector('.background').appendChild(endButton);
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
  document.body.querySelector('.background').appendChild(divShot);
  divShot.className = name;

  if (isPlayer){
    divShot.style.left = (parseInt(player.style.left) + playerSize/2) + "px";
    divShot.style.top = parseInt(player.style.top) + "px";
    playerShots = document.querySelectorAll('.' + name);
  }
  else {
    if (currentEnemy){
      divShot.style.left = (parseInt(currentEnemy.style.left) + playerSize/2) + "px";
      divShot.style.top = parseInt(currentEnemy.style.top) + "px";
    } else {
      divShot.parentNode.removeChild(divShot);
    }
    enemyShots = document.querySelectorAll('.' + name);
  }
}

// ------------ End Game -------------
function endGame_Lost(){
  document.body.querySelector('.score').innerHTML = '';
  
  var divText = document.createElement('div');
  document.body.querySelector('.background').appendChild(divText);
  divText.className = 'highScoreText';
  document.body.querySelector('.highScoreText').innerHTML = 'HightScore: ' + ReadCookie();

  divText = document.createElement('div');
  document.body.querySelector('.background').appendChild(divText);
  divText.className = 'gameOverText';
  document.body.querySelector('.gameOverText').innerHTML = 'Se Fodeu';

  divText = document.createElement('div');
  document.body.querySelector('.background').appendChild(divText);
  divText.className = 'finalScoreText';
  document.body.querySelector('.finalScoreText').innerHTML = 'Score: ' + scoreNum;
}

function endGame_Win(){
  document.body.querySelector('.score').innerHTML = '';

  var divText = document.createElement('div');
  document.body.querySelector('.background').appendChild(divText);
  divText.className = 'gameWinText';
  document.body.querySelector('.gameWinText').innerHTML = 'Level ' + difficult + ' concluído';

  divText = document.createElement('div');
  document.body.querySelector('.background').appendChild(divText);
  divText.className = 'finalScoreText';
  document.body.querySelector('.finalScoreText').innerHTML = 'Score: ' + scoreNum;
}


// ------------ Reset Game / Next Level -------------
function nextBtnClick(){
  difficult++;
  lifes++;
  nextLevel();

  var text = document.querySelector('.gameWinText');
  text.parentNode.removeChild(text);

  var text2 = document.querySelector('.finalScoreText');
  text2.parentNode.removeChild(text2);

  endButton.parentNode.removeChild(endButton);
}

function resetBtnClick(){
  difficult=1;
  nextLevel();

  lifes = 3;
  scoreNum = 0;

  var text = document.querySelector('.highScoreText');
  text.parentNode.removeChild(text);

  var text2 = document.querySelector('.gameOverText');
  text2.parentNode.removeChild(text2);

  var text3 = document.querySelector('.finalScoreText');
  text3.parentNode.removeChild(text3);

  endButton.parentNode.removeChild(endButton);
}

function nextLevel(){
  highScore = ReadCookie();
  document.body.querySelector('.score').innerHTML = 'HighScore: ' + highScore + ' ------ Score: ' + scoreNum + ' ------ Lives: ' + lifes;

  player = document.createElement('div');
  document.body.querySelector('.background').appendChild(player);
  player.className = 'player';

  //player = document.querySelector('.player');
  posX=screenWidth/2
  player.style.left = posX + "px";
  player.style.top = heightLimit + "px";

  playerRect = player.getBoundingClientRect();
  
  enemySpeed = difficult;
  spawnEnemy();

  gameOver = false;
  win = false;
  endButtonCreated = false;
  shot = false;
  moveRight = false;
  moveLeft = false;
}

// ------------ Events -------------
document.addEventListener('keypress', keyPress);
document.addEventListener('keydown', checkKeyDown);
document.addEventListener('keyup', checkKeyUp);

window.setInterval (update, 1000/60);