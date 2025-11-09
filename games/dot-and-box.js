// ================================================
// DOT AND BOX GAME - Full Working + Online Play
// ================================================

function initDotAndBox(container) {
  const SIZE = 4;
  let lines = new Set();
  let boxes = {};
  let currentPlayer = 1; // 1 = Blue, 2 = Red
  let scores = { 1: 0, 2: 0 };
  let gameOver = false;
  
  container.innerHTML = `
    <style>
      .dab-wrapper {
        max-width: 600px;
        margin: 0 auto;
      }
      .dab-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1rem;
      }
      .dab-score {
        flex: 1;
        text-align: center;
        padding: 1rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-md);
        border: 2px solid var(--color-border);
      }
      .dab-score.active {
        border-color: var(--color-accent-blue);
        box-shadow: 0 0 20px rgba(74, 158, 255, 0.4);
      }
      .dab-score-label {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin-bottom: 0.5rem;
      }
      .dab-score-value {
        font-size: 2rem;
        font-weight: 700;
      }
      .dab-score.player-1 .dab-score-value {
        color: #4a90e2;
      }
      .dab-score.player-2 .dab-score-value {
        color: #e94e77;
      }
      .dab-board {
        display: grid;
        gap: 10px;
        margin-bottom: 2rem;
        background: var(--color-bg-card);
        padding: 20px;
        border-radius: var(--radius-lg);
      }
      .dab-dot {
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
      }
      .dab-line {
        background: #444;
        cursor: pointer;
        transition: all 0.3s;
      }
      .dab-line.horizontal {
        height: 6px;
      }
      .dab-line.vertical {
        width: 6px;
      }
      .dab-line:hover:not(.active) {
        background: #666;
        transform: scale(1.1);
      }
      .dab-line.active {
        cursor: default;
      }
      .dab-line.active.player-1 {
        background: #4a90e2;
      }
      .dab-line.active.player-2 {
        background: #e94e77;
      }
      .dab-box {
        background: #2a2a2a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: 700;
        color: white;
        border-radius: 4px;
      }
      .dab-box.player-1 {
        background: #4a90e2;
      }
      .dab-box.player-2 {
        background: #e94e77;
      }
      .dab-online-btn {
        display: block;
        width: 100%;
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple));
        color: white;
        border-radius: var(--radius-md);
        font-size: 1.2rem;
        font-weight: 700;
        text-decoration: none;
        text-align: center;
        transition: all 0.3s;
        box-shadow: 0 4px 16px rgba(74, 158, 255, 0.4);
      }
      .dab-online-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(74, 158, 255, 0.6);
      }
    </style>
    
    <div class="dab-wrapper">
      <div class="dab-header">
        <div class="dab-score player-1 active" id="score-1">
          <div class="dab-score-label">Player 1 (Blue)</div>
          <div class="dab-score-value">0</div>
        </div>
        <div class="dab-score player-2" id="score-2">
          <div class="dab-score-label">Player 2 (Red)</div>
          <div class="dab-score-value">0</div>
        </div>
      </div>
      <div class="dab-board" id="dab-board"></div>
      <a href="https://online-dot-and-box-bd.netlify.app/" target="_blank" class="dab-online-btn">
        🌐 Play Online Multiplayer
      </a>
    </div>
  `;
  
  const boardEl = container.querySelector('#dab-board');
  const score1El = container.querySelector('#score-1');
  const score2El = container.querySelector('#score-2');
  
  function render() {
    const cols = SIZE * 2 + 1;
    boardEl.style.gridTemplateColumns = `repeat(${cols}, minmax(40px, 1fr))`;
    boardEl.innerHTML = '';
    
    for (let r = 0; r < SIZE * 2 + 1; r++) {
      for (let c = 0; c < SIZE * 2 + 1; c++) {
        if (r % 2 === 0 && c % 2 === 0) {
          // Dot
          const dot = document.createElement('div');
          dot.className = 'dab-dot';
          boardEl.appendChild(dot);
        } else if (r % 2 === 0 && c % 2 === 1) {
          // Horizontal line
          const lineKey = `h-${r/2}-${(c-1)/2}`;
          const line = document.createElement('div');
          line.className = 'dab-line horizontal';
          if (lines.has(lineKey)) {
            line.classList.add('active', `player-${lines.get(lineKey)}`);
          } else {
            line.addEventListener('click', () => drawLine(lineKey));
          }
          boardEl.appendChild(line);
        } else if (r % 2 === 1 && c % 2 === 0) {
          // Vertical line
          const lineKey = `v-${(r-1)/2}-${c/2}`;
          const line = document.createElement('div');
          line.className = 'dab-line vertical';
          if (lines.has(lineKey)) {
            line.classList.add('active', `player-${lines.get(lineKey)}`);
          } else {
            line.addEventListener('click', () => drawLine(lineKey));
          }
          boardEl.appendChild(line);
        } else {
          // Box
          const boxKey = `${(r-1)/2}-${(c-1)/2}`;
          const box = document.createElement('div');
          box.className = 'dab-box';
          if (boxes[boxKey]) {
            box.classList.add(`player-${boxes[boxKey]}`);
            box.textContent = boxes[boxKey];
          }
          boardEl.appendChild(box);
        }
      }
    }
    
    updateScores();
  }
  
  function drawLine(lineKey) {
    if (gameOver || lines.has(lineKey)) return;
    
    lines.set(lineKey, currentPlayer);
    
    // Check for completed boxes
    const newBoxes = getBoxesFromLine(lineKey);
    let gotBox = false;
    
    newBoxes.forEach(boxKey => {
      if (!boxes[boxKey] && isBoxComplete(boxKey)) {
        boxes[boxKey] = currentPlayer;
        scores[currentPlayer]++;
        gotBox = true;
      }
    });
    
    // If no box completed, switch player
    if (!gotBox) {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      score1El.classList.toggle('active');
      score2El.classList.toggle('active');
    }
    
    render();
    
    // Check game over
    if (Object.keys(boxes).length === SIZE * SIZE) {
      gameOver = true;
      setTimeout(() => {
        const winner = scores[1] > scores[2] ? 'Blue' : scores[2] > scores[1] ? 'Red' : 'Draw';
        alert(`Game Over! ${winner === 'Draw' ? "It's a draw!" : winner + ' wins!'}`);
      }, 500);
    }
  }
  
  function getBoxesFromLine(lineKey) {
    const [type, r, c] = lineKey.split('-').map((v, i) => i === 0 ? v : parseInt(v));
    const boxKeys = [];
    
    if (type === 'h') {
      if (r > 0) boxKeys.push(`${r-1}-${c}`);
      if (r < SIZE) boxKeys.push(`${r}-${c}`);
    } else {
      if (c > 0) boxKeys.push(`${r}-${c-1}`);
      if (c < SIZE) boxKeys.push(`${r}-${c}`);
    }
    
    return boxKeys;
  }
  
  function isBoxComplete(boxKey) {
    const [r, c] = boxKey.split('-').map(Number);
    const edges = [
      `h-${r}-${c}`,
      `h-${r+1}-${c}`,
      `v-${r}-${c}`,
      `v-${r}-${c+1}`
    ];
    return edges.every(edge => lines.has(edge));
  }
  
  function updateScores() {
    score1El.querySelector('.dab-score-value').textContent = scores[1];
    score2El.querySelector('.dab-score-value').textContent = scores[2];
  }
  
  render();
}
