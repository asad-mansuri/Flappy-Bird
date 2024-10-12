const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Set canvas size
canvas.width = 750;
canvas.height = 500;

// Bird properties
const bird = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 0.5
};

// Obstacle properties
const obstacleGap = 250;
const obstacleWidth = 50;
let obstacles = [];

// Game variables
let isGameOver = false;
let score = 0;

// Load obstacle images
const obstacleTopImg = document.getElementById('obstacleTopImg');
const obstacleBottomImg = document.getElementById('obstacleBottomImg');

// Game loop
function gameLoop() {
  if (!isGameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Update game state
function update() {
  // Apply gravity to the bird
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Generate obstacles
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 250) {
    const obstacleY = Math.random() * (canvas.height - obstacleGap);
    obstacles.push({ x: canvas.width, y: obstacleY });
  }

  // Move obstacles
  obstacles.forEach(obstacle => {
    obstacle.x -= 7; // Adjust obstacle speed here

    // Check for collision
       if (
         bird.x + bird.radius > obstacle.x &&
         bird.x - bird.radius < obstacle.x + obstacleWidth &&
         (bird.y - bird.radius < obstacle.y || bird.y + bird.radius > obstacle.y + obstacleGap)
       ) {
         gameOver();
       }

    // Increase score when bird passes obstacle
    if (obstacle.x + obstacleWidth < bird.x - bird.radius) {
      score++;
    }
  });

  // Remove passed obstacles
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);

  // Check for collision with ceiling and floor
   if (bird.y - bird.radius <= 0 || bird.y + bird.radius >= canvas.height) {
     gameOver();
   }
  }

// Draw everything
function draw() {
  // Clear canvas (do not clear the entire canvas, so the video is visible)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  let birdImg = document.getElementById('birdImg');
  ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);

  // Draw obstacles
  obstacles.forEach(obstacle => {
    // Draw top obstacle
    ctx.drawImage(obstacleTopImg, obstacle.x, 0, obstacleWidth, obstacle.y);

    // Draw bottom obstacle
    ctx.drawImage(obstacleBottomImg, obstacle.x, obstacle.y + obstacleGap, obstacleWidth, canvas.height - obstacle.y - obstacleGap);
  });

  // Draw score
  ctx.font = '24px Arial';
  ctx.fillStyle = '#000'; // Changed to white to be visible over the video
  ctx.fillText('Score: ' + score, 20, 40);
}


// Handle keyboard input
document.addEventListener('keydown', flap);

// Flap the bird
function flap(event) {
  if (event.keyCode === 32 && !isGameOver) { // Space key
    bird.velocity = -10; // Adjust flap strength here
  }
}

// Game over
function gameOver() {
  isGameOver = true;
  alert('Game Over! Your score: ' + score);
  location.reload(); // Reload the page to restart the game
}

gameLoop();
