// ================================================
// APP STATE MANAGEMENT
// ================================================

const AppState = {
  // Current view
  currentView: 'home',
  
  // Selected game
  selectedGame: null,
  selectedMode: null,
  
  // Game instance
  currentGameInstance: null,
  
  // Initialize state
  init() {
    this.loadFromLocalStorage();
  },
  
  // Set current view
  setView(viewName) {
    this.currentView = viewName;
    this.saveToLocalStorage();
  },
  
  // Set selected game
  setSelectedGame(gameId) {
    this.selectedGame = gameId;
    this.saveToLocalStorage();
  },
  
  // Set selected mode
  setSelectedMode(modeId) {
    this.selectedMode = modeId;
    this.saveToLocalStorage();
  },
  
  // Clear game state
  clearGameState() {
    this.selectedGame = null;
    this.selectedMode = null;
    this.currentGameInstance = null;
    this.saveToLocalStorage();
  },
  
  // Get game config by ID
  getGameConfig(gameId) {
    return GAMES_CONFIG.find(game => game.id === gameId);
  },
  
  // Save to localStorage
  saveToLocalStorage() {
    try {
      const state = {
        currentView: this.currentView,
        selectedGame: this.selectedGame,
        selectedMode: this.selectedMode
      };
      localStorage.setItem('gamingPlatformState', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },
  
  // Load from localStorage
  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('gamingPlatformState');
      if (saved) {
        const state = JSON.parse(saved);
        this.currentView = state.currentView || 'home';
        this.selectedGame = state.selectedGame || null;
        this.selectedMode = state.selectedMode || null;
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }
};

// Initialize on load
AppState.init();
