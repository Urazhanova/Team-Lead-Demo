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

    // Create modal
    var modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.animation = "fadeIn var(--transition-base)";
    modal.style.zIndex = "10000";
    modal.style.cursor = "auto";

    var modalContent = '<div class="modal-content" style="max-width: 500px; text-align: center;">' +
      '<button type="button" class="modal-close" aria-label="Закрыть" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border: none; background: none; font-size: 24px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10001;">×</button>' +
      '<div style="font-size: 60px; margin-bottom: 16px;">' + emoji + '</div>' +
      '<h2 style="color: ' + color + '; margin-bottom: 16px;">' + title + '</h2>' +
      '<div style="background: rgba(123, 104, 238, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: left;">' +
        '<p style="margin: 0; line-height: 1.6;">' + consequences + '</p>' +
      '</div>';

    if (choiceData.rewards) {
      modalContent += '<div style="background: #E8F5E9; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">';
      if (choiceData.rewards.xp) {
        modalContent += '<p style="margin: 0; font-weight: bold;">+' + choiceData.rewards.xp + ' XP</p>';
      }
      if (choiceData.rewards.achievement) {
        modalContent += '<p style="margin: 8px 0 0 0; font-size: 14px;">🏆 ' + choiceData.rewards.achievement + '</p>';
      }
      modalContent += '</div>';
    }

    modalContent += '<button type="button" class="btn btn-primary" id="choice-feedback-close" style="width: 100%; padding: 12px 20px; border: none; border-radius: 6px; background: #163F6F; color: white; font-weight: 600; cursor: pointer; font-size: 16px; transition: background 0.3s;">Продолжить</button>' +
      '</div>';

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    console.log("[InteractiveChoice] Modal appended to DOM");

    // Bind close handlers - use setTimeout to ensure elements are rendered
    setTimeout(function() {
      var closeBtn = modal.querySelector(".modal-close");
      var continueBtn = modal.querySelector("#choice-feedback-close");

      console.log("[InteractiveChoice] closeBtn found: " + !!closeBtn);
      console.log("[InteractiveChoice] continueBtn found: " + !!continueBtn);

      var closeHandler = function(e) {
        console.log("[InteractiveChoice] Close handler called, event:", !!e);

        // Don't use preventDefault/stopPropagation - it can cause issues
        try {
          if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
          }
          if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
          }
        } catch (err) {
          console.log("[InteractiveChoice] Error preventing default:", err.message);
        }

        // Award XP if available
        if (choiceData.rewards && choiceData.rewards.xp) {
          var xpAmount = choiceData.rewards.xp;
          console.log("[InteractiveChoice] Awarding " + xpAmount + " XP");

          // Try to update UI (look for XP display elements)
          var xpElements = document.querySelectorAll("[data-xp], .xp-counter, #xp-total");
          console.log("[InteractiveChoice] Found " + xpElements.length + " XP display elements");

          // If no specific XP display, try to find and update global progress
          if (typeof SCORM !== 'undefined' && SCORM.saveScore) {
            console.log("[InteractiveChoice] Saving score to SCORM");
            // SCORM.saveScore(xpAmount);
          }
        }

        console.log("[InteractiveChoice] Starting modal fade-out animation");
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

      if (closeBtn) {
        closeBtn.addEventListener("click", closeHandler);
        console.log("[InteractiveChoice] Close button event listener attached");
      }

      if (continueBtn) {
        continueBtn.addEventListener("click", closeHandler);
        console.log("[InteractiveChoice] Continue button event listener attached");
      }

      modal.addEventListener("click", function(e) {
        if (e.target === modal) {
          closeHandler();
        }
      });

      console.log("[InteractiveChoice] All event listeners attached");
    }, 10);

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
