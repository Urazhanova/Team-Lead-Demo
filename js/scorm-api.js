/**
 * SCORM 1.2 API Wrapper
 * Handles communication with LMS with comprehensive tracking
 */

const SCORM = {
  // API state
  initialized: false,
  api: null,
  debug: true,

  // Session tracking
  session: {
    startTime: null,
    sessionStart: null,
    interactionCount: 0,
    suspendData: {},
  },

  /**
   * Initialize SCORM API
   * @returns {boolean} Success status
   */
  init() {
    this.api = this.findAPI();
    this.session.startTime = Date.now();
    this.session.sessionStart = new Date().toISOString();

    if (this.api) {
      try {
        const result = this.api.LMSInitialize("");
        if (result === "true") {
          this.initialized = true;
          this.log("[SCORM] API initialized successfully");

          // Set lesson status to incomplete
          this.setInProgress();

          // Load suspend data if available
          this.loadSuspendData();

          return true;
        }
      } catch (e) {
        this.log("[SCORM] Error initializing: " + e.message);
      }
    } else {
      this.log("[SCORM] API not found - running in development mode");
    }

    return false;
  },

  /**
   * Find SCORM API in parent windows
   * @returns {object|null} API object or null
   */
  findAPI() {
    let API = null;
    let win = window;

    try {
      // Look in parent frames
      while (!API && win.parent && win.parent !== win) {
        if (win.parent.API) {
          API = win.parent.API;
          break;
        }
        if (win.parent.API_1484_11) {
          API = win.parent.API_1484_11;
          break;
        }
        win = win.parent;
      }

      // Check top frame
      if (!API && window.top.API) {
        API = window.top.API;
      }

      // Check current window
      if (!API && window.API) {
        API = window.API;
      }
    } catch (e) {
      this.log("Error finding API: " + e.message);
    }

    return API;
  },

  /**
   * Get SCORM value
   * @param {string} key - SCORM data model element
   * @returns {string} Value
   */
  getValue(key) {
    if (!this.api) {
      return localStorage.getItem("scorm_" + key) || "";
    }

    try {
      const value = this.api.LMSGetValue(key);
      this.log("[SCORM] Get: " + key + " = " + value);
      return value;
    } catch (e) {
      this.log("[SCORM] Error getting value: " + e.message);
      return "";
    }
  },

  /**
   * Set SCORM value
   * @param {string} key - SCORM data model element
   * @param {string} value - Value to set
   * @returns {boolean} Success
   */
  setValue(key, value) {
    const valueStr = value.toString();

    // Backup to localStorage if API not available
    if (!this.api) {
      try {
        localStorage.setItem("scorm_" + key, valueStr);
      } catch (e) {
        console.warn("[SCORM] Error saving to localStorage: " + e.message);
      }
      return true;
    }

    try {
      const result = this.api.LMSSetValue(key, valueStr);
      if (result === "true") {
        this.log("[SCORM] Set: " + key + " = " + valueStr);
        return true;
      } else {
        this.log("[SCORM] Error setting value: " + key);
        return false;
      }
    } catch (e) {
      this.log("[SCORM] Error setting value: " + e.message);
      return false;
    }
  },

  /**
   * Commit data to LMS
   * @returns {boolean} Success
   */
  commit() {
    if (!this.api) {
      this.log("[SCORM] Running without API - data not committed");
      return false;
    }

    try {
      const result = this.api.LMSCommit("");
      if (result === "true") {
        this.log("[SCORM] Data committed successfully");
        return true;
      } else {
        this.log("[SCORM] Error committing data");
        return false;
      }
    } catch (e) {
      this.log("[SCORM] Error committing: " + e.message);
      return false;
    }
  },

  /**
   * Set lesson status to completed
   */
  setCompleted() {
    this.setValue("cmi.core.lesson_status", "completed");
    this.setValue("cmi.core.exit", "logout");
    this.commit();
    this.log("[SCORM] Lesson marked as completed");
  },

  /**
   * Set lesson status to in progress
   */
  setInProgress() {
    this.setValue("cmi.core.lesson_status", "incomplete");
    this.setValue("cmi.core.exit", "");
    this.commit();
  },

  /**
   * Save suspend data (for progress/state restoration)
   * @param {object} data - Data to suspend
   */
  saveSuspendData(data) {
    try {
      const suspendStr = JSON.stringify(data);
      this.setValue("cmi.suspend_data", suspendStr);
      this.session.suspendData = data;
      this.commit();
      this.log("[SCORM] Suspend data saved");
    } catch (e) {
      this.log("[SCORM] Error saving suspend data: " + e.message);
    }
  },

  /**
   * Load suspend data (for progress restoration)
   * @returns {object} Suspended data or empty object
   */
  loadSuspendData() {
    try {
      const suspendStr = this.getValue("cmi.suspend_data");
      if (suspendStr) {
        this.session.suspendData = JSON.parse(suspendStr);
        this.log("[SCORM] Suspend data loaded");
        return this.session.suspendData;
      }
    } catch (e) {
      this.log("[SCORM] Error loading suspend data: " + e.message);
    }
    return {};
  },

  /**
   * Set progress score
   * @param {number} current - Current screen/progress (1-based)
   * @param {number} total - Total screens
   */
  setProgress(current, total) {
    const percentage = Math.round(((current + 1) / total) * 100);

    this.setValue("cmi.core.lesson_location", current.toString());
    this.setValue("cmi.core.score.raw", percentage.toString());
    this.setValue("cmi.core.score.max", "100");
    this.setValue("cmi.core.score.min", "0");

    // Calculate session time
    const sessionTime = this.getSessionTime();
    this.setValue("cmi.core.session_time", sessionTime);

    this.commit();

    this.log("[SCORM] Progress updated: " + percentage + "% (" + (current + 1) + "/" + total + ")");
  },

  /**
   * Add interaction with enhanced tracking
   * @param {string} id - Interaction ID
   * @param {string} type - Interaction type
   * @param {string} response - User response
   * @param {boolean} correct - Is correct
   * @param {string} description - Optional description
   */
  addInteraction(id, type, response, correct, description) {
    const interactionData = {
      id: id,
      type: type,
      response: response,
      correct: correct,
      timestamp: new Date().toISOString(),
      description: description || "",
    };

    if (!this.api) {
      this.log("[SCORM] Interaction recorded (no API): " + id);
      return;
    }

    try {
      const interactionIndex = this.getValue("cmi.interactions._count");
      const index = parseInt(interactionIndex) || 0;

      this.setValue("cmi.interactions." + index + ".id", id);
      this.setValue("cmi.interactions." + index + ".type", type);
      this.setValue("cmi.interactions." + index + ".student_response", response);
      this.setValue("cmi.interactions." + index + ".result", correct ? "correct" : "wrong");
      this.setValue("cmi.interactions." + index + ".time_stamp", new Date().toISOString());

      this.session.interactionCount++;
      this.commit();

      this.log("[SCORM] Interaction added: " + id + " (" + (correct ? "correct" : "wrong") + ")");
    } catch (e) {
      this.log("[SCORM] Error adding interaction: " + e.message);
    }
  },

  /**
   * Get session time in SCORM format (HH:MM:SS)
   * @returns {string} Session time
   */
  getSessionTime() {
    const elapsed = Date.now() - this.session.startTime;
    const seconds = Math.floor(elapsed / 1000);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num) => (num < 10 ? "0" + num : num);

    return pad(hours) + ":" + pad(minutes) + ":" + pad(secs);
  },

  /**
   * Get session duration in milliseconds
   * @returns {number} Duration in ms
   */
  getSessionDuration() {
    return Date.now() - this.session.startTime;
  },

  /**
   * Get comprehensive session information
   * @returns {object} Session data
   */
  getSessionInfo() {
    return {
      startTime: this.session.sessionStart,
      duration: this.getSessionDuration(),
      interactionCount: this.session.interactionCount,
      initialized: this.initialized,
      hasAPI: this.api !== null,
    };
  },

  /**
   * Finish lesson and close session
   */
  finish() {
    const sessionInfo = this.getSessionInfo();
    this.log("[SCORM] Session info: " + JSON.stringify(sessionInfo));

    if (!this.api) {
      this.log("[SCORM] Lesson finished (no API)");
      return;
    }

    try {
      this.api.LMSFinish("");
      this.log("[SCORM] Lesson finished successfully");
    } catch (e) {
      this.log("[SCORM] Error finishing: " + e.message);
    }
  },

  /**
   * Get comprehensive course data
   * @returns {object} All tracked data
   */
  getCourseData() {
    return {
      status: this.initialized ? "initialized" : "not_initialized",
      lessonStatus: this.getValue("cmi.core.lesson_status"),
      score: this.getValue("cmi.core.score.raw"),
      location: this.getValue("cmi.core.lesson_location"),
      sessionTime: this.getSessionTime(),
      sessionInfo: this.getSessionInfo(),
      suspendData: this.session.suspendData,
    };
  },

  /**
   * Log message (for debugging)
   * @param {string} message
   */
  log(message) {
    if (this.debug) {
      console.log(message);
    }
  }
};

/**
 * Initialize SCORM on page load
 */
window.addEventListener("load", function() {
  SCORM.init();
});

/**
 * Finish SCORM on page unload
 */
window.addEventListener("beforeunload", function() {
  SCORM.finish();
});

/**
 * Handle visibility change
 */
document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    SCORM.commit();
  }
});
