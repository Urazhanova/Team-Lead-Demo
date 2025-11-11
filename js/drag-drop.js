/**
 * Drag and Drop Module
 * Handles drag-drop interactions for SBI sorting exercise
 */

var DragDrop = {
  draggedElement: null,
  placedCards: {}, // Track which card is in which slot
  currentScreen: null,
  dragCardsInitialized: false, // Track if already initialized for current screen

  /**
   * Initialize drag-drop handlers
   */
  init: function() {
    // Check if this is a drag-drop screen
    var dragCards = document.querySelectorAll(".drag-card");

    if (dragCards.length === 0) {
      console.log("[DragDrop] Not a drag-drop screen, skipping initialization");
      this.dragCardsInitialized = false;
      return;
    }

    this.dragCardsInitialized = true;
    this.placedCards = {}; // Reset placed cards for new screen
    this.draggedElement = null;

    this.bindDragDropEvents();
    this.bindCheckButton();
    console.log("[DragDrop] Module initialized for drag-drop screen");
  },

  /**
   * Bind drag and drop events
   */
  bindDragDropEvents: function() {
    var self = this;

    // Find all drag cards and slots
    var dragCards = document.querySelectorAll(".drag-card");
    var dropSlots = document.querySelectorAll(".drop-slot");

    console.log("[DragDrop] Found " + dragCards.length + " drag cards and " + dropSlots.length + " drop slots");

    // Bind drag events to cards
    dragCards.forEach(function(card, idx) {
      var cardId = card.getAttribute("data-card-id");
      card.addEventListener("dragstart", function(e) {
        console.log("[DragDrop] dragstart on card " + cardId);
        self.handleDragStart(e, card);
      });

      card.addEventListener("dragend", function(e) {
        console.log("[DragDrop] dragend on card " + cardId);
        self.handleDragEnd(e, card);
      });

      console.log("[DragDrop] Bound drag events to card " + cardId);
    });

    // Bind drop events to slots
    dropSlots.forEach(function(slot, idx) {
      var slotId = slot.getAttribute("data-slot-id");

      slot.addEventListener("dragover", function(e) {
        self.handleDragOver(e, slot);
      });

      slot.addEventListener("dragleave", function(e) {
        self.handleDragLeave(e, slot);
      });

      slot.addEventListener("drop", function(e) {
        console.log("[DragDrop] drop on slot " + slotId);
        self.handleDrop(e, slot);
      });

      console.log("[DragDrop] Bound drop events to slot " + slotId);
    });
  },

  /**
   * Handle drag start
   */
  handleDragStart: function(e, card) {
    this.draggedElement = card;
    var cardId = card.getAttribute("data-card-id");

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", card.innerHTML);
    }

    // Visual feedback
    card.style.opacity = "0.5";
    card.style.transform = "scale(1.05)";
    card.style.zIndex = "1000";

    console.log("[DragDrop] Started dragging card: " + cardId);
  },

  /**
   * Handle drag end
   */
  handleDragEnd: function(e, card) {
    // Reset visual feedback if not placed
    if (!this.draggedElement || this.draggedElement === card) {
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
      card.style.zIndex = "auto";
    }
  },

  /**
   * Handle drag over
   */
  handleDragOver: function(e, slot) {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = "move";

    // Visual feedback for drop zone
    slot.style.borderColor = "#4CAF50";
    slot.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
    slot.style.transform = "scale(1.02)";

    return false;
  },

  /**
   * Handle drag leave
   */
  handleDragLeave: function(e, slot) {
    // Reset visual feedback
    var slotId = slot.getAttribute("data-slot-id");
    var borderColor = slot.getAttribute("data-border-color") || "#999";

    slot.style.borderColor = borderColor;
    slot.style.backgroundColor = "transparent";
    slot.style.transform = "scale(1)";
  },

  /**
   * Handle drop
   */
  handleDrop: function(e, slot) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.draggedElement) {
      return;
    }

    var cardId = this.draggedElement.getAttribute("data-card-id");
    var slotId = slot.getAttribute("data-slot-id");

    console.log("[DragDrop] Dropped card " + cardId + " into slot " + slotId);

    // Check if slot is already occupied
    var existingCard = slot.querySelector(".drag-card");
    if (existingCard) {
      // Remove existing card from slot and show original
      var existingCardId = existingCard.getAttribute("data-card-id");
      delete this.placedCards[existingCardId];
      var originalCard = document.querySelector(".drag-card[data-card-id='" + existingCardId + "']");
      if (originalCard) {
        originalCard.style.display = "block";
      }
    }

    // Move card to slot
    var cardClone = this.draggedElement.cloneNode(true);
    cardClone.style.opacity = "1";
    cardClone.style.transform = "scale(1)";
    slot.innerHTML = "";
    slot.appendChild(cardClone);

    // Track placement
    this.placedCards[cardId] = slotId;

    // Reset visual feedback
    var borderColor = slot.getAttribute("data-border-color") || "#999";
    slot.style.borderColor = borderColor;
    slot.style.backgroundColor = "transparent";
    slot.style.transform = "scale(1)";

    // Re-bind drag events to cloned card
    var self = this;
    cardClone.addEventListener("dragstart", function(e) {
      self.draggedElement = cardClone;
      self.handleDragStart(e, cardClone);
    });

    cardClone.addEventListener("dragend", function(e) {
      self.handleDragEnd(e, cardClone);
    });

    // Hide original card
    this.draggedElement.style.display = "none";
    this.draggedElement = null;
  },

  /**
   * Bind check button
   */
  bindCheckButton: function() {
    var self = this;

    // Try multiple selectors to find the check button
    var checkBtn = document.querySelector("[data-action='check-dragdrop']");

    console.log("[DragDrop] Looking for check button...");
    console.log("[DragDrop] querySelector result:", !!checkBtn);

    if (!checkBtn) {
      console.log("[DragDrop] Not found with direct query, searching in visible cards...");
      var visibleCards = document.querySelectorAll(".card:not(.hidden)");
      console.log("[DragDrop] Found " + visibleCards.length + " visible cards");

      for (var i = 0; i < visibleCards.length; i++) {
        var btn = visibleCards[i].querySelector("[data-action='check-dragdrop']");
        if (btn) {
          checkBtn = btn;
          console.log("[DragDrop] Found check button in visible card " + i);
          break;
        }
      }
    }

    console.log("[DragDrop] Check button found:", !!checkBtn);

    if (checkBtn) {
      // Remove all existing listeners by cloning and replacing
      var newCheckBtn = checkBtn.cloneNode(true);
      if (checkBtn.parentNode) {
        checkBtn.parentNode.replaceChild(newCheckBtn, checkBtn);
        checkBtn = newCheckBtn;
      }

      checkBtn.addEventListener("click", function(e) {
        console.log("[DragDrop] Check button clicked!");
        e.preventDefault();
        e.stopPropagation();
        self.checkAnswer();
      });
      console.log("[DragDrop] Check button bound successfully");
    } else {
      console.error("[DragDrop] Check button NOT found!");
      console.error("[DragDrop] Searched in all cards and queries");
    }
  },

  /**
   * Check if answer is correct
   */
  checkAnswer: function() {
    console.log("[DragDrop] checkAnswer() called");
    console.log("[DragDrop] Placed cards:", this.placedCards);

    // Get correct order from the screen - find the specific drag-drop screen card
    var allCards = document.querySelectorAll(".card.card-content");
    console.log("[DragDrop] Found " + allCards.length + " card elements");

    var screenCard = null;
    for (var i = 0; i < allCards.length; i++) {
      if (allCards[i].__dragDropData) {
        screenCard = allCards[i];
        console.log("[DragDrop] Found screen card with drag-drop data at index " + i);
        break;
      }
    }

    if (!screenCard || !screenCard.__dragDropData) {
      console.error("[DragDrop] No screen data found - checking visible card");
      var visibleCard = document.querySelector(".dragdrop-container").closest(".card.card-content");
      if (visibleCard && visibleCard.__dragDropData) {
        screenCard = visibleCard;
        console.log("[DragDrop] Found visible drag-drop card");
      } else {
        console.error("[DragDrop] Still no drag-drop data found!");
        return;
      }
    }

    var correctOrder = screenCard.__dragDropData.correctOrder;
    console.log("[DragDrop] Correct order:", correctOrder);

    // Get slots in order
    var slots = document.querySelectorAll(".drop-slot");
    var allFilled = true;
    var userOrder = [];

    // Build user order based on slot IDs (S, B, I)
    correctOrder.forEach(function(slotId) {
      var slot = document.querySelector(".drop-slot[data-slot-id='" + slotId + "']");
      if (slot) {
        var card = slot.querySelector(".drag-card");
        if (!card) {
          allFilled = false;
        } else {
          var cardId = card.getAttribute("data-card-id");
          userOrder.push(cardId);
        }
      }
    });

    if (!allFilled) {
      alert("Пожалуйста, заполните все слоты!");
      return;
    }

    console.log("[DragDrop] User order:", userOrder);

    // Compare order
    var isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
      this.showSuccessMessage();
    } else {
      this.showErrorMessage();
    }
  },

  /**
   * Show success message
   */
  showSuccessMessage: function() {
    var self = this;
    var checkBtn = document.querySelector("[data-action='check-dragdrop']");
    if (checkBtn) {
      checkBtn.disabled = true;
    }

    // Create modal for success message
    var modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.animation = "fadeIn var(--transition-base)";

    var modalContent = '<div class="modal-content" style="max-width: 500px; text-align: center;">' +
      '<button type="button" class="modal-close" aria-label="Закрыть">×</button>' +
      '<div style="font-size: 60px; margin-bottom: 16px;">✓</div>' +
      '<h2 style="color: #4CAF50; margin-bottom: 16px;">Отлично!</h2>' +
      '<p style="font-size: 16px; margin-bottom: 24px;">Ты правильно понял модель SBI!</p>' +
      '<div style="background: #E8F5E9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">' +
        '<p style="margin: 0; font-weight: bold;">+20 XP</p>' +
      '</div>' +
      '<button type="button" class="btn btn-primary" id="dragdrop-success-close" style="width: 100%;">Продолжить</button>' +
      '</div>';

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Bind close handlers
    var closeBtn = modal.querySelector(".modal-close");
    var continueBtn = modal.querySelector("#dragdrop-success-close");

    var closeHandler = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      modal.style.animation = "fadeIn var(--transition-base) reverse";
      setTimeout(function() {
        if (modal.parentElement) {
          modal.remove();
        }
        // Enable next button after modal closes
        var nextBtn = document.querySelector("[data-action='next']");
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.style.opacity = "1";
        }
      }, 150);
    };

    closeBtn.addEventListener("click", closeHandler);
    continueBtn.addEventListener("click", closeHandler);

    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeHandler();
      }
    });

    console.log("[DragDrop] Answer is correct!");
  },

  /**
   * Show error message
   */
  showErrorMessage: function() {
    // Create modal for error message
    var modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.animation = "fadeIn var(--transition-base)";

    var modalContent = '<div class="modal-content" style="max-width: 500px; text-align: center;">' +
      '<button type="button" class="modal-close" aria-label="Закрыть">×</button>' +
      '<div style="font-size: 60px; margin-bottom: 16px; color: #F44336;">✗</div>' +
      '<h2 style="color: #F44336; margin-bottom: 16px;">Не совсем верно</h2>' +
      '<div style="background: #FFEBEE; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: left;">' +
        '<p style="margin: 0 0 12px 0; font-weight: bold;">Подсказка:</p>' +
        '<p style="margin: 0 0 8px 0;"><strong>S - Ситуация:</strong> Когда и где это произошло? ("Вчера на daily meeting в 10:00")</p>' +
        '<p style="margin: 0 0 8px 0;"><strong>B - Поведение:</strong> Конкретные действия ("ты опоздал на 15 минут и не предупредил")</p>' +
        '<p style="margin: 0;"><strong>I - Влияние:</strong> Последствия ("команда ждала, и мы потеряли время на встрече")</p>' +
      '</div>' +
      '<button type="button" class="btn btn-primary" id="dragdrop-error-close" style="width: 100%; background-color: #F44336;">Попробовать еще раз</button>' +
      '</div>';

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Bind close handlers
    var closeBtn = modal.querySelector(".modal-close");
    var retryBtn = modal.querySelector("#dragdrop-error-close");

    var closeHandler = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      modal.style.animation = "fadeIn var(--transition-base) reverse";
      setTimeout(function() {
        if (modal.parentElement) {
          modal.remove();
        }
        // Reset button color
        var checkBtn = document.querySelector("[data-action='check-dragdrop']");
        if (checkBtn) {
          checkBtn.style.backgroundColor = "";
          checkBtn.style.color = "";
          checkBtn.innerHTML = "Проверить";
        }
      }, 150);
    };

    closeBtn.addEventListener("click", closeHandler);
    retryBtn.addEventListener("click", closeHandler);

    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeHandler();
      }
    });

    console.log("[DragDrop] Answer is incorrect");
  }
};

