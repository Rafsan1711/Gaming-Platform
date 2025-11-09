// ================================================
// COLOR WAR GAME - Full Working (You vs Bot)
// ================================================

function initColorWar(container) {
  const SIZE = 5;
  let board = Array(SIZE * SIZE).fill(null);
  let turn = 1; // 1 = You (Blue), 2 = Bot (Red)
  let firstMoves = { 1: false, 2: false };
  let scores = { 1: 0, 2: 0 };
  let gameOver = false;
  
  container.innerHTML = `
    <style>
      .cw-wrapper {
        max-width: 600px;
        margin: 0 auto;
      }
      .cw-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1rem;
      }
      .cw-score {
        flex: 1;
        text-align: center;
        padding: 1rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-md);
        border: 2px solid var(--color-border);
      }
      .cw-score.active {
        border-color: var(--color-accent-blue);
        box-shadow: 0 0 20px rgba(74, 158, 255, 0.4);
      }
      .cw-score-label {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin-bottom: 0.5rem;
      }
      .cw-score-value {
        font-size: 2rem;
        font-weight: 700;
      }
      .cw-board {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
        background: var(--color-bg-secondary);
        padding: 20px;
        border-radius: var(--radius-lg);
      }
      .cw-cell {
        aspect-ratio: 1;
        background: var(--color-bg-card);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
      }
      .cw-cell:hover {
        transform: scale(1.05);
        border-color: var(--color-accent-blue);
      }
      .cw-big-circle {
        position: absolute;
        width: 80%;
        height: 80%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 3px solid;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 4px;
        gap: 3px;
      }
      .cw-big-circle.player-1 {
        border-color: #4a90e2;
        background: rgba(74, 144, 226, 0.1);
      }
      .cw-big-circle.player-2 {
        border-color: #e94e77;
        background: rgba(233, 78, 119, 0.1);
      }
      .cw-small-circle {
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
      .cw-small-circle.player-1 {
        background: #4a90e2;
        box-shadow: 0 0 8px #4a90e2;
      }
      .cw-small-circle.player-2 {
        background: #e94e77;
        box-shadow: 0 0 8px #e94e77;
      }
    </style>
    
    <div class="cw-wrapper">
      <div class="cw-header">
        <div class="cw-score active" id="score-1">
          <div class="cw-score-label">You (Blue)</div>
          <div class="cw-score-value">0</div>
        </div>
        <div class="cw-score" id="score-2">
          <div class="cw-score-label">Bot (Red)</div>
          <div class="cw-score-value">0</div>
        </div>
      </div>
      <div class="cw-board" id="cw-board"></div>
    </div>
  `;
  
  const boardEl = container.querySelector('#cw-board');
  const score1El = container.querySelector('#score-1');
  const score2El = container.querySelector('#score-2');
  
  function render() {
    boardEl.innerHTML = '';
    for (let i = 0; i < SIZE * SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'cw-cell';
      cell.dataset.index = i;
      
      const data = board[i];
      if (data) {
        const bigCircle = document.createElement('div');
        bigCircle.className = `cw-big-circle player-${data.player}`;
        
        for (let j = 0; j < data.count; j++) {
          const smallCircle = document.createElement('div');
          smallCircle.className = `cw-small-circle player-${data.player}`;
          bigCircle.appendChild(smallCircle);
        }
        
        cell.appendChild(bigCircle);
      }
      
      cell.addEventListener('click', () => handleClick(i));
      boardEl.appendChild(cell);
    }
    
    updateScores();
  }
  
  function handleClick(idx) {
    if (gameOver || turn !== 1) return;
    
    // First move: can place anywhere empty
    if (!firstMoves[1]) {
      if (!board[idx]) {
        board[idx] = { player: 1, count: 3 };
        firstMoves[1] = true;
        nextTurn();
        return;
      }
    }
    
    // Normal move: can only click own circle
    if (board[idx] && board[idx].player === 1) {
      board[idx].count++;
      
      if (board[idx].count >= 4) {
        spread(idx, 1);
      } else {
        nextTurn();
      }
    }
  }
  
  function spread(idx, player) {
    board[idx] = null;
    const neighbors = getNeighbors(idx);
    
    neighbors.forEach(nIdx => {
      if (board[nIdx]) {
        board[nIdx].player = player;
        board[nIdx].count++;
      } else {
        board[nIdx] = { player, count: 1 };
      }
    });
    
    render();
    
    // Check for chain reactions
    setTimeout(() => {
      let hasSpread = false;
      for (let i = 0; i < board.length; i++) {
        if (board[i] && board[i].count >= 4) {
          spread(i, board[i].player);
          hasSpread = true;
          break;
        }
      }
      
      if (!hasSpread) {
        checkWinner();
        nextTurn();
      }
    }, 500);
  }
  
  function getNeighbors(idx) {
    const neighbors = [];
    const row = Math.floor(idx / SIZE);
    const col = idx % SIZE;
    
    if (row > 0) neighbors.push(idx - SIZE);
    if (row < SIZE - 1) neighbors.push(idx + SIZE);
    if (col > 0) neighbors.push(idx - 1);
    if (col < SIZE - 1) neighbors.push(idx + 1);
    
    return neighbors;
  }
  
  function nextTurn() {
    turn = turn === 1 ? 2 : 1;
    score1El.classList.toggle('active');
    score2El.classList.toggle('active');
    
    if (turn === 2) {
      setTimeout(botMove, 1000);
    }
  }
  
  function botMove() {
    if (gameOver) return;
    
    // First move: random empty
    if (!firstMoves[2]) {
      const empties = [];
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) empties.push(i);
      }
      if (empties.length) {
        const idx = empties[Math.floor(Math.random() * empties.length)];
        board[idx] = { player: 2, count: 3 };
        firstMoves[2] = true;
        nextTurn();
        return;
      }
    }
    
    // Find bot's circles
    const botCircles = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] && board[i].player === 2) {
        botCircles.push(i);
      }
    }
    
    if (botCircles.length === 0) {
      nextTurn();
      return;
    }
    
    // Prioritize spreading (count === 3)
    const spreadable = botCircles.filter(i => board[i].count === 3);
    const idx = spreadable.length ? spreadable[0] : botCircles[Math.floor(Math.random() * botCircles.length)];
    
    board[idx].count++;
    if (board[idx].count >= 4) {
      spread(idx, 2);
    } else {
      nextTurn();
    }
  }
  
  function updateScores() {
    scores = { 1: 0, 2: 0 };
    board.forEach(cell => {
      if (cell) scores[cell.player]++;
    });
    
    score1El.querySelector('.cw-score-value').textContent = scores[1];
    score2El.querySelector('.cw-score-value').textContent = scores[2];
  }
  
  function checkWinner() {
    const p1Has = board.some(c => c && c.player === 1);
    const p2Has = board.some(c => c && c.player === 2);
    
    if (!p1Has) {
      gameOver = true;
      alert('Bot wins! 🤖');
    } else if (!p2Has) {
      gameOver = true;
      alert('You win! 🎉');
    }
  }
  
  render();
}
