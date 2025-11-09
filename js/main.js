// ================================================
// MAIN APP INITIALIZATION
// ================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Initialize application
function initApp() {
  // Initialize animations
  Animations.init();
  
  // Initialize router
  Router.init();
  
  // Render games grid
  UIComponents.renderGamesGrid();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('🎮 Gaming Platform initialized successfully!');
}

// Setup event listeners
function setupEventListeners() {
  // Home screen - Start button
  const btnStartGaming = document.getElementById('btn-start-gaming');
  if (btnStartGaming) {
    btnStartGaming.addEventListener('click', (e) => {
      Animations.createRipple(btnStartGaming, e);
      setTimeout(() => {
        Router.navigate('/games');
      }, 300);
    });
  }
  
  // Games screen - Back button
  const btnBackHome = document.getElementById('btn-back-home');
  if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
      Router.navigate('/');
    });
  }
  
  // Game screen - Back button
  const btnBackGames = document.getElementById('btn-back-games');
  if (btnBackGames) {
    btnBackGames.addEventListener('click', () => {
      Router.navigate('/games');
    });
  }
  
  // Game screen - Restart button
  const btnRestartGame = document.getElementById('btn-restart-game');
  if (btnRestartGame) {
    btnRestartGame.addEventListener('click', () => {
      GameLoader.restartGame();
    });
  }
  
  // Modal - Close button
  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      UIComponents.closeModal();
    });
  }
  
  // Modal - Click outside to close
  const modesModal = document.getElementById('modes-modal');
  if (modesModal) {
    modesModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        UIComponents.closeModal();
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
      UIComponents.closeModal();
    }
    
    // Backspace to go back
    if (e.key === 'Backspace' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      if (AppState.currentView === 'game') {
        Router.navigate('/games');
      } else if (AppState.currentView === 'games') {
        Router.navigate('/');
      }
    }
  });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  Router.handleRoute();
});

// Prevent context menu (optional)
document.addEventListener('contextmenu', (e) => {
  // e.preventDefault(); // Uncomment to disable right-click
});
