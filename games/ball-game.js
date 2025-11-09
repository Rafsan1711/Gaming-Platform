// ================================================
// BALL BOUNCE GAME - Full Working
// ================================================

function initBallGame(container) {
  let score = 0;
  let gameOver = false;
  let animationId = null;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = Math.min(800, window.innerWidth - 40);
  canvas.height = 600;
  
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    dx: 5,
    dy: -5,
    color: '#00f0ff'
  };
  
  const paddle = {
    width: 120,
    height: 20,
    x: canvas.width / 2 - 60,
    y: canvas.height - 40,
    speed: 10,
    color: '#00ff88'
  };
  
  container.innerHTML = `
    <style>
      .ball-wrapper {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      .ball-score {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--color-accent-blue);
      }
      .ball-canvas {
        background: #000;
        border-radius: var(--radius-md);
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        cursor: none;
        touch-action: none;
      }
      .ball-controls {
        margin-top: 1rem;
        color: var(--color-text-muted);
      }
    </style>
    
    <div class="ball-wrapper">
      <div class="ball-score">Score: <span id="ball-score">0</span></div>
      <div id="ball-container"></div>
      <div class="ball-controls">
        Use mouse/touch to move paddle
      </div>
    </div>
  `;
  
  const scoreEl = container.querySelector('#ball-score');
  const canvasContainer = container.querySelector('#ball-container');
  canvasContainer.appendChild(canvas);
  canvas.className = 'ball-canvas';
  
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = ball.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }
  
  function drawPaddle() {
    ctx.fillStyle = paddle.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
  }
  
  function drawWalls() {
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
  }
  
  function update() {
    if (gameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawWalls();
    drawBall();
    drawPaddle();
    
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision
    if (ball.x + ball.radius > canvas.width - 10 || ball.x - ball.radius < 10) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 10) {
      ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      ball.dy = -ball.dy;
      ball.y = paddle.y - ball.radius;
      score++;
      scoreEl.textContent = score;
      
      // Increase speed slightly
      if (score % 5 === 0) {
        ball.dx *= 1.1;
        ball.dy *= 1.1;
      }
    }
    
    // Missed paddle
    if (ball.y - ball.radius > canvas.height) {
      gameOver = true;
      ctx.fillStyle = '#ff4c4c';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
      return;
    }
    
    animationId = requestAnimationFrame(update);
  }
  
  // Mouse control
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
    if (paddle.x < 10) paddle.x = 10;
    if (paddle.x + paddle.width > canvas.width - 10) {
      paddle.x = canvas.width - paddle.width - 10;
    }
  });
  
  // Touch control
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    paddle.x = touch.clientX - rect.left - paddle.width / 2;
    if (paddle.x < 10) paddle.x = 10;
    if (paddle.x + paddle.width > canvas.width - 10) {
      paddle.x = canvas.width - paddle.width - 10;
    }
  }, { passive: false });
  
  update();
  
  // Cleanup on unmount
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}
