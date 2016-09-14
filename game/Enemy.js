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

function resetShotEnemy() {
  enemyCanShot = true;
  canRandEnemy = true;
}

function moveEnemyShots(){
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
}