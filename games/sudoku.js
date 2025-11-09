// ================================================
// SUDOKU GAME
// ================================================

function initSudoku(container) {
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
  
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];
  
  let selectedCell = null;
  
  container.innerHTML = `
    <style>
      .sudoku-wrapper {
        max-width: 600px;
        margin: 0 auto;
      }
      .sudoku-grid {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 0;
        background: var(--color-border);
        border: 4px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      .sudoku-cell {
        aspect-ratio: 1;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .sudoku-cell:nth-child(3n) {
        border-right: 2px solid var(--color-border);
      }
      .sudoku-cell:nth-child(n+19):nth-child(-n+27),
      .sudoku-cell:nth-child(n+46):nth-child(-n+54) {
        border-bottom: 2px solid var(--color-border);
      }
      .sudoku-cell.readonly {
        background: var(--color-bg-hover);
        color: var(--color-text-primary);
        font-weight: 700;
        cursor: default;
      }
      .sudoku-cell.selected {
        background: var(--color-accent-blue);
        color: white;
      }
      .sudoku-cell.wrong {
        background: var(--color-accent-red);
        color: white;
      }
      .sudoku-numbers {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.5rem;
        max-width: 400px;
        margin: 2rem auto 0;
      }
      .sudoku-num-btn {
        padding: 1rem;
        background: var(--color-bg-card);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-size: 1.5rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }
      .sudoku-num-btn:hover {
        background: var(--color-accent-blue);
        color: white;
        border-color: var(--color-accent-blue);
      }
    </style>
    
    <div class="sudoku-wrapper">
      <div class="sudoku-grid" id="sudoku-grid"></div>
      <div class="sudoku-numbers" id="sudoku-numbers"></div>
    </div>
  `;
  
  const gridEl = container.querySelector('#sudoku-grid');
  const numbersEl = container.querySelector('#sudoku-numbers');
  
  function render() {
    gridEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        if (puzzle[r][c] !== 0) {
          cell.textContent = puzzle[r][c];
          cell.classList.add('readonly');
        }
        
        cell.addEventListener('click', () => selectCell(r, c));
        gridEl.appendChild(cell);
      }
    }
    
    // Number buttons
    numbersEl.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
      const btn = document.createElement('button');
      btn.className = 'sudoku-num-btn';
      btn.textContent = i;
      btn.addEventListener('click', () => placeNumber(i));
      numbersEl.appendChild(btn);
    }
    
    // Erase button
    const eraseBtn = document.createElement('button');
    eraseBtn.className = 'sudoku-num-btn';
    eraseBtn.textContent = '⌫';
    eraseBtn.addEventListener('click', () => placeNumber(0));
    numbersEl.appendChild(eraseBtn);
  }
  
  function selectCell(r, c) {
    if (puzzle[r][c] !== 0) return;
    
    document.querySelectorAll('.sudoku-cell').forEach(cell => {
      cell.classList.remove('selected');
    });
    
    const cell = gridEl.children[r * 9 + c];
    cell.classList.add('selected');
    selectedCell = { r, c };
  }
  
  function placeNumber(num) {
    if (!selectedCell) return;
    
    const { r, c } = selectedCell;
    const cell = gridEl.children[r * 9 + c];
    
    if (num === 0) {
      puzzle[r][c] = 0;
      cell.textContent = '';
      cell.classList.remove('wrong');
      return;
    }
    
    if (solution[r][c] === num) {
      puzzle[r][c] = num;
      cell.textContent = num;
      cell.classList.remove('wrong', 'selected');
      cell.classList.add('readonly');
      selectedCell = null;
    } else {
      cell.classList.add('wrong');
      setTimeout(() => cell.classList.remove('wrong'), 500);
    }
  }
  
  render();
}
