/**
 * Navigation Module - FIXED VERSION
 * Handles screen navigation, progress tracking, and state management
 */

var Navigation = {
  screens: [],
  currentScreenIndex: 0,
  screenHistory: [],
  isTransitioning: false,
  currentLesson: null,
  currentLessonId: 0, // Start with introduction (lesson 0)

  /**
   * Initialize navigation (async)
   */
  init: function() {
    console.log("[Navigation] init() called");

    // First check for static screens
    var staticScreens = Array.from(document.querySelectorAll(".screen"));
    console.log("[Navigation] Found " + staticScreens.length + " static screens");

    // If no static screens and ScreenRenderer is available, load from JSON
    if (staticScreens.length === 0) {
      console.log("[Navigation] No static screens. Checking for ScreenRenderer...");

      if (typeof ScreenRenderer === "undefined") {
        console.error("[Navigation] ScreenRenderer not available - cannot load dynamic screens");
        return;
      }

      console.log("[Navigation] ScreenRenderer available. Loading lesson from JSON...");
      this.loadLessonScreens(this.currentLessonId);
      return;
    }

    // Otherwise use static screens (fallback)
    console.log("[Navigation] Using static screens fallback");
    this.screens = staticScreens;
    this.initializeNavigation();
  },

  /**
   * Load lesson screens from JSON
   */
  loadLessonScreens: function(lessonId) {
    console.log("[Navigation] loadLessonScreens(" + lessonId + ") called");

    if (typeof Data === "undefined") {
      console.error("[Navigation] Data module not available");
      return;
    }

    var self = this;
    Data.loadLessonWithScreens(lessonId, function(error, result) {
      if (error) {
        console.error("[Navigation] Error loading lesson: " + error.message);
        return;
      }

      if (!result || !result.lesson) {
        console.error("[Navigation] Invalid result from loadLessonWithScreens");
        return;
      }

      console.log("[Navigation] Lesson loaded: " + result.lesson.title);
      self.currentLesson = result.lesson;

      var mainContent = document.getElementById("mainContent");
      if (!mainContent) {
        console.error("[Navigation] mainContent element not found");
        return;
      }

      // Clear any existing screens
      mainContent.innerHTML = "";
      console.log("[Navigation] Cleared mainContent");

      // Generate screens from lesson data
      if (typeof ScreenRenderer === "undefined") {
        console.error("[Navigation] ScreenRenderer module not available");
        return;
      }

      var screenElements = [];
      try {
        screenElements = ScreenRenderer.generateScreens(self.currentLesson);
        console.log("[Navigation] Generated " + screenElements.length + " screens");
      } catch (e) {
        console.error("[Navigation] Error generating screens: " + e.message);
        return;
      }

      if (screenElements.length === 0) {
        console.error("[Navigation] No screens were generated");
        return;
      }

      // Insert screens into DOM
      screenElements.forEach(function(screenEl, idx) {
        mainContent.appendChild(screenEl);
        console.log("[Navigation] Inserted screen " + (idx + 1) + " into DOM");
      });

      // Update screens array
      self.screens = Array.from(document.querySelectorAll(".screen"));
      console.log("[Navigation] Updated screens array. Total: " + self.screens.length);

      // Continue with initialization
      self.initializeNavigation();
    });
  },

  /**
   * Complete navigation initialization after screens are ready
   */
  initializeNavigation: function() {
    console.log("[Navigation] initializeNavigation() called");

    if (this.screens.length === 0) {
      console.error("[Navigation] No screens available");
      return;
    }

    console.log("[Navigation] Initializing with " + this.screens.length + " screens");

    // Show first screen (without animation for first load)
    this.showScreen(0, false);

    // Bind navigation buttons
    this.bindNavigation();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Update header with lesson info
    this.updateHeaderInfo();

    console.log("[Navigation] Initialization complete");

    // Hide loading screen as content is ready
    if (typeof LoadingManager !== "undefined") {
      LoadingManager.onContentReady();
    }
  },

  /**
   * Update header with lesson and total counts
   */
  updateHeaderInfo: function() {
    var currentLessonNumber = document.getElementById("currentLessonNumber");
    var totalLessonNumber = document.getElementById("totalLessonNumber");

    if (currentLessonNumber) {
      currentLessonNumber.textContent = this.currentLessonId + 1; // 1-based
    }

    if (totalLessonNumber) {
      totalLessonNumber.textContent = this.screens.length;
    }
  },

  /**
   * Bind navigation button events
   */
  bindNavigation: function() {
    var self = this;
    document.addEventListener("click", function(e) {
      var button = e.target.closest("[data-action]");

      if (!button) return;

      e.preventDefault();

      var action = button.getAttribute("data-action");

      if (action === "next") {
        self.nextScreen();
      } else if (action === "prev") {
        self.prevScreen();
      } else if (action === "check") {
        // Quiz specific
        if (Quiz && Quiz.checkAnswer) {
          var quizContainer = button.closest(".quiz-container");
          if (quizContainer) {
            Quiz.checkAnswer(quizContainer);
          }
        }
      } else if (action === "check-dragdrop") {
        // Drag-drop specific
        e.stopPropagation();
        if (typeof DragDrop !== "undefined" && DragDrop.checkAnswer) {
          console.log("[Navigation] Drag-drop check button clicked");
          DragDrop.checkAnswer();
        }
      } else if (action === "cta-button") {
        // CTA button - move to next lesson
        console.log("[Navigation] CTA button clicked - loading next lesson");
        var nextLessonId = self.currentLessonId + 1;
        self.loadLessonScreens(nextLessonId);
      }
    });
  },

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts: function() {
    var self = this;
    document.addEventListener("keydown", function(e) {
      // Arrow Right or Space to go next
      if (e.key === "ArrowRight" || (e.key === " " && e.shiftKey === false)) {
        self.nextScreen();
      }
      // Arrow Left to go prev
      else if (e.key === "ArrowLeft") {
        self.prevScreen();
      }
      // Escape to close modals
      else if (e.key === "Escape") {
        var modal = document.querySelector(".modal-overlay");
        if (modal) {
          modal.remove();
        }
      }
    });
  },

  /**
   * Show specific screen with animation
   * @param {number} index - Screen index
   * @param {boolean} animate - Enable animation
   */
  showScreen: function(index, animate) {
    if (typeof animate === 'undefined') animate = true;

    // Validate index
    if (index < 0 || index >= this.screens.length) {
      console.warn("[Navigation] Invalid screen index: " + index);
      return;
    }

    // Prevent rapid transitions
    if (this.isTransitioning) {
      console.warn("[Navigation] Transition in progress");
      return;
    }

    this.isTransitioning = true;

    // Add to history
    if (index !== this.currentScreenIndex) {
      this.screenHistory.push(this.currentScreenIndex);
    }

    var previousIndex = this.currentScreenIndex;
    this.currentScreenIndex = index;

    // Animate screens
    if (animate) {
      var previousScreen = this.screens[previousIndex];
      var currentScreen = this.screens[index];
      var self = this;

      // Fade out previous
      previousScreen.style.animation = "fadeIn var(--transition-base) reverse";

      setTimeout(function() {
        // Hide all screens
        self.screens.forEach(function(screen) {
          screen.classList.add("hidden");
        });

        // Show current screen
        currentScreen.classList.remove("hidden");

        // Trigger animation
        currentScreen.style.animation = "none";
        setTimeout(function() {
          currentScreen.style.animation = "fadeIn var(--transition-base)";
        }, 10);

        // Update UI
        self.updateUI();
        self.isTransitioning = false;
      }, 150);
    } else {
      // Instant transition (no animation)
      this.screens.forEach(function(screen) {
        screen.classList.add("hidden");
      });

      var currentScreen = this.screens[index];
      currentScreen.classList.remove("hidden");

      this.updateUI();
      this.isTransitioning = false;
    }
  },

  /**
   * Go to next screen
   */
  nextScreen: function() {
    this.showScreen(this.currentScreenIndex + 1);
  },

  /**
   * Go to previous screen
   */
  prevScreen: function() {
    this.showScreen(this.currentScreenIndex - 1);
  },

  /**
   * Update UI elements
   */
  updateUI: function() {
    // Update progress bar
    var progress = ((this.currentScreenIndex + 1) / this.screens.length) * 100;
    var progressBar = document.getElementById("globalProgress");
    if (progressBar) {
      progressBar.style.width = progress + "%";
    }

    // Update lesson number
    var currentLessonNumber = document.getElementById("currentLessonNumber");
    if (currentLessonNumber) {
      currentLessonNumber.textContent = this.currentLessonId + 1;
    }

    // Update navigation button states
    this.updateButtonStates();

    // Track in SCORM
    if (typeof SCORM !== "undefined" && SCORM.initialized) {
      SCORM.setProgress(this.currentScreenIndex, this.screens.length);
    }
  },

  /**
   * Update button enabled/disabled states
   */
  updateButtonStates: function() {
    var prevButtons = document.querySelectorAll("[data-action='prev']");
    var nextButtons = document.querySelectorAll("[data-action='next']");
    var self = this;

    prevButtons.forEach(function(btn) {
      if (self.currentScreenIndex === 0) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });

    nextButtons.forEach(function(btn) {
      if (self.currentScreenIndex === self.screens.length - 1) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });
  },

  /**
   * Finish course
   */
  finishCourse: function() {
    console.log("[Navigation] Course finished");
    if (typeof SCORM !== "undefined") {
      SCORM.setCompleted();
    }
  },

  /**
   * Get current screen data
   */
  getCurrentScreen: function() {
    return this.screens[this.currentScreenIndex] || null;
  }
};

/**
 * Initialize navigation when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("[Navigation] DOMContentLoaded event");
  Navigation.init();
});

console.log("[Navigation] Module loaded");
