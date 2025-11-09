// ================================================
// REUSABLE UI COMPONENTS
// ================================================

const UIComponents = {
  // Render games grid
  renderGamesGrid() {
    const gamesGrid = document.getElementById('games-grid');
    gamesGrid.innerHTML = '';
    
    GAMES_CONFIG.forEach(game => {
      const gameCard = this.createGameCard(game);
      gamesGrid.appendChild(gameCard);
    });
    
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  },
  
  // Create game card
  createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-color', game.color);
    card.setAttribute('data-aos', 'zoom-in');
    card.setAttribute('data-aos-delay', Math.random() * 200);
    
    card.innerHTML = `
      <div class="game-logo">${game.emoji}</div>
      <div class="game-name">${game.name}</div>
    `;
    
    card.addEventListener('click', (e) => {
      Animations.createRipple(card, e);
      setTimeout(() => {
        Router.navigate(`/games/${game.id}`);
      }, 300);
    });
    
    return card;
  },
  
  // Show modes modal
  showModesModal(gameConfig) {
    const modal = document.getElementById('modes-modal');
    const modalTitle = document.getElementById('modal-game-title');
    const modesContainer = document.getElementById('modes-container');
    const playButton = document.getElementById('btn-play-game');
    
    modalTitle.textContent = gameConfig.name;
    modesContainer.innerHTML = '';
    
    // Render mode cards
    gameConfig.modes.forEach(mode => {
      const modeCard = this.createModeCard(mode, gameConfig);
      modesContainer.appendChild(modeCard);
    });
    
    // Show modal
    modal.classList.add('active');
    
    // Handle play button
    playButton.onclick = () => {
      const selectedMode = document.querySelector('.mode-card.selected');
      if (!selectedMode) return;
      
      const modeId = selectedMode.dataset.modeId;
      const mode = gameConfig.modes.find(m => m.id === modeId);
      
      // Check if external URL
      if (mode.isExternal) {
        window.open(mode.url, '_blank');
        modal.classList.remove('active');
      } else {
        AppState.setSelectedMode(modeId);
        modal.classList.remove('active');
        Router.navigate(`/games/${gameConfig.id}`);
        
        // Load game with mode
        setTimeout(() => {
          document.getElementById('game-view').classList.add('active');
          AppState.setView('game');
          GameLoader.loadGame(gameConfig.id, modeId);
        }, 100);
      }
    };
  },
  
  // Create mode card
  createModeCard(mode, gameConfig) {
    const card = document.createElement('div');
    card.className = 'mode-card';
    card.dataset.modeId = mode.id;
    
    card.innerHTML = `
      <div class="mode-icon">${mode.icon}</div>
      <div class="mode-info">
        <div class="mode-name">${mode.name}</div>
        <div class="mode-description">${mode.description}</div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => {
        c.classList.remove('selected');
      });
      card.classList.add('selected');
    });
    
    return card;
  },
  
  // Close modal
  closeModal() {
    const modal = document.getElementById('modes-modal');
    modal.classList.remove('active');
  },
  
  // Update game title
  updateGameTitle(gameName) {
    const titleElement = document.getElementById('game-current-title');
    if (titleElement) {
      titleElement.textContent = gameName;
    }
  },
  
  // Show loading
  showLoading() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="game-loading">
        <div class="loading"></div>
        <div class="game-loading-text">Loading game...</div>
      </div>
    `;
  },
  
  // Show error
  showError(message) {
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="game-loading">
        <div style="font-size: 3rem;">❌</div>
        <div class="game-loading-text">${message}</div>
      </div>
    `;
  }
};
