// ================================================
// GAME CONFIGURATIONS
// ================================================

const GAMES_CONFIG = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    emoji: '❌',
    color: 'blue',
    description: 'Classic X and O game',
    hasModes: true,
    modes: [
      { id: 'friend', name: 'Play with Friend', icon: '👥', description: 'Local multiplayer' },
      { id: 'bot', name: 'Play vs Bot', icon: '🤖', description: 'Challenge AI opponent' }
    ]
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    emoji: '🔢',
    color: 'purple',
    description: 'Number puzzle game',
    hasModes: false
  },
  {
    id: 'memory',
    name: 'Memory Match',
    emoji: '🃏',
    color: 'green',
    description: 'Find matching pairs',
    hasModes: false
  },
  {
    id: 'hangman',
    name: 'Hangman',
    emoji: '🎭',
    color: 'red',
    description: 'Guess the word',
    hasModes: false
  },
  {
    id: 'quiz',
    name: 'Quiz Game',
    emoji: '❓',
    color: 'orange',
    description: 'Test your knowledge',
    hasModes: false
  },
  {
    id: 'reversi',
    name: 'Reversi',
    emoji: '⚫',
    color: 'pink',
    description: 'Strategic board game',
    hasModes: false
  },
  {
    id: 'guess-number',
    name: 'Guess Number',
    emoji: '🎲',
    color: 'blue',
    description: 'Guess the hidden number',
    hasModes: false
  },
  {
    id: 'math-quiz',
    name: 'Math Quiz',
    emoji: '➗',
    color: 'purple',
    description: 'Solve math problems',
    hasModes: false
  },
  {
    id: 'four-in-row',
    name: '4 in a Row',
    emoji: '🔴',
    color: 'green',
    description: 'Connect four pieces',
    hasModes: false
  },
  {
    id: 'dot-and-box',
    name: 'Dot and Box',
    emoji: '📦',
    color: 'red',
    description: 'Connect dots game',
    hasModes: true,
    modes: [
      { id: 'online', name: 'Play Online', icon: '🌐', description: 'Multiplayer online', isExternal: true, url: 'https://online-dot-and-box-bd.netlify.app/' }
    ]
  },
  {
    id: 'ball-game',
    name: 'Ball Bounce',
    emoji: '⚽',
    color: 'orange',
    description: 'Bounce the ball',
    hasModes: false
  },
  {
    id: 'color-war',
    name: 'Color War',
    emoji: '🎨',
    color: 'pink',
    description: 'Battle of colors',
    hasModes: false
  },
  {
    id: 'astro-quiz',
    name: 'Astro Quiz',
    emoji: '🌟',
    color: 'blue',
    description: 'Space knowledge test',
    hasModes: false
  }
];
