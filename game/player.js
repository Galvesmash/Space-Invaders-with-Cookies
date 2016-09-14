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