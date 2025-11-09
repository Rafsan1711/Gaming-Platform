// ================================================
// FOUR IN A ROW GAME - Full Working
// ================================================

function initFourInRow(container) {
  const ROWS = 6;
  const COLS = 7;
  let board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  let currentPlayer = 'B'; // B = Blue, R = Red
  let gameOver = false;
  
  container.innerHTML = `
    <style>
      .four-wrapper {
        max-width: 700px;
        margin: 0 auto;
      }
      .four-status {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-md);
      }
      .four-board {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        background: linear-gradient(135deg, #1e3a8a, #3b82f6);
        padding: 20px;
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }
      .four-cell {
        aspect-ratio: 1;
        background: radial-gradient(circle, #1e293b 60%, #0f172a);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: inset 0 4px 8px rgba(0,0,0,0.4);
      }
      .four-cell:hover {
        transform: scale(1.05);
        box-shadow: inset 0 4px 8px rgba(0,0,0,0.6), 0 0 20px rgba(59, 130, 246, 0.5);
      }
      .four-disc {
        width: 85%;
        height: 85%;
        border-radius: 50%;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      .four-disc.blue {
        background: radial-gradient(circle at 30% 30%, #60a5fa, #1e40af);
        box-shadow: 0 4px 8px rgba(30, 64, 175, 0.6);
      }
      .four-disc.red {
        background: radial-gradient(circle at 30% 30%, #f87171, #b91c1c);
        box-shadow: 0 4px 8px rgba(185, 28, 28, 0.6);
      }
      .four-reset {
        display: block;
        margin: 2rem auto 0;
        padding: 1rem 2rem;
        background: var(--color-accent-green);
        color: white;
        border-radius: var(--radius-md);
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }
      .four-reset:hover {
        background: #16a34a;
        transform: translateY(-2px);
      }
    </style>
    
    <div class="four-wrapper">
      <div class="four-status" id="four-status">Blue Player's Turn 🔵</div>
      <div class="four-board" id="four-board"></div>
      <button class="four-reset" id="four-reset">New Game</button>
    </div>
  `;
  
  const boardEl = container.querySelector('#four-board');
  const statusEl = container.querySelector('#four-status');
  const resetBtn = container.querySelector('#four-reset');
  
  function render() {
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'four-cell';
        cell.dataset.col = c;
        
        if (board[r][c]) {
          const disc = document.createElement('div');
          disc.className = `four-disc ${board[r][c] === 'B' ? 'blue' : 'red'}`;
          cell.appendChild(disc);
        }
        
        if (r === 0) {
          cell.addEventListener('click', () => dropDisc(c));
        }
        
        boardEl.appendChild(cell);
      }
    }
  }
  
  function dropDisc(col) {
    if (gameOver) return;
    
    // Find lowest empty row
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        board[r][col] = currentPlayer;
        render();
        
        if (checkWin(r, col)) {
          gameOver = true;
          const winner = currentPlayer === 'B' ? 'Blue' : 'Red';
          statusEl.textContent = `🎉 ${winner} Player Wins!`;
          statusEl.style.background = currentPlayer === 'B' ? 
            'linear-gradient(135deg, #3b82f6, #1e40af)' : 
            'linear-gradient(135deg, #ef4444, #b91c1c)';
          return;
        }
        
        if (board.every(row => row.every(cell => cell))) {
          gameOver = true;
          statusEl.textContent = "🤝 It's a Draw!";
          return;
        }
        
        currentPlayer = currentPlayer === 'B' ? 'R' : 'B';
        statusEl.textContent = currentPlayer === 'B' ? "Blue Player's Turn 🔵" : "Red Player's Turn 🔴";
        statusEl.style.background = '';
        return;
      }
    }
  }
  
  function checkWin(row, col) {
    const player = board[row][col];
    
    // Check horizontal
    let count = 1;
    for (let c = col - 1; c >= 0 && board[row][c] === player; c--) count++;
    for (let c = col + 1; c < COLS && board[row][c] === player; c++) count++;
    if (count >= 4) return true;
    
    // Check vertical
    count = 1;
    for (let r = row - 1; r >= 0 && board[r][col] === player; r--) count++;
    for (let r = row + 1; r < ROWS && board[r][col] === player; r++) count++;
    if (count >= 4) return true;
    
    // Check diagonal /
    count = 1;
    for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && board[r][c] === player; r--, c++) count++;
    for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && board[r][c] === player; r++, c--) count++;
    if (count >= 4) return true;
    
    // Check diagonal \
    count = 1;
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r][c] === player; r--, c--) count++;
    for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && board[r][c] === player; r++, c++) count++;
    if (count >= 4) return true;
    
    return false;
  }
  
  function reset() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    currentPlayer = 'B';
    gameOver = false;
    statusEl.textContent = "Blue Player's Turn 🔵";
    statusEl.style.background = '';
    render();
  }
  
  resetBtn.addEventListener('click', reset);
  render();
}
