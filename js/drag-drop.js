/**
 * Drag and Drop Module
 * Handles drag-drop interactions for SBI sorting exercise
 */

var DragDrop = {
  draggedElement: null,
  placedCards: {}, // Track which card is in which slot
  currentScreen: null,

  /**
   * Initialize drag-drop handlers
   */
  init: function() {
    this.bindDragDropEvents();
    this.bindCheckButton();
    console.log("[DragDrop] Module initialized");
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
    dragCards.forEach(function(card) {
      card.addEventListener("dragstart", function(e) {
        self.handleDragStart(e, card);
      });

      card.addEventListener("dragend", function(e) {
        self.handleDragEnd(e, card);
      });
    });

    // Bind drop events to slots
    dropSlots.forEach(function(slot) {
      slot.addEventListener("dragover", function(e) {
        self.handleDragOver(e, slot);
      });

      slot.addEventListener("dragleave", function(e) {
        self.handleDragLeave(e, slot);
      });

      slot.addEventListener("drop", function(e) {
        self.handleDrop(e, slot);
      });
    });
  },

  /**
   * Handle drag start
   */
  handleDragStart: function(e, card) {
    this.draggedElement = card;
    var cardId = card.getAttribute("data-card-id");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", card.innerHTML);

    // Visual feedback
    card.style.opacity = "0.5";
    card.style.transform = "scale(1.05)";

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
    }
  },

  /**
   * Handle drag over
   */
  handleDragOver: function(e, slot) {
    if (e.preventDefault) {
      e.preventDefault();
    }

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
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    var cardId = this.draggedElement.getAttribute("data-card-id");
    var slotId = slot.getAttribute("data-slot-id");

    console.log("[DragDrop] Dropped card " + cardId + " into slot " + slotId);

    // Check if slot is already occupied
    var existingCard = slot.querySelector(".drag-card");
    if (existingCard) {
      // Remove existing card from slot (return to top)
      var existingCardId = existingCard.getAttribute("data-card-id");
      delete this.placedCards[existingCardId];
      existingCard.style.opacity = "1";
      existingCard.style.transform = "scale(1)";
    }

    // Move card to slot
    var cardClone = this.draggedElement.cloneNode(true);
    slot.innerHTML = "";
    slot.appendChild(cardClone);

    // Track placement
    this.placedCards[cardId] = slotId;

    // Reset visual feedback
    slot.style.borderColor = slot.getAttribute("data-border-color");
    slot.style.backgroundColor = "transparent";
    slot.style.transform = "scale(1)";

    // Re-bind drag events to cloned card
    var self = this;
    cardClone.addEventListener("dragstart", function(e) {
      self.handleDragStart(e, cardClone);
    });

    // Hide original card
    var originalCard = document.querySelector(".drag-card[data-card-id='" + cardId + "']");
    if (originalCard && originalCard !== this.draggedElement) {
      originalCard.style.display = "none";
    }

    this.draggedElement.style.display = "none";
  },

  /**
   * Bind check button
   */
  bindCheckButton: function() {
    var self = this;
    var checkBtn = document.querySelector("[data-action='check-dragdrop']");

    if (checkBtn) {
      checkBtn.addEventListener("click", function(e) {
        e.preventDefault();
        self.checkAnswer();
      });
      console.log("[DragDrop] Check button bound");
    }
  },

  /**
   * Check if answer is correct
   */
  checkAnswer: function() {
    console.log("[DragDrop] Checking answer...");
    console.log("[DragDrop] Placed cards:", this.placedCards);

    // Get correct order from the screen
    var screenCard = document.querySelector(".card.card-content");
    if (!screenCard || !screenCard.__dragDropData) {
      console.error("[DragDrop] No screen data found");
      return;
    }

    var correctOrder = screenCard.__dragDropData.correctOrder;
    console.log("[DragDrop] Correct order:", correctOrder);

    // Check if all slots are filled
    var slots = document.querySelectorAll(".drop-slot");
    var allFilled = true;
    var userOrder = [];

    slots.forEach(function(slot) {
      var card = slot.querySelector(".drag-card");
      if (!card) {
        allFilled = false;
      } else {
        var cardId = card.getAttribute("data-card-id");
        userOrder.push(cardId);
      }
    });

    if (!allFilled) {
      alert("Пожалуйста, заполните все слоты!");
      return;
    }

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
    var checkBtn = document.querySelector("[data-action='check-dragdrop']");
    if (checkBtn) {
      checkBtn.style.backgroundColor = "#4CAF50";
      checkBtn.style.color = "white";
      checkBtn.innerHTML = "✓ Отлично! Ты понял модель SBI! +20 XP";
      checkBtn.disabled = true;

      // Enable next button
      var nextBtn = document.querySelector("[data-action='next']");
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
      }
    }

    console.log("[DragDrop] Answer is correct!");
  },

  /**
   * Show error message
   */
  showErrorMessage: function() {
    var checkBtn = document.querySelector("[data-action='check-dragdrop']");
    if (checkBtn) {
      checkBtn.style.backgroundColor = "#F44336";
      checkBtn.style.color = "white";
      checkBtn.innerHTML = "✗ Не совсем... Подумай еще раз. S - Ситуация, B - Поведение, I - Влияние";
    }

    console.log("[DragDrop] Answer is incorrect");
  }
};

/**
 * Initialize drag-drop when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function() {
  // Wait a bit for dynamic content to be loaded
  setTimeout(function() {
    DragDrop.init();
  }, 100);
});

// Re-initialize when new screens are loaded
var originalNavigationShowScreen = Navigation.showScreen;
Navigation.showScreen = function(index, animate) {
  originalNavigationShowScreen.call(this, index, animate);

  // Re-initialize drag-drop for new screen
  setTimeout(function() {
    DragDrop.init();
  }, 200);
};

console.log("[DragDrop] Module loaded");
