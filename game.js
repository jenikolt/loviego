const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);


const player = new PIXI.Graphics();
player.beginFill(0xff0000);
player.drawRect(0, 0, 50, 50);
player.endFill();
player.x = app.view.width / 2 - player.width / 2;
player.y = app.view.height - player.height - 10;
app.stage.addChild(player);

const bottles = [];
const bottleSpeed = 3; 

let lives = 3;
let attempts = 3;

const livesText = new PIXI.Text(`Lives: ${lives}`, {
  fontSize: 24,
  fill: 0xffffff,
});
livesText.x = 10;
livesText.y = 10;
app.stage.addChild(livesText);

const attemptsText = new PIXI.Text(`Attempts: ${attempts}`, {
  fontSize: 24,
  fill: 0xffffff,
});
attemptsText.x = 10;
attemptsText.y = 40;
app.stage.addChild(attemptsText);

function createBottle() {
  const bottle = new PIXI.Graphics();
  bottle.beginFill(0x00ff00);
  bottle.drawCircle(0, 0, 10);
  bottle.endFill();
  bottle.x = Math.random() * (app.view.width - 20) + 10;
  bottle.y = 0;
  app.stage.addChild(bottle);
  bottles.push(bottle);
}


function updateBottles() {
  for (let i = bottles.length - 1; i >= 0; i--) {
    bottles[i].y += bottleSpeed;
    if (
      bottles[i].y + bottles[i].height > player.y &&
      bottles[i].x > player.x &&
      bottles[i].x < player.x + player.width
    ) {
      app.stage.removeChild(bottles[i]);
      bottles.splice(i, 1);
    } else if (bottles[i].y > app.view.height) {
      app.stage.removeChild(bottles[i]);
      bottles.splice(i, 1); 
      loseLife();
    }
  }
}

function loseLife() {
  lives--;
  livesText.text = `Lives: ${lives}`;
  if (lives <= 0) {
    loseAttempt();
  }
}

function loseAttempt() {
  attempts--;
  attemptsText.text = `Attempts: ${attempts}`;
  if (attempts <= 0) {
    endGame();
  } else {
    restartGame();
  }
}

function restartGame() {
  lives = 3; // Сброс жизней до 3
  livesText.text = `Lives: ${lives}`;
  clearBottles();
}


function clearBottles() {
  while (bottles.length > 0) {
    const bottle = bottles.pop();
    app.stage.removeChild(bottle);
  }
}


app.view.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX - app.view.getBoundingClientRect().left;
  player.x = Math.max(
    0,
    Math.min(app.view.width - player.width, mouseX - player.width / 2)
  );
});


function endGame() {
  app.ticker.stop();
  const gameOverText = new PIXI.Text("Game Over", {
    fontSize: 48,
    fill: 0xff0000,
  });
  gameOverText.x = app.view.width / 2 - gameOverText.width / 2;
  gameOverText.y = app.view.height / 2 - gameOverText.height / 2;
  app.stage.addChild(gameOverText);
}

app.ticker.add(() => {
  if (Math.random() < 0.02) {
    createBottle();
  }
  updateBottles();
});
