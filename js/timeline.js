/**
 * Timeline Module
 * Handles interactive timeline navigation and state management
 */

const Timeline = {
  // Timeline data storage
  timelineData: {
    currentPoint: 0,
    completedPoints: [],
    totalPoints: 0,
    pointDescriptions: {},
    lastVisited: Date.now(),
  },

  /**
   * Initialize timeline handlers
   */
  init() {
    this.bindTimelineButtons();
    this.loadTimelineState();
    console.log("[Timeline] Module initialized");
  },

  /**
   * Load timeline state from localStorage
   */
  loadTimelineState() {
    const saved = localStorage.getItem("timelineState");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.timelineData = { ...this.timelineData, ...data };
        console.log("[Timeline] State loaded from localStorage");
      } catch (e) {
        console.warn("[Timeline] Error loading state: " + e.message);
      }
    }

    // Count timeline points on page
    this.countTimelinePoints();
  },

  /**
   * Count total timeline points
   */
  countTimelinePoints() {
    const timelineContainers = document.querySelectorAll(".timeline-container");
    timelineContainers.forEach((container) => {
      const buttons = container.querySelectorAll("button[data-point]");
      this.timelineData.totalPoints = buttons.length;
      console.log("[Timeline] Found " + buttons.length + " timeline points");
    });
  },

  /**
   * Bind timeline button events
   */
  bindTimelineButtons() {
    document.addEventListener("click", (e) => {
      const timelineButton = e.target.closest(".timeline-button, [data-point]");

      if (timelineButton && !timelineButton.closest("[data-action]")) {
        e.preventDefault();

        const pointIndex = parseInt(
          timelineButton.getAttribute("data-point") || timelineButton.textContent || "0"
        );

        this.navigateToPoint(pointIndex - 1); // Convert to 0-based index
      }
    });
  },

  /**
   * Navigate to specific timeline point
   * @param {number} pointIndex - 0-based index of the timeline point
   */
  navigateToPoint(pointIndex) {
    if (pointIndex < 0 || pointIndex >= this.timelineData.totalPoints) {
      console.warn("[Timeline] Invalid point index: " + pointIndex);
      return;
    }

    const previousPoint = this.timelineData.currentPoint;
    this.timelineData.currentPoint = pointIndex;

    // Mark previous point as completed
    if (!this.timelineData.completedPoints.includes(previousPoint)) {
      this.timelineData.completedPoints.push(previousPoint);
    }

    // Update UI
    this.updateTimelineUI();

    // Save state
    this.saveTimelineState();

    // Log interaction
    if (SCORM && SCORM.initialized) {
      SCORM.addInteraction(
        "timeline-point-" + (pointIndex + 1),
        "other",
        "visited",
        true
      );
    }

    console.log(
      "[Timeline] Navigated to point " +
        (pointIndex + 1) +
        " - Completed: " +
        this.timelineData.completedPoints.length +
        "/" +
        this.timelineData.totalPoints
    );
  },

  /**
   * Update timeline UI
   */
  updateTimelineUI() {
    const timelineContainers = document.querySelectorAll(".timeline-container");

    timelineContainers.forEach((container) => {
      const buttons = container.querySelectorAll("button[data-point], button");
      let buttonIndex = 0;

      buttons.forEach((button) => {
        const pointNum = buttonIndex + 1;
        const isActive = buttonIndex === this.timelineData.currentPoint;
        const isCompleted = this.timelineData.completedPoints.includes(buttonIndex);

        // Remove previous state classes
        button.classList.remove("timeline-active", "timeline-completed");

        // Apply new state
        if (isActive) {
          button.classList.add("timeline-active");
          button.style.animation = "timelinePointPulse 0.6s ease-out";

          // Update button styling for active state
          button.style.width = "28px";
          button.style.height = "28px";
          button.style.background = "var(--brand-accent)";
          button.style.color = "white";
          button.style.fontWeight = "600";
        } else if (isCompleted) {
          button.classList.add("timeline-completed");
          button.style.background = "var(--success)";
          button.style.color = "white";

          // Replace text with checkmark if not already done
          if (!button.querySelector("i")) {
            button.innerHTML = '✓';
          }
        } else {
          button.style.width = "24px";
          button.style.height = "24px";
          button.style.background = "var(--neutral-400)";
          button.style.color = "var(--neutral-900)";
          button.style.fontWeight = "400";
        }

        // Add hover effect
        button.style.transition = "all var(--transition-base)";
        button.style.cursor = "pointer";
        button.style.border = "3px solid white";
        button.style.borderRadius = "50%";

        buttonIndex++;
      });
    });

    // Update description if it exists
    this.updatePointDescription();
  },

  /**
   * Update point description
   */
  updatePointDescription() {
    const descriptionElements = document.querySelectorAll("[data-timeline-description]");

    descriptionElements.forEach((el) => {
      const pointNum = parseInt(el.getAttribute("data-timeline-description"));

      if (pointNum === this.timelineData.currentPoint + 1) {
        el.style.animation = "slideIn var(--transition-base)";
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    });
  },

  /**
   * Save timeline state to localStorage
   */
  saveTimelineState() {
    try {
      localStorage.setItem("timelineState", JSON.stringify(this.timelineData));
      console.log("[Timeline] State saved");
    } catch (e) {
      console.warn("[Timeline] Error saving state: " + e.message);
    }
  },

  /**
   * Mark point as completed
   * @param {number} pointIndex - 0-based index of point
   */
  markPointCompleted(pointIndex) {
    if (!this.timelineData.completedPoints.includes(pointIndex)) {
      this.timelineData.completedPoints.push(pointIndex);
      this.updateTimelineUI();
      this.saveTimelineState();
      console.log("[Timeline] Point marked as completed: " + (pointIndex + 1));
    }
  },

  /**
   * Get current point progress
   * @returns {object} Progress information
   */
  getProgress() {
    return {
      current: this.timelineData.currentPoint + 1,
      completed: this.timelineData.completedPoints.length,
      total: this.timelineData.totalPoints,
      percentage: this.timelineData.totalPoints > 0
        ? Math.round((this.timelineData.completedPoints.length / this.timelineData.totalPoints) * 100)
        : 0,
    };
  },

  /**
   * Reset timeline
   */
  resetTimeline() {
    this.timelineData.currentPoint = 0;
    this.timelineData.completedPoints = [];
    this.updateTimelineUI();
    this.saveTimelineState();
    console.log("[Timeline] Timeline reset");
  },

  /**
   * Get timeline data for export
   * @returns {object} Complete timeline data
   */
  getTimelineData() {
    return {
      ...this.timelineData,
      progress: this.getProgress(),
    };
  },
};

/**
 * Initialize timeline when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  Timeline.init();

  // Setup timeline container if it doesn't exist yet
  // This allows dynamic timeline creation
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (
              node.querySelector &&
              (node.querySelector(".timeline-container") ||
                node.querySelector("[data-point]"))
            ) {
              Timeline.countTimelinePoints();
              Timeline.updateTimelineUI();
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