/**
 * Initialize drag-drop when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function() {
  // Wait for dynamic content to be loaded
  setTimeout(function() {
    console.log("[DragDrop] Initializing on DOMContentLoaded");
    DragDrop.init();
  }, 800);
});

// Re-initialize when new screens are loaded
if (typeof Navigation !== 'undefined') {
  var originalNavigationShowScreen = Navigation.showScreen;
  Navigation.showScreen = function(index, animate) {
    console.log("[DragDrop] Screen change detected to index " + index);
    originalNavigationShowScreen.call(this, index, animate);

    // Wait for transition to complete then initialize
    // Use longer timeout to ensure animation completes
    setTimeout(function() {
      console.log("[DragDrop] Transition should be complete, initializing drag-drop");
      DragDrop.init();
    }, 800);
  };
}

// Also set up a mutation observer to catch DOM changes
if (typeof MutationObserver !== 'undefined') {
  var observer = new MutationObserver(function(mutations) {
    // Check if drag-drop cards were added to DOM
    var dragCards = document.querySelectorAll(".drag-card");
    if (dragCards.length > 0) {
      console.log("[DragDrop] Detected drag-drop cards in DOM via mutation");
      // Only initialize if not already initialized for this screen
      if (!DragDrop.dragCardsInitialized) {
        DragDrop.dragCardsInitialized = true;
        setTimeout(function() {
          DragDrop.init();
        }, 100);
      }
    }
  });

  // Start observing the main content area
  var mainContent = document.getElementById('mainContent');
  if (mainContent) {
    observer.observe(mainContent, {
      childList: true,
      subtree: true,
      characterData: false
    });
    console.log("[DragDrop] MutationObserver attached to mainContent");
  }
}

console.log("[DragDrop] Module loaded and attached to Navigation");
