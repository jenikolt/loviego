const app = new PIXI.Application({
  width: 1000,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// Инициализация текстуры для фона
const backgroundTexture = PIXI.Texture.from("bg.png"); // Замените 'background.png' на путь к вашему изображению
const backgroundSprite = new PIXI.Sprite(backgroundTexture);
backgroundSprite.width = app.view.width;
backgroundSprite.height = app.view.height;
app.stage.addChild(backgroundSprite); // Добавляем фон на сцену

const player = new PIXI.Graphics();
player.beginFill(0xff0000);
player.drawRect(0, 0, 100, 100);
player.endFill();
player.x = app.view.width / 2 - player.width / 2;
player.y = app.view.height - player.height - 10;
app.stage.addChild(player);

const bottles = [];
const bottleSpeed = 3;

let lives = 3;
let attempts = 3;
let score = 0;
const targetScore = 15;

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

// Инициализация текстуры для спрайтов очков
const texture = PIXI.Texture.from("pivo.png"); // Путь к вашему файлу

const frameWidth = 290; // Ширина одного кадра
const frameHeight = 800; // Высота одного кадра
const frameSpacing = 80; // Расстояние между кадрами

const frames = [];
for (let i = 0; i < 15; i++) {
  const frame = new PIXI.Texture(
    texture.baseTexture,
    new PIXI.Rectangle(
      i * (frameWidth + frameSpacing),
      0,
      frameWidth,
      frameHeight
    )
  );
  frames.push(frame);
}

// Создание спрайта для отображения очков
const scoreSprite = new PIXI.Sprite(frames[0]); // Начинаем с первого кадра
scoreSprite.x = app.view.width - frameWidth / 6; // Расположение справа сверху
scoreSprite.y = 10;
scoreSprite.scale.set(0.1, 0.1); // Уменьшение размера спрайта
app.stage.addChild(scoreSprite);

// Инициализация текстуры для бутылок
const bottleTexture = PIXI.Texture.from("bottle.png"); // Замените 'bottle.png' на путь к вашему изображению бутылки

function createBottle() {
  const bottle = new PIXI.Sprite(bottleTexture); // Используем спрайт вместо графики
  bottle.width = 60; // Устанавливаем ширину бутылки
  bottle.height = 80; // Устанавливаем высоту бутылки
  bottle.x = Math.random() * (app.view.width - bottle.width);
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
      increaseScore();
    } else if (bottles[i].y > app.view.height) {
      app.stage.removeChild(bottles[i]);
      bottles.splice(i, 1);
      loseLife();
    }
  }
}

function increaseScore() {
  score++;
  updateScoreSprite();
  if (score >= targetScore) {
    winGame();
  }
}

// Обновляем текстуру спрайта очков
function updateScoreSprite() {
  const frameIndex = Math.min(score, frames.length - 1); // Индекс текстуры не превышает количество кадров
  scoreSprite.texture = frames[frameIndex];
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
  lives = 3;
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

function winGame() {
  app.ticker.stop();
  const winText = new PIXI.Text("You Win!", {
    fontSize: 48,
    fill: 0x00ff00,
  });
  winText.x = app.view.width / 2 - winText.width / 2;
  winText.y = app.view.height / 2 - winText.height / 2;
  app.stage.addChild(winText);
}

function startGame() {
  if (Math.random() < 0.02) {
    createBottle();
  }
  updateBottles();
}

app.ticker.add(() => {
  startGame();
});
