function resetInvencibility(){
  invencible=false;
  player.style.background = 'url(\'img/tank.png\') 0 0';;
}

function resetShotPlayer() {
  canShot = true;
}

function movePlayerShots(){
  playerShots = document.querySelectorAll('.playerShot');
  if (playerShots) {
    var shotCount = playerShots.length;
    for (var f=0; f < shotCount; f++){
      var shotRect = playerShots[f].getBoundingClientRect();

      var enemyCount = enemies.length;
      for (var i=0; i < enemyCount; i++){
        var enemyRect = enemies[i].getBoundingClientRect();
        // console.log (shotRect.bottom+' <= '+enemyRect.bottom+' && '+shotRect.top+' >= '+enemyRect.top+' && '+shotRect.left+' >= '+enemyRect.left+' && '+shotRect.right+' <= '+enemyRect.right);

        if (shotRect.bottom <= enemyRect.bottom
            && shotRect.top >= enemyRect.top
            && shotRect.left >= enemyRect.left
            && shotRect.right <= enemyRect.right){
          playerShots[f].parentNode.removeChild(playerShots[f]);
          playerShots[f] = null;
          //playerShots = document.querySelectorAll('.playerShot');

          enemies[i].parentNode.removeChild(enemies[i]);
          enemies = document.querySelectorAll('.enemy');

          var explosionSnd = new Audio("sounds/explosion1.ogg"); // buffers automatically when created
          explosionSnd.play();

          scoreNum += enemyPoints;
          document.documentElement.querySelector('.score').innerHTML = 'HighScore: ' + highScore + ' ------ Score: ' + scoreNum + ' ------ Lives: ' + lifes;
          break;
        }
      }

      if (playerShots[f]){
        playerShots[f].style.top = (parseInt(playerShots[f].style.top)-shotSpeed) + "px";
        if (parseInt(playerShots[f].style.top) <= 1) {
          playerShots[f].parentNode.removeChild(playerShots[f]);
          playerShots[f] = null;
        }
      }
    }
    //playerShots = document.querySelectorAll('.playerShots');
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