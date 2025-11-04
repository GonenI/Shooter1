const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const shotsElement = document.getElementById("shots");
const statusElement = document.getElementById("status");

const target = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 50,
  vx: 3 + Math.random() * 2,
  vy: 2 + Math.random() * 2,
};

let score = 0;
let shotsLeft = 10;
let gameOver = false;

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
  scoreElement.textContent = `Score: ${score}`;
  shotsElement.textContent = `Shots Remaining: ${shotsLeft}`;
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

updateScoreboard();
render();
