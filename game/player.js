var screenHeight=640, screenWidth=800, posX=screenWidth/2, playerRect;
var highScore, gameOver=false, lifes=3, invencible=false; invencibleTime=2000, scoreNum=0, enemyPoints=10;
var canShot = true, enemyCanShot=true, canRandEnemy=true, player, playerShots, enemyShots, enemies, currentEnemy;
var moveSpeed = 5, shotSpeed = 8, enemySpeed=1, playerSize = 32, enemyDownSpeed=8;
var heightLimit=screenHeight-playerSize-11, widthLimit=screenWidth-playerSize-1;
var moveLeft = false, moveRight = false, moveEnemyLeft=false;
var difficult=1, MinTurn=2, turnsToUpSpeed=MinTurn, win=false, endButtonCreated=false, endButton;

function spawnEnemy(){
  var enemySize=32, spawnSpace=18/*12*/, enemyMaxPerLine=12/*16*/, enemyMaxLines=5, spawnHeight=0, spawnWidth=0;
  for (var j=0; j<enemyMaxLines; j++){
    spawnHeight+=playerSize+12;
    spawnWidth=spawnSpace+18;
    for (var i=0; i<=enemyMaxPerLine; i++){
      var divEnemy = document.createElement('div');
      document.body.querySelector('.background').appendChild(divEnemy);
      divEnemy.className = 'enemy';

      divEnemy.style.top = spawnHeight + "px";
      divEnemy.style.left = spawnWidth + "px";
      // console.log('spawn enemy' + i + ' in X:' + spawnHeight + ' Y:' + spawnWidth)
      
      spawnWidth += enemySize+spawnSpace;
    }
  }

  enemies = document.querySelectorAll('.enemy');
}

function getLeftBorderEnemy(){
  var left=screenWidth-1;
  enemies.forEach(function(e){
    var enemyRect = e.getBoundingClientRect();
    if (enemyRect.left < left){
      left = enemyRect.left;
    }
  });
  return left;
}

function getRightBorderEnemy(){
  var right=0;
  enemies = document.querySelectorAll('.enemy');
  enemies.forEach(function(e){
    var enemyRect = e.getBoundingClientRect();
    // console.log(enemyRect.right + ' > ' + right)
    if (enemyRect.right > right){
      right = enemyRect.right;
    }
  });
  return right;
}

function resetInvencibility(){
  invencible=false;
  player.style.background = 'url(\'../img/tank.png\') 0 0';;
}

function resetShotPlayer() {
  canShot = true;
}

function resetShotEnemy() {
  enemyCanShot = true;
  canRandEnemy = true;
}

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

function movePlayer() {
  player.style.left = posX + "px";
}

function keyPress(evt) {
  if (lifes < 0 || win)
    return;

  var charCode = evt.keyCode || evt.which;

  if ((charCode == '122' || charCode == '32') && canShot) { //Z or SPACE
    initShot('playerShot', true);
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

function deleteAllEnemies(){
  if (enemies) {
    enemies.forEach(function(e){
        e.parentNode.removeChild(e);
        enemies = document.querySelectorAll('.enemy');
    });
  }
}

function deleteAllShots(){
  if (enemyShots){
    enemyShots.forEach(function(shot) {
      shot.parentNode.removeChild(shot);
      enemyShots = document.querySelectorAll('.enemyShots');
    });
  }
  if (playerShots){
    playerShots.forEach(function(shot) {
      shot.parentNode.removeChild(shot);
      playerShots = document.querySelectorAll('.playerShots');
    });
  }
}

// ------------ UPDATE ------------
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

    if (enemyShots){
      playerRect = player.getBoundingClientRect();
      enemyShots.forEach(function(shot) {
        var shotRect = shot.getBoundingClientRect();

        if (shotRect.bottom <= playerRect.bottom
              && shotRect.top >= playerRect.top
              && shotRect.left >= playerRect.left
              && shotRect.right <= playerRect.right) {
            if (!invencible) {
              invencible = true;
              lifes--;
              scoreNum-=50;
              player.style.background = 'url(\'../img/tankDmg.png\') 0 0';
              document.body.querySelector('.score').innerHTML = 'HighScore: ' + highScore + ' ------ Score: ' + scoreNum + ' ------ Lives: ' + lifes;
              window.setTimeout(resetInvencibility, invencibleTime);
            }

            shot.parentNode.removeChild(shot);
            shot = null;
            enemyShots = document.querySelectorAll('.enemyShot');
          }

        if (shot){
          shot.style.top = (parseInt(shot.style.top)+shotSpeed) + "px";
          shotRect = shot.getBoundingClientRect();
          if (shotRect.bottom >= screenHeight-1) {
            shot.parentNode.removeChild(shot);
            enemyShots = document.querySelectorAll('.enemyShot');
          }
        }
      });
    }

    if (playerShots) {
      playerShots.forEach(function(shot) {
        var shotRect = shot.getBoundingClientRect();
        enemies.forEach(function(e){
          var enemyRect = e.getBoundingClientRect();
          // console.log (shotRect.bottom+' <= '+enemyRect.bottom+' && '+shotRect.top+' >= '+enemyRect.top+' && '+shotRect.left+' >= '+enemyRect.left+' && '+shotRect.right+' <= '+enemyRect.right);

          if (shotRect.bottom <= enemyRect.bottom
              && shotRect.top >= enemyRect.top
              && shotRect.left >= enemyRect.left
              && shotRect.right <= enemyRect.right){
            shot.parentNode.removeChild(shot);
            shot = null;
            playerShots = document.querySelectorAll('.playerShot');

            e.parentNode.removeChild(e);
            enemies = document.querySelectorAll('.enemy');

            scoreNum += enemyPoints;
            document.body.querySelector('.score').innerHTML = 'HighScore: ' + highScore + ' ------ Score: ' + scoreNum + ' ------ Lives: ' + lifes;
          }
        });

        if (shot){
          shot.style.top = (parseInt(shot.style.top)-shotSpeed) + "px";
          if (parseInt(shot.style.top) <= 1) {
            shot.parentNode.removeChild(shot);
            playerShots = document.querySelectorAll('.playerShot');
          }
        }
      });
    }

    if (moveLeft) { //<-
      posX-=moveSpeed;
      if (posX < 1) {
        posX = 1;
      }
      movePlayer();
    }
    else if (moveRight) { //->
      posX+=moveSpeed;
      if (posX > widthLimit) {
        posX = widthLimit;
      }
      movePlayer();
    }

    if (lifes < 0 || win) {
      gameOver = true;
    }
  } else {
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
    } else {
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
  player.style.left = screenWidth/2 + "px";
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

document.addEventListener('keypress', keyPress);
document.addEventListener('keydown', checkKeyDown);
document.addEventListener('keyup', checkKeyUp);

window.setInterval (update, 1000/60);