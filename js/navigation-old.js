/**
 * Navigation Module
 * Handles screen navigation, progress tracking, and state management
 */

const Navigation = {
  screens: [],
  currentScreenIndex: 0,
  screenHistory: [],
  isTransitioning: false,
  currentLesson: null,
  currentLessonId: 0, // Start with introduction (lesson 0)

  /**
   * Initialize navigation (async)
   */
  init() {
    // First check for static screens
    const staticScreens = Array.from(document.querySelectorAll(".screen"));

    // If no static screens and ScreenRenderer is available, load from JSON
    if (staticScreens.length === 0 && typeof ScreenRenderer !== "undefined") {
      console.log("[Navigation] No static screens found. Loading from JSON...");
      this.loadLessonScreens(this.currentLessonId);
      return;
    }

    // Otherwise use static screens (fallback)
    this.screens = staticScreens;

    if (this.screens.length === 0) {
      console.error("No screens found in DOM or JSON");
      return;
    }

    this.initializeNavigation();
  },

  /**
   * Load lesson screens from JSON
   */
  loadLessonScreens(lessonId) {
    if (typeof Data === "undefined") {
      console.error("[Navigation] Data module not available");
      return;
    }

    Data.loadLessonWithScreens(lessonId, (error, result) => {
      if (error) {
        console.error("[Navigation] Error loading lesson: " + error.message);
        return;
      }

      this.currentLesson = result.lesson;
      const mainContent = document.getElementById("mainContent");

      // Clear any existing screens
      mainContent.innerHTML = "";

      // Generate screens from lesson data
      const screenElements = ScreenRenderer.generateScreens(this.currentLesson);

      // Insert screens into DOM
      screenElements.forEach(screenEl => {
        mainContent.appendChild(screenEl);
      });

      this.screens = screenElements;
      console.log("[Navigation] Generated " + this.screens.length + " screens from lesson");

      // Continue with initialization
      this.initializeNavigation();
    });
  },

  /**
   * Complete navigation initialization after screens are ready
   */
  initializeNavigation() {
    if (this.screens.length === 0) {
      console.error("[Navigation] No screens available");
      return;
    }

    // Show first screen
    this.showScreen(0);

    // Bind navigation buttons
    this.bindNavigation();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Update header with lesson info
    this.updateHeaderInfo();

    console.log("[Navigation] Initialized with " + this.screens.length + " screens");
  },

  /**
   * Update header with lesson and total counts
   */
  updateHeaderInfo() {
    const currentLessonNumber = document.getElementById("currentLessonNumber");
    const totalLessonNumber = document.getElementById("totalLessonNumber");

    if (currentLessonNumber) {
      currentLessonNumber.textContent = this.currentLessonId + 1; // 1-based
    }

    if (totalLessonNumber && this.currentLesson) {
      totalLessonNumber.textContent = this.screens.length;
    }
  },

  /**
   * Bind navigation button events
   */
  bindNavigation() {
    document.addEventListener("click", (e) => {
      const button = e.target.closest("[data-action]");

      if (!button) return;

      e.preventDefault();

      const action = button.getAttribute("data-action");

      if (action === "next") {
        this.nextScreen();
      } else if (action === "prev") {
        this.prevScreen();
      } else if (action === "check") {
        // Quiz specific
        if (Quiz && Quiz.checkAnswer) {
          const quizContainer = button.closest(".quiz-container");
          if (quizContainer) {
            Quiz.checkAnswer(quizContainer);
          }
        }
      }
    });
  },

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Arrow Right or Space to go next
      if (e.key === "ArrowRight" || (e.key === " " && e.shiftKey === false)) {
        this.nextScreen();
      }
      // Arrow Left to go prev
      else if (e.key === "ArrowLeft") {
        this.prevScreen();
      }
      // Escape to close modals
      else if (e.key === "Escape") {
        const modal = document.querySelector(".modal-overlay");
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
  showScreen(index, animate = true) {
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

    const previousIndex = this.currentScreenIndex;
    this.currentScreenIndex = index;

    // Animate screens
    if (animate) {
      const previousScreen = this.screens[previousIndex];
      const currentScreen = this.screens[index];

      // Fade out previous
      previousScreen.style.animation = "fadeIn var(--transition-base) reverse";

      setTimeout(() => {
        // Hide all screens
        this.screens.forEach((screen) => {
          screen.classList.add("hidden");
        });

        // Show current screen
        currentScreen.classList.remove("hidden");

        // Trigger animation
        currentScreen.style.animation = "none";
        setTimeout(() => {
          currentScreen.style.animation = "fadeIn var(--transition-base)";
        }, 10);

        // Update UI
        this.updateUI();
        this.isTransitioning = false;
      }, 150);
    } else {
      // Instant transition (no animation)
      this.screens.forEach((screen) => {
        screen.classList.add("hidden");
      });

      const currentScreen = this.screens[index];
      currentScreen.classList.remove("hidden");

      this.updateUI();
      this.isTransitioning = false;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    console.log("[Navigation] Screen " + (index + 1) + " of " + this.screens.length);
  },

  /**
   * Update all UI elements (progress, navigation, etc)
   */
  updateUI() {
    this.updateNavigation();
    this.updateProgress();
    this.saveProgress();
  },

  /**
   * Show next screen
   */
  nextScreen() {
    if (this.currentScreenIndex < this.screens.length - 1) {
      this.showScreen(this.currentScreenIndex + 1);
    } else {
      // Last screen - finish course
      console.log("[Navigation] Course completed!");
      this.finishCourse();
    }
  },

  /**
   * Show previous screen
   */
  prevScreen() {
    if (this.currentScreenIndex > 0) {
      this.showScreen(this.currentScreenIndex - 1);
    }
  },

  /**
   * Jump to specific screen
   * @param {number} index - Screen index
   */
  jumpToScreen(index) {
    if (index >= 0 && index < this.screens.length) {
      this.showScreen(index);
    }
  },

  /**
   * Update navigation buttons state
   */
  updateNavigation() {
    const currentScreen = this.screens[this.currentScreenIndex];
    const buttons = currentScreen.querySelectorAll("[data-action]");

    buttons.forEach((btn) => {
      const action = btn.getAttribute("data-action");

      if (action === "prev") {
        // Disable on first screen
        btn.disabled = this.currentScreenIndex === 0;
        btn.style.opacity = this.currentScreenIndex === 0 ? "0.5" : "1";
      } else if (action === "next") {
        // Check if next button should be disabled
        const screenType = currentScreen.getAttribute("data-type");

        if (screenType === "quiz") {
          // Keep disabled until quiz is answered
          const hasFeedback = currentScreen.querySelector(".feedback-container.show");
          btn.disabled = !hasFeedback;
          btn.style.opacity = !hasFeedback ? "0.5" : "1";
        } else if (screenType === "scene") {
          // Scene screens are always enabled
          btn.disabled = false;
          btn.style.opacity = "1";
        } else {
          // Other screens
          btn.disabled = false;
          btn.style.opacity = "1";
        }
      }
    });
  },

  /**
   * Update progress bar and counter with animation
   */
  updateProgress() {
    const percentage = ((this.currentScreenIndex + 1) / this.screens.length) * 100;
    const progressBar = document.getElementById("globalProgress");

    if (progressBar) {
      // Animate progress bar
      progressBar.style.transition = "width 0.6s ease";
      progressBar.style.width = percentage + "%";
    }

    // Update lesson counter
    const currentScreen = this.screens[this.currentScreenIndex];
    const lesson = currentScreen.getAttribute("data-lesson") || "1";
    const screen = currentScreen.getAttribute("data-screen") || "0";

    const lessonNumberEl = document.getElementById("currentLessonNumber");
    if (lessonNumberEl) {
      lessonNumberEl.textContent = lesson;
    }

    // Update lesson title if available
    const lessonTitleEl = document.querySelector(".header-title");
    if (lessonTitleEl) {
      lessonTitleEl.textContent = "Урок " + lesson + " (Экран " + (parseInt(screen) + 1) + ")";
    }
  },

  /**
   * Get current screen data
   * @returns {object} Current screen info
   */
  getCurrentScreenInfo() {
    const currentScreen = this.screens[this.currentScreenIndex];
    return {
      index: this.currentScreenIndex,
      type: currentScreen.getAttribute("data-type"),
      lesson: currentScreen.getAttribute("data-lesson"),
      screen: currentScreen.getAttribute("data-screen"),
      element: currentScreen,
    };
  },

  /**
   * Save progress to SCORM and localStorage
   */
  saveProgress() {
    const screenInfo = this.getCurrentScreenInfo();

    // Save to SCORM if available
    if (SCORM && SCORM.initialized) {
      SCORM.setProgress(this.currentScreenIndex, this.screens.length);

      // Track screen views
      SCORM.addInteraction(
        "screen-view-" + this.currentScreenIndex,
        "other",
        screenInfo.type,
        true
      );
    }

    // Save to localStorage as backup
    localStorage.setItem(
      "courseProgress",
      JSON.stringify({
        currentScreenIndex: this.currentScreenIndex,
        totalScreens: this.screens.length,
        lesson: screenInfo.lesson,
        timestamp: Date.now(),
      })
    );

    console.log("[Navigation] Progress saved: Screen " + this.currentScreenIndex + "/" + this.screens.length);
  },

  /**
   * Restore progress from SCORM or localStorage
   */
  restoreProgress() {
    let screenIndex = 0;

    // Try SCORM first
    if (SCORM && SCORM.initialized) {
      const savedLocation = SCORM.getValue("cmi.core.lesson_location");
      if (savedLocation) {
        screenIndex = parseInt(savedLocation);
      }
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem("courseProgress");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          screenIndex = data.currentScreenIndex || 0;
        } catch (e) {
          console.error("[Navigation] Error restoring progress: " + e.message);
        }
      }
    }

    // Show restored screen
    if (screenIndex >= 0 && screenIndex < this.screens.length) {
      this.showScreen(screenIndex, false);
      console.log("[Navigation] Progress restored: Screen " + screenIndex);
    }
  },

  /**
   * Get progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgress() {
    return Math.round(((this.currentScreenIndex + 1) / this.screens.length) * 100);
  },

  /**
   * Finish course
   */
  finishCourse() {
    console.log("[Navigation] Finishing course...");

    // Mark as completed in SCORM
    if (SCORM && SCORM.initialized) {
      SCORM.setCompleted();
      SCORM.commit();
    }

    // Show completion message
    this.showCompletionMessage();
  },

  /**
   * Show completion message
   */
  showCompletionMessage() {
    const progress = this.getProgress();
    const message = document.createElement("div");
    message.className = "modal-overlay";
    message.style.zIndex = "2000";
    message.innerHTML = `
      <div class="modal-content" style="text-align: center;">
        <h2 style="color: var(--success); margin-bottom: var(--space-lg);">
          🎉 Поздравляем!
        </h2>
        <p style="font-size: var(--body-medium-size); margin-bottom: var(--space-lg);">
          Вы успешно завершили курс!
        </p>
        <p style="color: var(--neutral-700); margin-bottom: var(--space-lg);">
          Прогресс: <strong>${progress}%</strong>
        </p>
        <p style="color: var(--neutral-700); font-size: var(--body-small-size);">
          Ваш результат сохранен в системе обучения.
        </p>
        <button class="btn btn-primary" onclick="location.reload()">
          <i class="fas fa-redo"></i> Пройти заново
        </button>
      </div>
    `;

    document.body.appendChild(message);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (message.parentElement) {
        message.remove();
      }
    }, 5000);
  },
};

/**
 * Initialize navigation when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  Navigation.init();
  Navigation.restoreProgress();

  console.log("[App] Navigation module loaded successfully");
});
