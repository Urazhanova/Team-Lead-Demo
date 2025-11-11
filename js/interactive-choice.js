/**
 * Interactive Choice Module
 * Handles user selections in choice-based interactive screens
 */

var InteractiveChoice = {
  selectedChoice: null,
  currentScreen: null,

  /**
   * Initialize choice handlers
   */
  init: function() {
    this.bindChoiceButtons();
    console.log("[InteractiveChoice] Module initialized");
  },

  /**
   * Bind choice button events
   */
  bindChoiceButtons: function() {
    var self = this;

    // Find all choice buttons on the current screen
    var choiceButtons = document.querySelectorAll(".choice-btn");

    console.log("[InteractiveChoice] Found " + choiceButtons.length + " choice buttons");

    if (choiceButtons.length === 0) {
      console.log("[InteractiveChoice] Not a choice screen, skipping initialization");
      return;
    }

    choiceButtons.forEach(function(btn) {
      var choiceId = btn.getAttribute("data-choice-id");

      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("[InteractiveChoice] Choice selected: " + choiceId);

        // Remove previous selection styling
        choiceButtons.forEach(function(b) {
          b.style.borderColor = "var(--brand-secondary)";
          b.style.backgroundColor = "white";
        });

        // Style selected button
        btn.style.borderColor = "#4CAF50";
        btn.style.backgroundColor = "#E8F5E9";

        // Store selection
        self.selectedChoice = choiceId;

        console.log("[InteractiveChoice] Button styled as selected");
      });
    });

    console.log("[InteractiveChoice] Choice buttons bound successfully");
  }
};

/**
 * Initialize choice module when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    console.log("[InteractiveChoice] Initializing on DOMContentLoaded");
    InteractiveChoice.init();
  }, 800);
});

// Re-initialize when new screens are loaded
if (typeof Navigation !== 'undefined') {
  var originalNavigationShowScreen = Navigation.showScreen;
  Navigation.showScreen = function(index, animate) {
    console.log("[InteractiveChoice] Screen change detected to index " + index);
    originalNavigationShowScreen.call(this, index, animate);

    // Re-initialize for new screen after content is rendered
    setTimeout(function() {
      console.log("[InteractiveChoice] Re-initializing after screen change");
      InteractiveChoice.init();
    }, 800);
  };
}

// Set up MutationObserver to detect choice buttons
if (typeof MutationObserver !== 'undefined') {
  var observer = new MutationObserver(function(mutations) {
    var choiceButtons = document.querySelectorAll(".choice-btn");
    if (choiceButtons.length > 0) {
      console.log("[InteractiveChoice] Detected choice buttons via mutation");
      InteractiveChoice.init();
    }
  });

  var mainContent = document.getElementById('mainContent');
  if (mainContent) {
    observer.observe(mainContent, {
      childList: true,
      subtree: true,
      characterData: false
    });
    console.log("[InteractiveChoice] MutationObserver attached to mainContent");
  }
}

console.log("[InteractiveChoice] Module loaded");
