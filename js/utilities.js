/**
 * Utilities Module
 * Common helper functions for the course
 */

const Utilities = {
  /**
   * DOM Utilities
   */
  DOM: {
    /**
     * Query selector with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Optional context element
     * @returns {HTMLElement|null} Found element
     */
    query(selector, context = document) {
      try {
        return context.querySelector(selector);
      } catch (e) {
        console.warn("[Utilities] Error querying selector: " + selector);
        return null;
      }
    },

    /**
     * Query all matching elements
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Optional context element
     * @returns {NodeList} Found elements
     */
    queryAll(selector, context = document) {
      try {
        return context.querySelectorAll(selector);
      } catch (e) {
        console.warn("[Utilities] Error querying selector: " + selector);
        return [];
      }
    },

    /**
     * Add class to element
     * @param {HTMLElement} el - Element
     * @param {string} className - Class name
     */
    addClass(el, className) {
      if (el && className) {
        el.classList.add(className);
      }
    },

    /**
     * Remove class from element
     * @param {HTMLElement} el - Element
     * @param {string} className - Class name
     */
    removeClass(el, className) {
      if (el && className) {
        el.classList.remove(className);
      }
    },

    /**
     * Toggle class on element
     * @param {HTMLElement} el - Element
     * @param {string} className - Class name
     */
    toggleClass(el, className) {
      if (el && className) {
        el.classList.toggle(className);
      }
    },

    /**
     * Check if element has class
     * @param {HTMLElement} el - Element
     * @param {string} className - Class name
     * @returns {boolean} Has class
     */
    hasClass(el, className) {
      return el && el.classList.contains(className);
    },

    /**
     * Show element
     * @param {HTMLElement} el - Element
     */
    show(el) {
      if (el) {
        el.style.display = "";
        el.classList.remove("hidden");
      }
    },

    /**
     * Hide element
     * @param {HTMLElement} el - Element
     */
    hide(el) {
      if (el) {
        el.classList.add("hidden");
      }
    },

    /**
     * Set HTML content safely
     * @param {HTMLElement} el - Element
     * @param {string} html - HTML content
     */
    setHTML(el, html) {
      if (el) {
        el.innerHTML = html;
      }
    },

    /**
     * Set text content safely
     * @param {HTMLElement} el - Element
     * @param {string} text - Text content
     */
    setText(el, text) {
      if (el) {
        el.textContent = text;
      }
    },
  },

  /**
   * Storage Utilities
   */
  Storage: {
    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success
     */
    setItem(key, value) {
      try {
        const valueStr = typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, valueStr);
        return true;
      } catch (e) {
        console.warn("[Utilities] Error storing item: " + key);
        return false;
      }
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value
     */
    getItem(key, defaultValue = null) {
      try {
        const value = localStorage.getItem(key);
        if (!value) return defaultValue;

        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      } catch (e) {
        console.warn("[Utilities] Error retrieving item: " + key);
        return defaultValue;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success
     */
    removeItem(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn("[Utilities] Error removing item: " + key);
        return false;
      }
    },

    /**
     * Clear all items (with optional prefix)
     * @param {string} prefix - Optional prefix to match
     */
    clear(prefix = null) {
      try {
        if (!prefix) {
          localStorage.clear();
          return;
        }

        for (let key in localStorage) {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.warn("[Utilities] Error clearing storage");
      }
    },
  },

  /**
   * String Utilities
   */
  String: {
    /**
     * Capitalize string
     * @param {string} str - Input string
     * @returns {string} Capitalized string
     */
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHTML(text) {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    },

    /**
     * Truncate string
     * @param {string} text - Text to truncate
     * @param {number} length - Max length
     * @param {string} suffix - Suffix to add
     * @returns {string} Truncated text
     */
    truncate(text, length = 50, suffix = "...") {
      if (text.length <= length) return text;
      return text.substring(0, length - suffix.length) + suffix;
    },

    /**
     * Format string as percentage
     * @param {number} value - Value
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted percentage
     */
    formatPercent(value, decimals = 0) {
      return value.toFixed(decimals) + "%";
    },
  },

  /**
   * Number Utilities
   */
  Number: {
    /**
     * Format number with separators
     * @param {number} num - Number
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted number
     */
    format(num, decimals = 0) {
      return num.toLocaleString("ru-RU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },

    /**
     * Clamp number between min and max
     * @param {number} num - Number
     * @param {number} min - Minimum
     * @param {number} max - Maximum
     * @returns {number} Clamped number
     */
    clamp(num, min, max) {
      return Math.min(Math.max(num, min), max);
    },

    /**
     * Get random number
     * @param {number} min - Minimum
     * @param {number} max - Maximum
     * @returns {number} Random number
     */
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Round to nearest
     * @param {number} num - Number
     * @param {number} precision - Precision
     * @returns {number} Rounded number
     */
    round(num, precision = 0) {
      const factor = Math.pow(10, precision);
      return Math.round(num * factor) / factor;
    },
  },

  /**
   * Time Utilities
   */
  Time: {
    /**
     * Format milliseconds to HH:MM:SS
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted time
     */
    formatTime(ms) {
      const seconds = Math.floor(ms / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      const pad = (num) => (num < 10 ? "0" + num : num);
      return pad(hours) + ":" + pad(minutes) + ":" + pad(secs);
    },

    /**
     * Get current timestamp
     * @returns {number} Current timestamp in ms
     */
    now() {
      return Date.now();
    },

    /**
     * Format date for display
     * @param {Date} date - Date object
     * @returns {string} Formatted date
     */
    formatDate(date) {
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    /**
     * Get time difference in seconds
     * @param {number} startTime - Start timestamp
     * @param {number} endTime - End timestamp
     * @returns {number} Difference in seconds
     */
    getDifference(startTime, endTime) {
      return Math.floor((endTime - startTime) / 1000);
    },
  },

  /**
   * Array Utilities
   */
  Array: {
    /**
     * Shuffle array
     * @param {array} arr - Array to shuffle
     * @returns {array} Shuffled array
     */
    shuffle(arr) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    /**
     * Unique values in array
     * @param {array} arr - Input array
     * @returns {array} Unique values
     */
    unique(arr) {
      return [...new Set(arr)];
    },

    /**
     * Group array by property
     * @param {array} arr - Input array
     * @param {string} key - Property to group by
     * @returns {object} Grouped data
     */
    groupBy(arr, key) {
      return arr.reduce((acc, item) => {
        const group = item[key];
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {});
    },

    /**
     * Flatten nested array
     * @param {array} arr - Input array
     * @returns {array} Flattened array
     */
    flatten(arr) {
      return arr.reduce((flat, item) => {
        return flat.concat(Array.isArray(item) ? this.flatten(item) : item);
      }, []);
    },
  },

  /**
   * Event Utilities
   */
  Event: {
    /**
     * Debounce function
     * @param {function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {function} Debounced function
     */
    debounce(func, wait = 300) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function
     * @param {function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {function} Throttled function
     */
    throttle(func, limit = 300) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    /**
     * Once function (call only once)
     * @param {function} func - Function to call once
     * @returns {function} Wrapped function
     */
    once(func) {
      let called = false;
      let result;
      return function (...args) {
        if (!called) {
          called = true;
          result = func.apply(this, args);
        }
        return result;
      };
    },
  },

  /**
   * Validation Utilities
   */
  Validate: {
    /**
     * Is email valid
     * @param {string} email - Email address
     * @returns {boolean} Is valid
     */
    isEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    /**
     * Is URL valid
     * @param {string} url - URL
     * @returns {boolean} Is valid
     */
    isURL(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Is empty
     * @param {*} value - Value to check
     * @returns {boolean} Is empty
     */
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0)
      );
    },

    /**
     * Has required fields
     * @param {object} obj - Object to validate
     * @param {array} fields - Required fields
     * @returns {boolean} Has all required fields
     */
    hasRequired(obj, fields) {
      return fields.every((field) => !this.isEmpty(obj[field]));
    },
  },

  /**
   * Logger Utility
   */
  log: {
    /**
     * Log info message
     * @param {string} message - Message
     * @param {*} data - Optional data
     */
    info(message, data = null) {
      console.log("[Info] " + message, data || "");
    },

    /**
     * Log warning message
     * @param {string} message - Message
     * @param {*} data - Optional data
     */
    warn(message, data = null) {
      console.warn("[Warning] " + message, data || "");
    },

    /**
     * Log error message
     * @param {string} message - Message
     * @param {*} data - Optional data
     */
    error(message, data = null) {
      console.error("[Error] " + message, data || "");
    },

    /**
     * Log debug message
     * @param {string} message - Message
     * @param {*} data - Optional data
     */
    debug(message, data = null) {
      if (window.DEBUG) {
        console.debug("[Debug] " + message, data || "");
      }
    },
  },
};

// Export for global use
if (typeof module !== "undefined" && module.exports) {
  module.exports = Utilities;
}

console.log("[Utilities] Module loaded successfully");
