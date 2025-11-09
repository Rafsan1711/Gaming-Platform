// ================================================
// TIC TAC TOE GAME
// ================================================

function initTicTacToe(container, mode = 'friend') {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameOver = false;
  const isBot = mode === 'bot';
  
  container.innerHTML = `
    <style>
      .ttt-wrapper {
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
      }
      .ttt-status {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: var(--color-accent-blue);
      }
      .ttt-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin-bottom: 2rem;
      }
      .ttt-cell {
        aspect-ratio: 1;
        background: var(--color-bg-card);
        border: 3px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 4rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .ttt-cell:hover:not(.filled) {
        background: var(--color-bg-hover);
        border-color: var(--color-accent-blue);
        transform: scale(1.05);
      }
      .ttt-cell.filled {
        cursor: default;
      }
      .ttt-cell.x {
        color: var(--color-accent-red);
      }
      .ttt-cell.o {
        color: var(--color-accent-blue);
      }
      .ttt-reset {
        padding: 1rem 2rem;
        background: var(--color-accent-green);
        color: white;
        border-radius: var(--radius-md);
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .ttt-reset:hover {
        background: #238636;
        transform: translateY(-2px);
      }
    </style>
    
    <div class="ttt-wrapper">
      <div class="ttt-status">Player X's Turn</div>
      <div class="ttt-board" id="ttt-board"></div>
      <button class="ttt-reset" id="ttt-reset">New Game</button>
    </div>
  `;
  
  const boardEl = container.querySelector('#ttt-board');
  const statusEl = container.querySelector('.ttt-status');
  const resetBtn = container.querySelector('#ttt-reset');
  
  function render() {
    boardEl.innerHTML = '';
    board.forEach((cell, index) => {
      const cellEl = document.createElement('div');
      cellEl.className = 'ttt-cell';
      if (cell) {
        cellEl.classList.add('filled', cell.toLowerCase());
        cellEl.textContent = cell;
      }
      cellEl.addEventListener('click', () => handleCellClick(index));
      boardEl.appendChild(cellEl);
    });
  }
  
  function handleCellClick(index) {
    if (gameOver || board[index] || (isBot && currentPlayer === 'O')) return;
    
    board[index] = currentPlayer;
    render();
    
    if (checkWinner()) {
      statusEl.textContent = `Player ${currentPlayer} Wins! 🎉`;
      gameOver = true;
      return;
    }
    
    if (board.every(cell => cell)) {
      statusEl.textContent = "It's a Draw!";
      gameOver = true;
      return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Player ${currentPlayer}'s Turn`;
    
    if (isBot && currentPlayer === 'O') {
      setTimeout(botMove, 500);
    }
  }
  
  function botMove() {
    const move = getBestMove();
    if (move !== null) {
      handleCellClick(move);
    }
  }
  
  function getBestMove() {
    // Simple minimax
    let bestScore = -Infinity;
    let move = null;
    
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }
  
  function minimax(board, depth, isMaximizing) {
    const winner = checkWinnerFor(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell)) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }
  
  function checkWinner() {
    return checkWinnerFor(board) !== null;
  }
  
  function checkWinnerFor(b) {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
  
  function reset() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    statusEl.textContent = "Player X's Turn";
    render();
  }
  
  resetBtn.addEventListener('click', reset);
  render();
}
