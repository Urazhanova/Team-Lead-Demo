/**
 * Loading Manager
 * Handles loading screen visibility
 */

var LoadingManager = {
  /**
   * Hide loading screen
   */
  hideLoadingScreen: function() {
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      console.log("[LoadingManager] Hiding loading screen");
      loadingScreen.classList.add('hidden');
      
      // Remove from DOM after animation completes
      setTimeout(function() {
        if (loadingScreen && loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
          console.log("[LoadingManager] Loading screen removed from DOM");
        }
      }, 300);
    }
  },

  /**
   * Hide loading screen once content is ready
   * Call this when first screen is rendered
   */
  onContentReady: function() {
    console.log("[LoadingManager] Content ready, hiding loading screen");
    this.hideLoadingScreen();
  }
};
