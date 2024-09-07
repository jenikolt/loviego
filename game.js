const { Application, Assets, AnimatedSprite, Texture } = PIXI; 
// Инициализация PixiJS приложения
(async () => {
  const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

//==================
await Assets.load('./sprites/beerman.json');

    // Create an array of textures from the sprite sheet
    const frames = [];

    for (let i = 0; i < 10; i++)
    {
        const val = i < 10 ? `${i}` : i;

        // Magically works since the spritesheet was loaded with the pixi loader
        frames.push(Texture.from(`${val}.png`));
    }

    // Create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    const anim = new AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = app.screen.width / 2;
    anim.y = app.screen.height / 2;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.1;
    anim.play();

    app.stage.addChild(anim);

//==================

// Добавление контейнера для игрока
const player = new PIXI.Graphics();
player.beginFill(0xff0000);
player.drawRect(0, 0, 50, 50); // Прямоугольник для игрока
player.endFill();
player.x = app.view.width / 2 - player.width / 2;
player.y = app.view.height - player.height - 10;
app.stage.addChild(player);

// Добавление группы бутылок
const bottles = [];
const bottleSpeed = 3; // Скорость падения бутылок

// Инициализация жизней
let lives = 3;

// Текст для отображения жизней
const livesText = new PIXI.Text(`Lives: ${lives}`, {
  fontSize: 24,
  fill: 0xffffff,
});
livesText.x = 10;
livesText.y = 10;
app.stage.addChild(livesText);

// Функция создания бутылок
function createBottle() {
  const bottle = new PIXI.Graphics();
  bottle.beginFill(0x00ff00);
  bottle.drawCircle(0, 0, 10); // Круг для бутылки
  bottle.endFill();
  bottle.x = Math.random() * (app.view.width - 20) + 10;
  bottle.y = 0;
  app.stage.addChild(bottle);
  bottles.push(bottle);
}

// Функция для обновления позиции бутылок
function updateBottles() {
  for (let i = bottles.length - 1; i >= 0; i--) {
    bottles[i].y += bottleSpeed;
    // Проверка на попадание в игрока
    if (
      bottles[i].y + bottles[i].height > player.y &&
      bottles[i].x > player.x &&
      bottles[i].x < player.x + player.width
    ) {
      app.stage.removeChild(bottles[i]);
      bottles.splice(i, 1); // Удаление пойманной бутылки
    } else if (bottles[i].y > app.view.height) {
      app.stage.removeChild(bottles[i]);
      bottles.splice(i, 1); // Удаление бутылки, которая вышла за пределы экрана
      loseLife(); // Потеря жизни, если бутылка вышла за пределы экрана
    }
  }
}

// Функция потери жизни
function loseLife() {
  lives--;
  livesText.text = `Lives: ${lives}`;
  if (lives <= 0) {
    endGame();
  }
}

// Обработка событий движения мыши
app.view.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX - app.view.getBoundingClientRect().left;
  player.x = Math.max(
    0,
    Math.min(app.view.width - player.width, mouseX - player.width / 2)
  );
});

// Функция завершения игры
function endGame() {
  app.ticker.stop(); // Останавливаем игровой цикл
  const gameOverText = new PIXI.Text("Game Over", {
    fontSize: 48,
    fill: 0xff0000,
  });
  gameOverText.x = app.view.width / 2 - gameOverText.width / 2;
  gameOverText.y = app.view.height / 2 - gameOverText.height / 2;
  app.stage.addChild(gameOverText);
}

// Основной игровой цикл
app.ticker.add(() => {
  if (Math.random() < 0.02) {
    // Вероятность появления новой бутылки
    createBottle();
  }
  updateBottles();
})})();