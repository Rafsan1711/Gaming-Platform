// ================================================
// ASTRONOMY QUIZ GAME - Full Working
// ================================================

function initAstroQuiz(container) {
  const questions = [
    { q: 'Which planet is known as the Red Planet?', opts: ['Venus', 'Mars', 'Jupiter', 'Saturn'], ans: 'Mars', emoji: '🔴' },
    { q: 'Which planet is closest to the Sun?', opts: ['Earth', 'Mercury', 'Venus', 'Mars'], ans: 'Mercury', emoji: '☀️' },
    { q: 'Which planet is known for its rings?', opts: ['Saturn', 'Uranus', 'Jupiter', 'Neptune'], ans: 'Saturn', emoji: '💍' },
    { q: 'Which planet is the largest in the Solar System?', opts: ['Earth', 'Mars', 'Jupiter', 'Saturn'], ans: 'Jupiter', emoji: '🌌' },
    { q: 'What is the hottest planet in our solar system?', opts: ['Venus', 'Mercury', 'Mars', 'Saturn'], ans: 'Venus', emoji: '🔥' },
    { q: 'Which planet has the longest day?', opts: ['Earth', 'Venus', 'Jupiter', 'Neptune'], ans: 'Venus', emoji: '⏰' },
    { q: 'Which planet is known as the morning star?', opts: ['Venus', 'Mercury', 'Mars', 'Saturn'], ans: 'Venus', emoji: '⭐' },
    { q: 'Which planet has the most moons?', opts: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], ans: 'Jupiter', emoji: '🌙' },
    { q: 'What is the smallest planet?', opts: ['Mercury', 'Venus', 'Earth', 'Mars'], ans: 'Mercury', emoji: '🔹' },
    { q: 'Which planet is tilted on its side?', opts: ['Earth', 'Venus', 'Uranus', 'Saturn'], ans: 'Uranus', emoji: '↔️' }
  ];
  
  let currentQ = 0;
  let score = 0;
  let timer = 30;
  let timerInterval = null;
  
  container.innerHTML = `
    <style>
      .astro-wrapper {
        max-width: 700px;
        margin: 0 auto;
      }
      .astro-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1rem;
      }
      .astro-timer {
        flex: 1;
        text-align: center;
        padding: 1rem;
        background: linear-gradient(135deg, #f85149, #ef4444);
        border-radius: var(--radius-md);
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
      }
      .astro-score {
        flex: 1;
        text-align: center;
        padding: 1rem;
        background: linear-gradient(135deg, #2ea043, #16a34a);
        border-radius: var(--radius-md);
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
      }
      .astro-planet {
        text-align: center;
        font-size: 6rem;
        margin: 2rem 0;
        animation: float 3s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .astro-question {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-md);
      }
      .astro-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .astro-option {
        padding: 1.5rem;
        background: var(--color-bg-card);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }
      .astro-option:hover {
        background: var(--color-accent-blue);
        color: white;
        border-color: var(--color-accent-blue);
        transform: translateY(-4px);
      }
      .astro-option.correct {
        background: var(--color-accent-green);
        border-color: var(--color-accent-green);
        color: white;
      }
      .astro-option.wrong {
        background: var(--color-accent-red);
        border-color: var(--color-accent-red);
        color: white;
      }
      .astro-result {
        text-align: center;
        padding: 3rem;
        background: var(--color-bg-card);
        border-radius: var(--radius-lg);
      }
      .astro-result-emoji {
        font-size: 5rem;
        margin-bottom: 1rem;
      }
      .astro-result-text {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      .astro-restart {
        padding: 1rem 2rem;
        background: var(--color-accent-blue);
        color: white;
        border-radius: var(--radius-md);
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        margin-top: 1rem;
      }
    </style>
    
    <div class="astro-wrapper">
      <div class="astro-header">
        <div class="astro-timer">⏰ <span id="astro-timer">30</span>s</div>
        <div class="astro-score">⭐ Score: <span id="astro-score">0</span></div>
      </div>
      <div id="astro-content"></div>
    </div>
  `;
  
  const timerEl = container.querySelector('#astro-timer');
  const scoreEl = container.querySelector('#astro-score');
  const contentEl = container.querySelector('#astro-content');
  
  function render() {
    if (currentQ >= questions.length) {
      showResult();
      return;
    }
    
    const q = questions[currentQ];
    contentEl.innerHTML = `
      <div class="astro-planet">${q.emoji}</div>
      <div class="astro-question">${q.q}</div>
      <div class="astro-options" id="astro-options"></div>
    `;
    
    const optionsEl = contentEl.querySelector('#astro-options');
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'astro-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => answer(opt, btn));
      optionsEl.appendChild(btn);
    });
  }
  
  function answer(opt, btn) {
    const q = questions[currentQ];
    const correct = opt === q.ans;
    
    if (correct) {
      score++;
      scoreEl.textContent = score;
      btn.classList.add('correct');
    } else {
      btn.classList.add('wrong');
      // Show correct answer
      Array.from(btn.parentElement.children).forEach(b => {
        if (b.textContent === q.ans) {
          b.classList.add('correct');
        }
      });
    }
    
    // Disable all buttons
    Array.from(btn.parentElement.children).forEach(b => {
      b.style.pointerEvents = 'none';
    });
    
    setTimeout(() => {
      currentQ++;
      render();
    }, 1500);
  }
  
  function showResult() {
    clearInterval(timerInterval);
    const emoji = score >= 7 ? '🎉' : score >= 5 ? '👍' : '😅';
    const text = score >= 7 ? 'Excellent!' : score >= 5 ? 'Good Job!' : 'Keep Learning!';
    
    contentEl.innerHTML = `
      <div class="astro-result">
        <div class="astro-result-emoji">${emoji}</div>
        <div class="astro-result-text">${text}</div>
        <div style="font-size: 1.5rem; color: var(--color-text-secondary);">
          You scored ${score} out of ${questions.length}
        </div>
        <button class="astro-restart" onclick="location.reload()">Play Again</button>
      </div>
    `;
  }
  
  // Start timer
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    
    if (timer <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
  
  render();
}
