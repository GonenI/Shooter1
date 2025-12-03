const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const shotsElement = document.getElementById("shots");
const statusElement = document.getElementById("status");
const shotMeterElement = document.getElementById("shotMeter");
const resetButton = document.getElementById("resetButton");

const target = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 80,
  vx: 3 + Math.random() * 2,
  vy: 2 + Math.random() * 2,
};

let score = 0;
const maxShots = 10;
let shotsLeft = maxShots;
let gameOver = false;
let bulletElements = [];

function createBullets() {
  shotMeterElement.innerHTML = '';
  bulletElements = [];
  
  for (let i = 0; i < maxShots; i++) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.setAttribute('aria-hidden', 'true');
    shotMeterElement.appendChild(bullet);
    bulletElements.push(bullet);
  }
}

function randomizeTargetVelocity() {
  const horizontalSpeed = 3 + Math.random() * 2;
  const verticalSpeed = 2 + Math.random() * 2;

  target.vx = (Math.random() < 0.5 ? -1 : 1) * horizontalSpeed;
  target.vy = (Math.random() < 0.5 ? -1 : 1) * verticalSpeed;
}

function drawTarget() {
  const bands = [
    { radius: target.radius, color: "#d90429" },
    { radius: target.radius * 0.7, color: "#edf2f4" },
    { radius: target.radius * 0.4, color: "#d90429" },
    { radius: target.radius * 0.15, color: "#edf2f4" },
  ];

  bands.forEach((band) => {
    ctx.beginPath();
    ctx.arc(target.x, target.y, band.radius, 0, Math.PI * 2);
    ctx.fillStyle = band.color;
    ctx.fill();
  });
}

function updateTargetPosition() {
  target.x += target.vx;
  target.y += target.vy;

  if (target.x - target.radius <= 0 || target.x + target.radius >= canvas.width) {
    target.vx *= -1;
    target.x = Math.max(target.radius, Math.min(canvas.width - target.radius, target.x));
  }

  if (target.y - target.radius <= 0 || target.y + target.radius >= canvas.height) {
    target.vy *= -1;
    target.y = Math.max(target.radius, Math.min(canvas.height - target.radius, target.y));
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTarget();
  updateTargetPosition();
  if (!gameOver) {
    requestAnimationFrame(render);
  }
}

function updateScoreboard() {
  const safeShots = Math.max(shotsLeft, 0);
  scoreElement.textContent = `Score: ${score}`;
  shotsElement.textContent = `Shots Remaining: ${safeShots}`;
  updateShotMeter(safeShots);
}

function updateShotMeter(safeShots) {
  // Mark bullets as shot from the end
  for (let i = 0; i < bulletElements.length; i++) {
    if (i < maxShots - safeShots) {
      bulletElements[bulletElements.length - 1 - i].classList.add('shot');
    } else {
      bulletElements[bulletElements.length - 1 - i].classList.remove('shot');
    }
  }
  shotMeterElement.setAttribute("aria-label", `${safeShots} shots remaining`);
}

function endGame() {
  gameOver = true;
  statusElement.textContent = `Game over! Final score: ${score}.`;
  canvas.classList.add("disabled");
}

function handleShot(event) {
  if (gameOver) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const distance = Math.hypot(clickX - target.x, clickY - target.y);

  if (distance <= target.radius) {
    score += 100;
    statusElement.textContent = "Great shot!";
  } else {
    statusElement.textContent = "Missed!";
  }

  shotsLeft -= 1;
  updateScoreboard();

  if (shotsLeft <= 0) {
    endGame();
  }
}

canvas.addEventListener("click", handleShot);

function resetGame() {
  const wasGameOver = gameOver;

  score = 0;
  shotsLeft = maxShots;
  gameOver = false;
  target.x = canvas.width / 2;
  target.y = canvas.height / 2;
  randomizeTargetVelocity();

  statusElement.textContent = `Click the moving target. You have ${maxShots} shots!`;
  canvas.classList.remove("disabled");
  createBullets();
  updateScoreboard();

  if (wasGameOver) {
    render();
  }
}

resetButton.addEventListener("click", resetGame);

randomizeTargetVelocity();
createBullets();
updateScoreboard();
render();
