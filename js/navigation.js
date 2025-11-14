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
      self.currentLessonId = lessonId;

      var mainContent = document.getElementById("mainContent");
      if (!mainContent) {
        console.error("[Navigation] mainContent element not found");
        return;
      }

      // Clear any existing screens
      mainContent.innerHTML = "";
      console.log("[Navigation] Cleared mainContent");

      // Check if this is a game-type lesson
      if (self.currentLesson.type === "game") {
        console.log("[Navigation] Game-type lesson detected. Using GameLesson2D module.");
        if (typeof GameLesson2D === "undefined") {
          console.error("[Navigation] GameLesson2D module not available");
          return;
        }
        // Render game content directly
        GameLesson2D.render(self.currentLesson, mainContent);
        // Create a single screen wrapper for game content
        self.screens = [mainContent];
        self.initializeNavigation();
        return;
      }

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

    // Bind carousel events
    this.bindCarouselEvents();

    // Bind accordion events
    this.bindAccordionEvents();
  },

  /**
   * Bind carousel interaction events
   */
  bindCarouselEvents: function() {
    // Handle card flip and modal opening
    document.addEventListener("click", function(e) {
      var carouselCard = e.target.closest(".carousel-card");
      if (!carouselCard) return;

      e.stopPropagation();
      e.preventDefault();

      // Get the carousel track and card inner
      var cardInner = carouselCard.querySelector(".card-inner");
      if (!cardInner) return;

      // Get character data from the card
      var charId = carouselCard.getAttribute("data-char-id");
      var charName = carouselCard.querySelector("h4");
      var charNameText = charName ? charName.textContent : "Unknown";

      // Toggle flip animation
      var currentTransform = cardInner.style.transform || "";
      var isFlipped = currentTransform.includes("rotateY(180deg)");

      if (isFlipped) {
        cardInner.style.transform = "";
      } else {
        cardInner.style.transform = "rotateY(180deg)";

        // Open modal with character details after flip animation
        setTimeout(function() {
          if (typeof Modals !== "undefined" && Modals.showCharacterModal && charId) {
            console.log("[Navigation] Opening character modal for: " + charId);
            Modals.showCharacterModal(charId);
          }
        }, 600);
      }

      // Update progress counter if not yet flipped
      if (!isFlipped) {
        var progressCounter = document.getElementById("carousel-progress");
        if (progressCounter) {
          var text = progressCounter.textContent;
          var parts = text.split("/");
          var current = parseInt(parts[0]) || 0;
          var total = parseInt(parts[1]) || 5;

          if (current < total) {
            current++;
            progressCounter.textContent = current + "/" + total;

            // Mark this card as studied
            carouselCard.setAttribute("data-studied", "true");

            // If all cards are studied, show reward
            if (current === total) {
              console.log("[Navigation] All carousel cards studied!");
            }
          }
        }
      }
    });

    // Handle carousel scroll buttons
    document.addEventListener("click", function(e) {
      var scrollBtn = e.target.closest(".carousel-prev, .carousel-next");
      if (!scrollBtn) return;

      e.stopPropagation();
      e.preventDefault();

      var container = scrollBtn.closest(".carousel-container");
      if (!container) return;

      var track = container.querySelector(".carousel-track");
      if (!track) return;

      console.log("[Navigation] Carousel scroll - scrollLeft:", track.scrollLeft, "scrollWidth:", track.scrollWidth, "clientWidth:", track.clientWidth);

      var scrollAmount = 220;
      if (scrollBtn.classList.contains("carousel-prev")) {
        track.scrollLeft -= scrollAmount;
        console.log("[Navigation] Scrolling left, new scrollLeft:", track.scrollLeft);
      } else {
        track.scrollLeft += scrollAmount;
        console.log("[Navigation] Scrolling right, new scrollLeft:", track.scrollLeft);
      }
    });
  },

  /**
   * Bind accordion interaction events
   */
  bindAccordionEvents: function() {
    var self = this;
    document.addEventListener("click", function(e) {
      var header = e.target.closest(".accordion-header");
      if (!header) return;

      e.stopPropagation();
      e.preventDefault();

      var section = header.closest(".accordion-section");
      var sectionId = parseInt(section.getAttribute("data-section-id")) || 0;

      // Get accordion data from the card
      var card = section.closest(".card");
      if (!card || !card.__accordionData) {
        console.warn("[Navigation] No accordion data found");
        return;
      }

      // Find the section data
      var sectionData = null;
      for (var i = 0; i < card.__accordionData.sections.length; i++) {
        if (card.__accordionData.sections[i].id === sectionId) {
          sectionData = card.__accordionData.sections[i];
          break;
        }
      }

      if (!sectionData) {
        console.warn("[Navigation] Section data not found for id: " + sectionId);
        return;
      }

      // Show modal with section content
      self.showAccordionModal(sectionData);

      // Update progress counter (only first time)
      if (!section.getAttribute("data-was-opened")) {
        section.setAttribute("data-was-opened", "true");

        var progressCounter = document.getElementById("accordion-progress");
        if (progressCounter) {
          var text = progressCounter.textContent;
          var parts = text.split("/");
          var current = parseInt(parts[0]) || 0;
          var total = parseInt(parts[1]) || 5;

          if (current < total) {
            current++;
            progressCounter.textContent = current + "/" + total;
            console.log("[Navigation] Accordion progress: " + current + "/" + total);

            // If all sections are studied, show achievement
            if (current === total) {
              console.log("[Navigation] All accordion sections studied!");
            }
          }
        }
      }
    });
  },

  /**
   * Show accordion section modal
   */
  showAccordionModal: function(sectionData) {
    // Create modal overlay
    var modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.zIndex = "10000";
    modal.style.cursor = "auto";

    // Create content container
    var content = document.createElement("div");
    content.className = "modal-content";
    content.style.maxWidth = "600px";

    // Create close button
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = "position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border: none; background: none; font-size: 24px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10001;";

    // Create title
    var titleEl = document.createElement("h2");
    titleEl.innerHTML = (sectionData.emoji ? sectionData.emoji + ' ' : '') + sectionData.title;
    titleEl.style.cssText = "color: var(--brand-primary); margin-bottom: 24px; margin-top: 20px;";

    // Create items list
    var itemsList = document.createElement("ul");
    itemsList.style.cssText = "margin: 0 0 16px 0; padding-left: 24px;";

    if (sectionData.items && sectionData.items.length > 0) {
      for (var i = 0; i < sectionData.items.length; i++) {
        var li = document.createElement("li");
        li.style.cssText = "margin-bottom: 8px; color: var(--neutral-700); font-size: 14px; line-height: 1.6;";
        li.innerHTML = sectionData.items[i];
        itemsList.appendChild(li);
      }
    }

    // Create tip box if available
    var tipBox = null;
    if (sectionData.tip) {
      tipBox = document.createElement("div");
      tipBox.style.cssText = "background: rgba(123, 104, 238, 0.05); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand-secondary);";

      var tipText = document.createElement("p");
      tipText.style.cssText = "margin: 0; color: var(--neutral-800); font-size: 14px; line-height: 1.6;";
      tipText.innerHTML = "💡 <strong>Совет:</strong> " + sectionData.tip;
      tipBox.appendChild(tipText);
    }

    // Create close button (text)
    var closeTextBtn = document.createElement("button");
    closeTextBtn.type = "button";
    closeTextBtn.className = "btn btn-primary";
    closeTextBtn.innerHTML = "Закрыть";
    closeTextBtn.style.cssText = "width: 100%; padding: 12px 20px; border: none; border-radius: 6px; background: #163F6F; color: white; font-weight: 600; cursor: pointer; font-size: 16px; transition: background 0.3s; margin-top: 24px;";

    // Assemble content
    content.appendChild(closeBtn);
    content.appendChild(titleEl);
    content.appendChild(itemsList);
    if (tipBox) {
      content.appendChild(tipBox);
    }
    content.appendChild(closeTextBtn);

    // Assemble modal
    modal.appendChild(content);
    document.body.appendChild(modal);

    console.log("[Navigation] Accordion modal shown for section: " + sectionData.title);

    // Close handler
    var closeHandler = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";

      setTimeout(function() {
        try {
          if (modal && modal.parentElement) {
            modal.parentElement.removeChild(modal);
            console.log("[Navigation] Accordion modal closed");
          }
        } catch (err) {
          console.log("[Navigation] Error removing modal: " + err.message);
        }
      }, 200);
    };

    // Attach listeners
    closeBtn.onclick = closeHandler;
    closeTextBtn.onclick = closeHandler;

    // Also close on overlay click
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeHandler();
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

    // Safety: Reset transition flag after 2 seconds if something goes wrong
    var self = this;
    setTimeout(function() {
      if (self.isTransitioning) {
        console.warn("[Navigation] Force resetting isTransitioning flag after timeout");
        self.isTransitioning = false;
      }
    }, 2000);

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

        // Re-initialize interactive modules on screen change
        setTimeout(function() {
          if (typeof DragDrop !== 'undefined') {
            console.log("[Navigation] Re-initializing DragDrop module");
            DragDrop.init();
          }
          if (typeof InteractiveChoice !== 'undefined') {
            console.log("[Navigation] Re-initializing InteractiveChoice module");
            InteractiveChoice.init();
          }
        }, 300);

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

      // Re-initialize interactive modules on screen change
      var self = this;
      setTimeout(function() {
        if (typeof DragDrop !== 'undefined') {
          console.log("[Navigation] Re-initializing DragDrop module");
          DragDrop.init();
        }
        if (typeof InteractiveChoice !== 'undefined') {
          console.log("[Navigation] Re-initializing InteractiveChoice module");
          InteractiveChoice.init();
        }
      }, 300);

      this.isTransitioning = false;
    }
  },

  /**
   * Reset transition flag (safety reset)
   */
  resetTransitionFlag: function() {
    console.log("[Navigation] Forcefully resetting transition flag");
    this.isTransitioning = false;
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
    // Scroll to top of page on screen change
    window.scrollTo(0, 0);

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

console.log("[Navigation] Module loaded");
