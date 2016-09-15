function resetInvencibility(){
  invencible=false;
  player.style.background = 'url(\'img/tank.png\') 0 0';;
}

function resetShotPlayer() {
  canShot = true;
}

function movePlayerShots(){
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

          var explosionSnd = new Audio("sounds/explosion1.ogg"); // buffers automatically when created
          explosionSnd.play();

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
}

function movePlayer() {
  if (moveLeft && moveRight){
    moveLeft = false;
    moveRight = false;
    return;
  }

  if (moveLeft) { //<-
    posX-=moveSpeed;
    if (posX < 1) {
      posX = 1;
    }
    player.style.left = posX + "px";
  }
  else if (moveRight) { //->
    posX+=moveSpeed;
    if (posX > widthLimit) {
      posX = widthLimit;
    }
    player.style.left = posX + "px";
  }
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