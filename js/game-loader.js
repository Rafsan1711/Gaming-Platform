// ================================================
// DYNAMIC GAME LOADER
// ================================================

const GameLoader = {
  // Load game by ID
  async loadGame(gameId, modeId = null) {
    const gameConfig = AppState.getGameConfig(gameId);
    
    if (!gameConfig) {
      UIComponents.showError('Game not found');
      return;
    }
    
    // Update title
    UIComponents.updateGameTitle(gameConfig.name);
    
    // Show loading
    UIComponents.showLoading();
    
    try {
      // Load game script
      await this.loadGameScript(gameId);
      
      // Initialize game
      const container = document.getElementById('game-container');
      
      if (window[this.getGameInitFunction(gameId)]) {
        window[this.getGameInitFunction(gameId)](container, modeId);
      } else {
        UIComponents.showError('Game initialization failed');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      UIComponents.showError('Failed to load game');
    }
  },
  
  // Load game script dynamically
  loadGameScript(gameId) {
    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (document.getElementById(`game-script-${gameId}`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.id = `game-script-${gameId}`;
      script.src = `games/${gameId}.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
  
  // Get game initialization function name
  getGameInitFunction(gameId) {
    // Convert kebab-case to camelCase
    const camelCase = gameId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return `init${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
  },
  
  // Restart current game
  restartGame() {
    if (AppState.selectedGame) {
      this.loadGame(AppState.selectedGame, AppState.selectedMode);
    }
  }
};
