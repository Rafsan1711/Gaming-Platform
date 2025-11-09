// ================================================
// REVERSI (OTHELLO) GAME - Full Working
// ================================================

function initReversi(container) {
  const SIZE = 8;
  let board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
  let player = 'B'; // B = Black (Human), W = White (Bot)
  let gameOver = false;
  
  // Initialize board
  board[3][3] = 'W'; board[4][4] = 'W';
  board[3][4] = 'B'; board[4][3] = 'B';
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  
  container.innerHTML = `
    <style>
      .reversi-wrapper {
        max-width: 600px;
        margin: 0 auto;
      }
      .reversi-status {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-md);
      }
      .reversi-board {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
        background: var(--color-border);
        padding: 4px;
        border-radius: var(--radius-md);
        aspect-ratio: 1;
      }
      .reversi-cell {
        background: #2a7c4f;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 4px;
      }
      .reversi-cell:hover {
        background: #3a9c6f;
      }
      .reversi-disc {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        transition: all 0.4s;
      }
      .reversi-disc.black {
        background: #1a1a1a;
        box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);
      }
      .reversi-disc.white {
        background: #f0f0f0;
        box-shadow: inset 0 2px 6px rgba(0,0,0,0.2);
      }
      .reversi-scores {
        display: flex;
        justify-content: space-around;
        margin-top: 2rem;
        gap: 2rem;
      }
      .reversi-score {
        text-align: center;
        padding: 1rem 2rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-md);
        border: 2px solid var(--color-border);
      }
      .reversi-score-label {
        font-size: 1rem;
        color: var(--color-text-muted);
        margin-bottom: 0.5rem;
      }
      .reversi-score-value {
        font-size: 2rem;
        font-weight: 700;
      }
    </style>
    
    <div class="reversi-wrapper">
      <div class="reversi-status" id="reversi-status">Your Turn (Black)</div>
      <div class="reversi-board" id="reversi-board"></div>
      <div class="reversi-scores">
        <div class="reversi-score">
          <div class="reversi-score-label">Black (You)</div>
          <div class="reversi-score-value" id="score-black">2</div>
        </div>
        <div class="reversi-score">
          <div class="reversi-score-label">White (Bot)</div>
          <div class="reversi-score-value" id="score-white">2</div>
        </div>
      </div>
    </div>
  `;
  
  const boardEl = container.querySelector('#reversi-board');
  const statusEl = container.querySelector('#reversi-status');
  const scoreBlackEl = container.querySelector('#score-black');
  const scoreWhiteEl = container.querySelector('#score-white');
  
  function render() {
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = document.createElement('div');
        cell.className = 'reversi-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        if (board[r][c]) {
          const disc = document.createElement('div');
          disc.className = `reversi-disc ${board[r][c] === 'B' ? 'black' : 'white'}`;
          cell.appendChild(disc);
        }
        
        cell.addEventListener('click', () => handleClick(r, c));
        boardEl.appendChild(cell);
      }
    }
    updateScores();
  }
  
  function handleClick(r, c) {
    if (gameOver || player !== 'B' || board[r][c]) return;
    
    const moves = getLegalMoves(player);
    const isLegal = moves.some(([mr, mc]) => mr === r && mc === c);
    
    if (!isLegal) return;
    
    applyMove(r, c, player);
    render();
    
    if (checkGameOver()) {
      endGame();
      return;
    }
    
    player = 'W';
    statusEl.textContent = "Bot is thinking...";
    
    setTimeout(() => {
      botMove();
      render();
      
      if (checkGameOver()) {
        endGame();
        return;
      }
      
      player = 'B';
      statusEl.textContent = "Your Turn (Black)";
    }, 800);
  }
  
  function getLegalMoves(p) {
    const opponent = p === 'B' ? 'W' : 'B';
    const legal = [];
    
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c]) continue;
        
        for (const [dr, dc] of directions) {
          let i = r + dr, j = c + dc;
          let hasOpponent = false;
          
          while (i >= 0 && i < SIZE && j >= 0 && j < SIZE && board[i][j] === opponent) {
            i += dr; j += dc;
            hasOpponent = true;
          }
          
          if (hasOpponent && i >= 0 && i < SIZE && j >= 0 && j < SIZE && board[i][j] === p) {
            legal.push([r, c]);
            break;
          }
        }
      }
    }
    return legal;
  }
  
  function applyMove(r, c, p) {
    board[r][c] = p;
    const opponent = p === 'B' ? 'W' : 'B';
    
    for (const [dr, dc] of directions) {
      let i = r + dr, j = c + dc;
      const toFlip = [];
      
      while (i >= 0 && i < SIZE && j >= 0 && j < SIZE && board[i][j] === opponent) {
        toFlip.push([i, j]);
        i += dr; j += dc;
      }
      
      if (toFlip.length && i >= 0 && i < SIZE && j >= 0 && j < SIZE && board[i][j] === p) {
        toFlip.forEach(([x, y]) => board[x][y] = p);
      }
    }
  }
  
  function botMove() {
    const moves = getLegalMoves('W');
    if (moves.length === 0) return;
    
    // Simple strategy: corners > edges > others
    const corners = moves.filter(([r, c]) => 
      (r === 0 || r === SIZE-1) && (c === 0 || c === SIZE-1)
    );
    
    if (corners.length) {
      const [r, c] = corners[0];
      applyMove(r, c, 'W');
      return;
    }
    
    const [r, c] = moves[Math.floor(Math.random() * moves.length)];
    applyMove(r, c, 'W');
  }
  
  function updateScores() {
    let black = 0, white = 0;
    board.forEach(row => row.forEach(cell => {
      if (cell === 'B') black++;
      if (cell === 'W') white++;
    }));
    scoreBlackEl.textContent = black;
    scoreWhiteEl.textContent = white;
  }
  
  function checkGameOver() {
    const blackMoves = getLegalMoves('B');
    const whiteMoves = getLegalMoves('W');
    return blackMoves.length === 0 && whiteMoves.length === 0;
  }
  
  function endGame() {
    gameOver = true;
    const black = parseInt(scoreBlackEl.textContent);
    const white = parseInt(scoreWhiteEl.textContent);
    
    if (black > white) {
      statusEl.textContent = `🎉 You Win! ${black} - ${white}`;
    } else if (white > black) {
      statusEl.textContent = `😞 Bot Wins! ${white} - ${black}`;
    } else {
      statusEl.textContent = `🤝 Draw! ${black} - ${white}`;
    }
  }
  
  render();
}
