/**
 * Main Application Module
 * Initializes all components
 */

var App = {
  /**
   * Initialize application
   */
  init: function() {
    console.log("=== Team Lead Academy Application Starting ===");

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      var self = this;
      document.addEventListener("DOMContentLoaded", function() {
        self.start();
      });
    } else {
      this.start();
    }
  },

  /**
   * Start the application
   */
  start: function() {
    try {
      console.log("App.start() called");

      // Initialize SCORM
      console.log("Initializing SCORM...");
      SCORM.init();

      // Wait a moment to ensure all modules are loaded
      var self = this;
      setTimeout(function() {
        self.initializeModules();
      }, 100);
    } catch (error) {
      console.error("Error initializing application: " + error.message);
      this.showErrorMessage(error.message);
    }
  },

  /**
   * Initialize modules (after a brief delay to ensure all scripts are loaded)
   */
  initializeModules: function() {
    try {
      // Check required modules
      var requiredModules = {
        'Data': typeof Data !== 'undefined',
        'ScreenRenderer': typeof ScreenRenderer !== 'undefined',
        'Navigation': typeof Navigation !== 'undefined',
        'Quiz': typeof Quiz !== 'undefined',
        'Modals': typeof Modals !== 'undefined',
      };

      console.log("Module availability: Data=" + requiredModules.Data +
                  ", ScreenRenderer=" + requiredModules.ScreenRenderer +
                  ", Navigation=" + requiredModules.Navigation);

      // Check for any missing critical modules
      if (!requiredModules['Data']) {
        throw new Error("Data module not loaded");
      }
      if (!requiredModules['Navigation']) {
        throw new Error("Navigation module not loaded");
      }

      // Initialize Navigation (handles both static and dynamic screens)
      console.log("Initializing Navigation...");
      Navigation.init();

      // Initialize Quiz
      if (requiredModules['Quiz']) {
        console.log("Initializing Quiz...");
        Quiz.init();
      }

      // Initialize Modals
      if (requiredModules['Modals']) {
        console.log("Initializing Modals...");
        Modals.init();
      }

      // Load course info
      this.loadCourseInfo();

      // Setup exit handler
      this.setupExitHandler();

      console.log("=== Application Started Successfully ===");
    } catch (error) {
      console.error("Error during module initialization: " + error.message);
      this.showErrorMessage(error.message);
    }
  },

  /**
   * Load and display course information
   */
  loadCourseInfo: function() {
    var self = this;
    Data.getCourseInfo(function(error, courseInfo) {
      if (error) {
        console.warn("Could not load course info: " + error.message);
        return;
      }

      if (courseInfo) {
        console.log("Course: " + courseInfo.title);
        console.log("Total lessons: " + courseInfo.totalLessons);

        // Update total lessons in header
        var totalElement = document.getElementById("totalLessonNumber");
        if (totalElement) {
          totalElement.textContent = courseInfo.totalLessons;
        }
      }
    });
  },

  /**
   * Setup exit handler
   */
  setupExitHandler: function() {
    var self = this;
    window.addEventListener("beforeunload", function(e) {
      // Save progress
      if (SCORM.initialized) {
        SCORM.commit();
      }
    });

    // Handle visibility change
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {
        console.log("Page hidden - saving progress");
        if (SCORM.initialized) {
          SCORM.commit();
        }
      }
    });
  },

  /**
   * Show error message to user
   * @param {string} message - Error message
   */
  showErrorMessage: function(message) {
    var errorDiv = document.createElement("div");
    errorDiv.style.cssText = "background: #f44336; color: white; padding: 20px; margin: 20px; border-radius: 8px; font-size: 16px; z-index: 2000; position: fixed; top: 100px; left: 20px; right: 20px; max-width: 500px;";
    errorDiv.innerHTML = "<strong>⚠️ Ошибка:</strong> " + message +
      '<button onclick="this.parentElement.remove()" style="float: right; background: rgba(255,255,255,0.3); border: none; color: white; cursor: pointer; padding: 5px 10px; border-radius: 4px;">Закрыть</button>';
    document.body.appendChild(errorDiv);
  },

  /**
   * Get current progress
   * @returns {object} Progress data
   */
  getProgress: function() {
    return {
      currentScreen: Navigation.currentScreenIndex,
      totalScreens: Navigation.screens.length,
      progress: ((Navigation.currentScreenIndex + 1) / Navigation.screens.length) * 100,
      timestamp: Date.now(),
    };
  },

  /**
   * Finish course
   */
  finishCourse: function() {
    console.log("Finishing course...");
    Navigation.finishCourse();
    this.showCompletionMessage();
  },

  /**
   * Show completion message
   */
  showCompletionMessage: function() {
    var message = document.createElement("div");
    message.className = "modal-overlay";
    message.innerHTML = '<div class="modal-content" style="text-align: center;">' +
      '<h2 style="color: var(--success); margin-bottom: var(--space-lg);">🎉 Поздравляем!</h2>' +
      '<p style="font-size: var(--body-medium-size); margin-bottom: var(--space-lg);">Вы успешно завершили урок!</p>' +
      '<p style="color: var(--neutral-700);">Ваш прогресс сохранен в системе обучения.</p>' +
      '</div>';

    document.body.appendChild(message);

    // Remove after 3 seconds
    setTimeout(function() {
      message.remove();
    }, 3000);
  },

  /**
   * Check if course is complete
   * @returns {boolean}
   */
  isComplete: function() {
    return Navigation.currentScreenIndex === Navigation.screens.length - 1;
  },
};

/**
 * Start the application
 */
App.init();

/**
 * Global functions for easy access
 */

window.goToScreen = function(screenIndex) {
  if (Navigation && Navigation.showScreen) {
    Navigation.showScreen(screenIndex);
  }
};

window.getCurrentProgress = function() {
  return App.getProgress();
};

window.finishCourse = function() {
  App.finishCourse();
};
