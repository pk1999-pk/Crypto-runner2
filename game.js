
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let runner = {
  x: 100,
  y: canvas.height - 150,
  width: 50,
  height: 80,
  color: "gold",
  dy: 0,
  gravity: 1.5,
  jumpPower: -20,
  grounded: true
};

let obstacles = [];
let score = 0;
let gameSpeed = 6;
let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function spawnObstacle() {
  const types = ['fire', 'block', 'laser'];
  const type = types[Math.floor(Math.random() * types.length)];
  let height = 50 + Math.random() * 50;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height - 70,
    width: 40,
    height,
    type
  });
}

function drawRunner() {
  ctx.fillStyle = runner.color;
  ctx.fillRect(runner.x, runner.y, runner.width, runner.height);
}

function drawObstacle(ob) {
  if (ob.type === 'fire') ctx.fillStyle = "orange";
  else if (ob.type === 'block') ctx.fillStyle = "gray";
  else ctx.fillStyle = "red";
  ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys["Space"] && runner.grounded) {
    runner.dy = runner.jumpPower;
    runner.grounded = false;
  }

  runner.y += runner.dy;
  runner.dy += runner.gravity;

  if (runner.y + runner.height >= canvas.height - 70) {
    runner.y = canvas.height - 70 - runner.height;
    runner.dy = 0;
    runner.grounded = true;
  }

  drawRunner();

  obstacles.forEach((ob, index) => {
    ob.x -= gameSpeed;
    drawObstacle(ob);
    if (
      runner.x < ob.x + ob.width &&
      runner.x + runner.width > ob.x &&
      runner.y < ob.y + ob.height &&
      runner.y + runner.height > ob.y
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }
    if (ob.x + ob.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  if (Math.random() < 0.02) spawnObstacle();

  ctx.fillStyle = "white";
  ctx.font = "24px sans-serif";
  ctx.fillText("Score: " + score, 20, 40);

  requestAnimationFrame(update);
}

update();
