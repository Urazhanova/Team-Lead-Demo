/**
 * Interactive Choice Module
 * Handles user selections in choice-based interactive screens
 */

var InteractiveChoice = {
  selectedChoice: null,
  currentScreen: null,
  feedbackShowing: false,  // Flag to prevent multiple feedbacks
  currentChoiceData: null,  // Store current screen's choice data
  lastInitializedScreenId: null,  // Track which screen was last initialized

  /**
   * Initialize choice handlers
   */
  init: function() {
    // Get current visible screen
    var visibleScreen = document.querySelector(".screen:not(.hidden)");
    var currentScreenId = visibleScreen ? visibleScreen.id : null;

    // Skip if we already initialized for this screen
    if (currentScreenId && currentScreenId === this.lastInitializedScreenId) {
      console.log("[InteractiveChoice] Already initialized for screen " + currentScreenId + ", skipping re-initialization");
      return;
    }

    this.lastInitializedScreenId = currentScreenId;
    console.log("[InteractiveChoice] Initializing for screen: " + currentScreenId);

    // Reset ALL data for new screen
    this.feedbackShowing = false;
    this.currentChoiceData = null;
    this.selectedChoice = null;
    console.log("[InteractiveChoice] Reset all flags for new screen");

    // Get current choice data from visible card
    this.extractCurrentChoiceData();

    this.bindChoiceButtons();
    console.log("[InteractiveChoice] Module initialized");
  },

  /**
   * Extract choice data from visible card
   */
  extractCurrentChoiceData: function() {
    this.currentChoiceData = null;

    // Get ALL screens and check which are visible
    var allScreens = document.querySelectorAll(".screen");
    console.log("[InteractiveChoice] Total screens in DOM:", allScreens.length);
    for (var idx = 0; idx < allScreens.length; idx++) {
      var isHidden = allScreens[idx].classList.contains("hidden");
      console.log("[InteractiveChoice] Screen " + idx + " (id=" + allScreens[idx].id + "): hidden=" + isHidden + ", data-screen=" + allScreens[idx].getAttribute("data-screen"));
    }

    // Get the currently visible screen element
    var visibleScreen = document.querySelector(".screen:not(.hidden)");

    if (!visibleScreen) {
      console.warn("[InteractiveChoice] No visible screen found");
      return;
    }

    console.log("[InteractiveChoice] Found visible screen with id:", visibleScreen.id);
    console.log("[InteractiveChoice] Screen data-type:", visibleScreen.getAttribute("data-type"));
    console.log("[InteractiveChoice] Screen data-screen:", visibleScreen.getAttribute("data-screen"));

    // Look for choice card only within the visible screen
    var card = visibleScreen.querySelector(".card.card-content");

    if (!card) {
      console.warn("[InteractiveChoice] No card found in visible screen");
      console.log("[InteractiveChoice] Visible screen HTML length:", visibleScreen.innerHTML.length);
      return;
    }

    console.log("[InteractiveChoice] Found card in visible screen");

    // Check if this card has choice data
    if (!card.__interactiveChoiceData) {
      console.log("[InteractiveChoice] No choice data found on this screen (this is normal for non-choice screens)");
      return;
    }

    this.currentChoiceData = card.__interactiveChoiceData;
    console.log("[InteractiveChoice] Extracted choice data from card in screen:", visibleScreen.id);
    console.log("[InteractiveChoice] Title:", this.currentChoiceData.title);
    console.log("[InteractiveChoice] Number of choices:", this.currentChoiceData.choices ? this.currentChoiceData.choices.length : 0);
    if (this.currentChoiceData.choices && this.currentChoiceData.choices.length > 0) {
      console.log("[InteractiveChoice] Choice IDs:", this.currentChoiceData.choices.map(function(c) { return c.id; }).join(", "));
    }
  },

  /**
   * Bind choice button events
   */
  bindChoiceButtons: function() {
    var self = this;

    // Get the currently visible screen element
    var visibleScreen = document.querySelector(".screen:not(.hidden)");
    if (!visibleScreen) {
      console.warn("[InteractiveChoice] No visible screen found for bindChoiceButtons");
      return;
    }

    // Find only choice buttons within the visible screen
    var buttons = visibleScreen.querySelectorAll(".choice-btn");
    var choiceButtons = [];

    console.log("[InteractiveChoice] Looking for choice buttons in visible screen...");
    console.log("[InteractiveChoice] Found " + buttons.length + " choice buttons in visible screen");

    for (var i = 0; i < buttons.length; i++) {
      choiceButtons.push(buttons[i]);
    }

    if (choiceButtons.length === 0) {
      console.log("[InteractiveChoice] Not a choice screen, skipping initialization");
      return;
    }

    choiceButtons.forEach(function(btn) {
      var choiceId = btn.getAttribute("data-choice-id");

      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Prevent multiple feedback modals
        if (self.feedbackShowing) {
          console.log("[InteractiveChoice] Feedback already showing, ignoring click");
          return;
        }

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

        // Mark that we're showing feedback to prevent duplicates
        self.feedbackShowing = true;

        // Get choice data and show feedback modal
        self.showChoiceFeedback(choiceId);

        console.log("[InteractiveChoice] Button styled as selected");
      });
    });

    console.log("[InteractiveChoice] Choice buttons bound successfully");
  },

  /**
   * Show feedback modal for selected choice
   */
  showChoiceFeedback: function(choiceId) {
    console.log("[InteractiveChoice] Showing feedback for choice: " + choiceId);

    // Use the current choice data that was extracted during init
    if (!this.currentChoiceData) {
      console.error("[InteractiveChoice] No current choice data available");
      return;
    }

    console.log("[InteractiveChoice] Using currentChoiceData with title:", this.currentChoiceData.title);

    // Find the specific choice from current data
    var choiceData = null;
    var choices = this.currentChoiceData.choices || [];

    for (var j = 0; j < choices.length; j++) {
      if (choices[j].id === choiceId) {
        choiceData = choices[j];
        console.log("[InteractiveChoice] Found choice data for id: " + choiceId);
        break;
      }
    }

    if (!choiceData) {
      console.error("[InteractiveChoice] Choice data not found for id: " + choiceId);
      console.log("[InteractiveChoice] Available choices:", choices.map(function(c) { return c.id; }).join(", "));
      return;
    }

    // Determine if choice is correct
    var isCorrect = choiceData.correct;
    var preview = choiceData.preview || {};
    var emoji = preview.emoji || (isCorrect ? '✅' : '❌');
    var title = preview.label || (isCorrect ? 'Отлично!' : 'Не совсем верно');
    var consequences = choiceData.consequences || '';
    var color = preview.color || (isCorrect ? '#4CAF50' : '#F44336');

    // Create modal using DOM elements (more reliable than innerHTML)
    var modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.zIndex = "10000";
    modal.style.cursor = "auto";

    // Create content container
    var content = document.createElement("div");
    content.className = "modal-content";
    content.style.maxWidth = "500px";
    content.style.textAlign = "center";

    // Create close button
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = "position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border: none; background: none; font-size: 24px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10001;";

    // Create emoji/icon
    var emojiDiv = document.createElement("div");
    emojiDiv.innerHTML = emoji;
    emojiDiv.style.cssText = "font-size: 60px; margin-bottom: 16px;";

    // Create title
    var titleEl = document.createElement("h2");
    titleEl.innerHTML = title;
    titleEl.style.cssText = "color: " + color + "; margin-bottom: 16px;";

    // Create consequences box
    var consequencesBox = document.createElement("div");
    consequencesBox.style.cssText = "background: rgba(123, 104, 238, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: left;";
    var consequencesText = document.createElement("p");
    consequencesText.innerHTML = consequences;
    consequencesText.style.cssText = "margin: 0; line-height: 1.6;";
    consequencesBox.appendChild(consequencesText);

    // Create rewards box if needed
    var rewardsBox = null;
    if (choiceData.rewards) {
      rewardsBox = document.createElement("div");
      rewardsBox.style.cssText = "background: #E8F5E9; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;";

      if (choiceData.rewards.xp) {
        var xpText = document.createElement("p");
        xpText.innerHTML = "+" + choiceData.rewards.xp + " XP";
        xpText.style.cssText = "margin: 0; font-weight: bold;";
        rewardsBox.appendChild(xpText);
      }

      if (choiceData.rewards.achievement) {
        var achievementText = document.createElement("p");
        achievementText.innerHTML = "🏆 " + choiceData.rewards.achievement;
        achievementText.style.cssText = "margin: 8px 0 0 0; font-size: 14px;";
        rewardsBox.appendChild(achievementText);
      }
    }

    // Create continue button
    var continueBtn = document.createElement("button");
    continueBtn.type = "button";
    continueBtn.className = "btn btn-primary";
    continueBtn.innerHTML = "Продолжить";
    continueBtn.style.cssText = "width: 100%; padding: 12px 20px; border: none; border-radius: 6px; background: #163F6F; color: white; font-weight: 600; cursor: pointer; font-size: 16px; transition: background 0.3s;";

    // Assemble content
    content.appendChild(closeBtn);
    content.appendChild(emojiDiv);
    content.appendChild(titleEl);
    content.appendChild(consequencesBox);
    if (rewardsBox) {
      content.appendChild(rewardsBox);
    }
    content.appendChild(continueBtn);

    // Assemble modal
    modal.appendChild(content);
    document.body.appendChild(modal);

    console.log("[InteractiveChoice] Modal appended to DOM");
    console.log("[InteractiveChoice] Modal in body:", !!document.body.querySelector(".modal-overlay"));

    // Define close handler BEFORE attaching listeners
    var closeHandler = function(e) {
      console.log("[InteractiveChoice] Close handler called, event:", !!e);

      if (e) {
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch (err) {
          console.log("[InteractiveChoice] Error in preventDefault:", err.message);
        }
      }

      // Award XP if available
      if (choiceData.rewards && choiceData.rewards.xp) {
        var xpAmount = choiceData.rewards.xp;
        console.log("[InteractiveChoice] Awarding " + xpAmount + " XP");
      }

      console.log("[InteractiveChoice] Starting modal fade-out");
      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";

      setTimeout(function() {
        console.log("[InteractiveChoice] Removing modal from DOM");
        try {
          if (modal && modal.parentElement) {
            modal.parentElement.removeChild(modal);
            console.log("[InteractiveChoice] Modal removed successfully");
          }

          // Reset feedback flag so next choice can trigger feedback
          self.feedbackShowing = false;
          console.log("[InteractiveChoice] Feedback flag reset");

          // Reset Navigation transition flag just in case
          if (typeof Navigation !== 'undefined' && Navigation.resetTransitionFlag) {
            Navigation.resetTransitionFlag();
          }
        } catch (err) {
          console.log("[InteractiveChoice] Error removing modal:", err.message);
        }
      }, 200);
    };

    // Attach event listeners DIRECTLY to elements
    closeBtn.onclick = closeHandler;
    continueBtn.onclick = closeHandler;

    console.log("[InteractiveChoice] Event listeners attached to buttons");
    console.log("[InteractiveChoice] Feedback modal shown for choice: " + choiceId);
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

// Note: Re-initialization on screen changes is handled by Navigation module's screen change event

// Set up MutationObserver to detect choice buttons
if (typeof MutationObserver !== 'undefined') {
  var observer = new MutationObserver(function(mutations) {
    // Only look for buttons in the currently visible screen
    var visibleScreen = document.querySelector(".screen:not(.hidden)");
    if (visibleScreen) {
      var choiceButtons = visibleScreen.querySelectorAll(".choice-btn");
      if (choiceButtons.length > 0) {
        console.log("[InteractiveChoice] Detected choice buttons via mutation in visible screen");
        InteractiveChoice.init();
      }
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
