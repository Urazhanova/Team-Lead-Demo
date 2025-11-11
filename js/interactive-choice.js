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

    // Find the choice data
    var choiceData = null;
    var allCards = document.querySelectorAll(".card.card-content");
    var choiceCard = null;

    for (var i = 0; i < allCards.length; i++) {
      if (allCards[i].__interactiveChoiceData) {
        choiceCard = allCards[i];
        var choices = allCards[i].__interactiveChoiceData.choices;
        for (var j = 0; j < choices.length; j++) {
          if (choices[j].id === choiceId) {
            choiceData = choices[j];
            break;
          }
        }
        if (choiceData) break;
      }
    }

    if (!choiceData) {
      console.error("[InteractiveChoice] Choice data not found for id: " + choiceId);
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
