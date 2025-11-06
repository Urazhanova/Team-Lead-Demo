/**
 * Modals Module
 * Handles character information modals with detailed display
 */

var Modals = {
  // Track active modals
  activeModals: [],
  modalStack: [],

  /**
   * Initialize modal handlers
   */
  init: function() {
    this.bindCharacterButtons();
    this.setupGlobalKeyHandling();
    console.log("[Modals] Module initialized");
  },

  /**
   * Setup global keyboard handling
   */
  setupGlobalKeyHandling: function() {
    var self = this;
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && self.activeModals.length > 0) {
        var topModal = self.activeModals[self.activeModals.length - 1];
        if (topModal && topModal.parentElement) {
          self.closeModal(topModal);
        }
      }
    });
  },

  /**
   * Bind character info buttons
   */
  bindCharacterButtons: function() {
    var self = this;
    document.addEventListener("click", function(e) {
      var button = e.target.closest("[data-character]");

      if (button) {
        e.stopPropagation();
        var characterId = button.getAttribute("data-character");
        self.showCharacterModal(characterId);
      }
    });
  },

  /**
   * Show character information modal
   * @param {string} characterId - Character ID
   */
  showCharacterModal: function(characterId) {
    // Check if Data module is available
    if (!Data || !Data.getCharacter) {
      console.warn("[Modals] Data module not available");
      return;
    }

    var characterData = Data.getCharacter(characterId);

    if (!characterData) {
      console.error("[Modals] Character not found: " + characterId);
      return;
    }

    // Create modal HTML
    var modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.setAttribute("data-character-id", characterId);
    modal.style.animation = "fadeIn var(--transition-base)";

    // Build modal content with detailed information
    var contentHTML = "\n      <div class=\"modal-content\">\n        <button class=\"modal-close\" aria-label=\"Закрыть модальное окно\">×</button>\n\n        <div style=\"text-align: center; margin-bottom: var(--space-lg);\">\n          <img src=\"" + characterData.image + "\"\n               alt=\"" + characterData.name + "\"\n               style=\"width: 150px; height: 150px; object-fit: contain; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);\"\n               loading=\"lazy\">\n        </div>\n\n        <h2 style=\"text-align: center; margin-bottom: var(--space-xs); color: var(--brand-primary);\">\n          " + this.escapeHTML(characterData.name) + "\n        </h2>\n\n        <p style=\"text-align: center; color: var(--brand-accent); font-weight: 600; font-size: var(--body-small-size); margin-bottom: var(--space-lg);\">\n          " + this.escapeHTML(characterData.role) + "\n        </p>\n\n        <div style=\"margin-bottom: var(--space-lg); padding: var(--space-md); background: var(--neutral-50); border-radius: var(--radius-md);\">\n          <p style=\"margin: 0; line-height: 1.6;\">\n            " + this.escapeHTML(characterData.description) + "\n          </p>\n        </div>\n    ";

    // Add skills if available
    if (characterData.skills && characterData.skills.length > 0) {
      contentHTML += "\n        <div style=\"margin-bottom: var(--space-lg);\">\n          <h4 style=\"margin: 0 0 var(--space-md) 0; color: var(--brand-primary);\">\n            💡 Компетенции\n          </h4>\n          <div style=\"display: flex; flex-wrap: wrap; gap: 8px;\">\n      ";

      var i;
      for (i = 0; i < characterData.skills.length; i++) {
        var skill = characterData.skills[i];
        contentHTML += "\n          <span style=\"\n            display: inline-block;\n            padding: 6px 12px;\n            background: var(--brand-primary);\n            color: white;\n            border-radius: var(--radius-md);\n            font-size: var(--body-small-size);\n            font-weight: 500;\">\n            " + this.escapeHTML(skill) + "\n          </span>\n        ";
      }

      contentHTML += "\n          </div>\n        </div>\n      ";
    }

    // Add stats if available
    if (characterData.stats && Object.keys(characterData.stats).length > 0) {
      contentHTML += "\n        <div style=\"margin-bottom: var(--space-lg);\">\n          <h4 style=\"margin: 0 0 var(--space-md) 0; color: var(--brand-primary);\">\n            📊 Характеристики\n          </h4>\n          <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 12px;\">\n      ";

      var stats = characterData.stats;
      var stat;
      for (stat in stats) {
        if (stats.hasOwnProperty(stat)) {
          var value = stats[stat];
          var displayValue = typeof value === "number" ? value + "/10" : value;
          contentHTML += "\n          <div style=\"padding: 12px; background: var(--neutral-100); border-radius: var(--radius-md);\">\n            <p style=\"margin: 0 0 6px 0; font-size: var(--body-small-size); color: var(--neutral-700);\">\n              " + this.escapeHTML(stat) + "\n            </p>\n            <p style=\"margin: 0; font-size: 18px; font-weight: 700; color: var(--brand-accent);\">\n              " + this.escapeHTML(String(displayValue)) + "\n            </p>\n          </div>\n        ";
        }
      }

      contentHTML += "\n          </div>\n        </div>\n      ";
    }

    // Add traits if available
    if (characterData.traits && characterData.traits.length > 0) {
      contentHTML += "\n        <div style=\"margin-bottom: var(--space-lg);\">\n          <h4 style=\"margin: 0 0 var(--space-md) 0; color: var(--brand-primary);\">\n            ⭐ Личные качества\n          </h4>\n          <ul style=\"margin: 0; padding: 0; list-style: none;\">\n      ";

      var j;
      for (j = 0; j < characterData.traits.length; j++) {
        var trait = characterData.traits[j];
        contentHTML += "\n          <li style=\"padding: 8px 0; padding-left: 24px; position: relative;\">\n            <span style=\"position: absolute; left: 0;\">✓</span>\n            " + this.escapeHTML(trait) + "\n          </li>\n        ";
      }

      contentHTML += "\n          </ul>\n        </div>\n      ";
    }

    contentHTML += "\n      </div>\n    ";

    modal.innerHTML = contentHTML;

    // Add to DOM
    document.body.appendChild(modal);
    this.activeModals.push(modal);
    this.modalStack.push(characterId);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Bind close handlers
    this.bindModalClose(modal);

    console.log("[Modals] Character modal opened: " + characterId);
  },

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHTML: function(text) {
    var map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  },

  /**
   * Bind modal close handlers
   * @param {HTMLElement} modal - Modal element
   */
  bindModalClose: function(modal) {
    var self = this;
    var closeButton = modal.querySelector(".modal-close");
    var overlay = modal;

    // Close button click
    if (closeButton) {
      closeButton.addEventListener("click", function(e) {
        e.stopPropagation();
        self.closeModal(modal);
      });
    }

    // Overlay click (only on background, not content)
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        self.closeModal(modal);
      }
    });

    // Focus trap - keyboard navigation
    var focusableElements = modal.querySelectorAll("button");
    if (focusableElements.length > 0) {
      focusableElements[0].focus();

      // Tab key handling for focus trap
      modal.addEventListener("keydown", function(e) {
        if (e.key === "Tab") {
          var firstElement = focusableElements[0];
          var lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    }
  },

  /**
   * Close modal
   * @param {HTMLElement} modal - Modal element
   */
  closeModal: function(modal) {
    var self = this;
    if (!modal || !modal.parentElement) return;

    // Fade out animation
    modal.style.animation = "fadeIn var(--transition-base) reverse";

    // Remove from tracking
    var index = this.activeModals.indexOf(modal);
    if (index > -1) {
      this.activeModals.splice(index, 1);
    }

    // Remove from stack
    var characterId = modal.getAttribute("data-character-id");
    if (characterId) {
      var stackIndex = this.modalStack.indexOf(characterId);
      if (stackIndex > -1) {
        this.modalStack.splice(stackIndex, 1);
      }
    }

    setTimeout(function() {
      if (modal.parentElement) {
        modal.remove();
      }

      // Restore body scroll if no modals left
      if (self.activeModals.length === 0) {
        document.body.style.overflow = "";
      }

      console.log("[Modals] Modal closed: " + characterId);
    }, 150);
  },

  /**
   * Close all modals
   */
  closeAllModals: function() {
    var modals = this.activeModals.slice();
    var i;
    for (i = 0; i < modals.length; i++) {
      this.closeModal(modals[i]);
    }
    console.log("[Modals] All modals closed");
  },

  /**
   * Get currently open modal IDs
   * @returns {array} Array of open modal character IDs
   */
  getOpenModals: function() {
    return this.modalStack.slice();
  },

  /**
   * Check if a specific character modal is open
   * @param {string} characterId - Character ID
   * @returns {boolean} True if modal is open
   */
  isModalOpen: function(characterId) {
    return this.modalStack.indexOf(characterId) !== -1;
  }
};

/**
 * Initialize modals when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  Modals.init();
});
