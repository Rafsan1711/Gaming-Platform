// ================================================
// URL ROUTING SYSTEM
// ================================================

const Router = {
  // Route patterns
  routes: {
    '/': 'home',
    '/games': 'games',
    '/games/:gameId': 'game',
    '/games/:gameId/modes': 'modes'
  },
  
  // Initialize router
  init() {
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial route
    this.handleRoute();
  },
  
  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  },
  
  // Get current path
  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  },
  
  // Parse path parameters
  parsePath(pattern, path) {
    const patternParts = pattern.split('/').filter(p => p);
    const pathParts = path.split('/').filter(p => p);
    
    if (patternParts.length !== pathParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    
    return params;
  },
  
  // Handle route change
  handleRoute() {
    const path = this.getCurrentPath();
    
    // Match route pattern
    for (const [pattern, viewName] of Object.entries(this.routes)) {
      const params = this.parsePath(pattern, path);
      
      if (params !== null) {
        this.showView(viewName, params);
        return;
      }
    }
    
    // No match - go to home
    this.navigate('/');
  },
  
  // Show view based on route
  showView(viewName, params = {}) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    
    // Show target view
    if (viewName === 'home') {
      document.getElementById('home-view').classList.add('active');
      AppState.setView('home');
    } else if (viewName === 'games') {
      document.getElementById('games-view').classList.add('active');
      AppState.setView('games');
    } else if (viewName === 'game') {
      const gameId = params.gameId;
      AppState.setSelectedGame(gameId);
      
      // Check if game has modes
      const gameConfig = AppState.getGameConfig(gameId);
      if (gameConfig && gameConfig.hasModes) {
        // Show modes modal
        UIComponents.showModesModal(gameConfig);
      } else {
        // Load game directly
        document.getElementById('game-view').classList.add('active');
        AppState.setView('game');
        GameLoader.loadGame(gameId);
      }
    }
  }
};
