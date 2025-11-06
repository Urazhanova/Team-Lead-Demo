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

      // Initialize modules immediately (removed unnecessary setTimeout delay)
      this.initializeModules();
    } catch (error) {
      console.error("Error initializing application: " + error.message);
      this.showErrorMessage(error.message);
    }
  },

  /**
   * Initialize modules
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
   * Load course info from data and display header
   */
  loadCourseInfo: function() {
    console.log("Loading course info...");
    var courseData = Data.getCourseData();
    if (courseData && courseData.course) {
      var totalLessons = courseData.course.totalLessons || 12;
      document.getElementById('totalLessonNumber').textContent = totalLessons;
      console.log("Course info loaded: " + totalLessons + " lessons");
    }
  },

  /**
   * Show error message to user
   */
  showErrorMessage: function(message) {
    var container = document.getElementById('mainContent');
    if (container) {
      container.innerHTML = '<div style="padding: 40px; text-align: center; color: red;">' +
                            '<h2>Ошибка загрузки</h2>' +
                            '<p>' + message + '</p>' +
                            '</div>';
    }
  },

  /**
   * Setup exit handler for SCORM
   */
  setupExitHandler: function() {
    window.addEventListener('beforeunload', function() {
      console.log("Saving SCORM data before exit...");
      SCORM.finish();
    });
  }
};

// Start application immediately
App.init();
