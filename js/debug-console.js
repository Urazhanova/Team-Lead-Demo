/**
 * Debug Console - Shows logs on page
 * Displays console messages directly on the webpage
 */

var DebugConsole = {
  logs: [],
  isVisible: false,
  container: null,

  /**
   * Initialize debug console
   */
  init: function() {
    // Create debug console container
    var html = '<div id="debug-console-panel" style="' +
      'position: fixed; ' +
      'bottom: 0; ' +
      'right: 0; ' +
      'width: 400px; ' +
      'max-height: 300px; ' +
      'background: #1e1e1e; ' +
      'color: #00ff00; ' +
      'border: 2px solid #00ff00; ' +
      'border-radius: 8px; ' +
      'overflow-y: auto; ' +
      'z-index: 99999; ' +
      'font-family: monospace; ' +
      'font-size: 11px; ' +
      'padding: 10px; ' +
      'display: none; ' +
      'box-shadow: 0 0 10px rgba(0,255,0,0.3); ' +
      '">' +
      '<div style="margin-bottom: 10px; font-weight: bold; color: #ffff00;">DEBUG CONSOLE</div>' +
      '<div id="debug-logs" style="max-height: 270px; overflow-y: auto;"></div>' +
      '</div>';

    // Create toggle button
    var toggleBtn = '<button id="debug-toggle-btn" style="' +
      'position: fixed; ' +
      'bottom: 20px; ' +
      'right: 20px; ' +
      'width: 60px; ' +
      'height: 60px; ' +
      'background: #00ff00; ' +
      'color: #000; ' +
      'border: none; ' +
      'border-radius: 50%; ' +
      'cursor: pointer; ' +
      'z-index: 99998; ' +
      'font-weight: bold; ' +
      'font-size: 24px; ' +
      'box-shadow: 0 0 10px rgba(0,255,0,0.5); ' +
      '">🐛</button>';

    // Add to page
    document.body.insertAdjacentHTML('beforeend', html + toggleBtn);

    this.container = document.getElementById('debug-console-panel');
    var toggleButton = document.getElementById('debug-toggle-btn');

    // Add event listener
    if (toggleButton) {
      toggleButton.addEventListener('click', this.toggle.bind(this));
    }

    // Intercept console.log
    var self = this;
    var originalLog = console.log;
    console.log = function() {
      originalLog.apply(console, arguments);
      var message = Array.from(arguments).join(' ');
      self.addLog(message, 'log');
    };

    // Intercept console.error
    var originalError = console.error;
    console.error = function() {
      originalError.apply(console, arguments);
      var message = Array.from(arguments).join(' ');
      self.addLog(message, 'error');
    };

    // Intercept console.warn
    var originalWarn = console.warn;
    console.warn = function() {
      originalWarn.apply(console, arguments);
      var message = Array.from(arguments).join(' ');
      self.addLog(message, 'warn');
    };

    console.log('[DebugConsole] Initialized - click the bug icon to toggle');
  },

  /**
   * Add log message
   */
  addLog: function(message, type) {
    var timestamp = new Date().toLocaleTimeString();
    var color = '#00ff00';
    var prefix = '✓';

    if (type === 'error') {
      color = '#ff0000';
      prefix = '✗';
    } else if (type === 'warn') {
      color = '#ffff00';
      prefix = '⚠';
    }

    var logDiv = document.createElement('div');
    logDiv.style.color = color;
    logDiv.style.marginBottom = '4px';
    logDiv.style.wordWrap = 'break-word';
    logDiv.textContent = prefix + ' [' + timestamp + '] ' + message;

    var logsContainer = document.getElementById('debug-logs');
    if (logsContainer) {
      logsContainer.appendChild(logDiv);
      // Auto-scroll to bottom
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    this.logs.push({ timestamp: timestamp, message: message, type: type });
  },

  /**
   * Toggle console visibility
   */
  toggle: function() {
    if (this.container) {
      this.isVisible = !this.isVisible;
      this.container.style.display = this.isVisible ? 'block' : 'none';
    }
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    DebugConsole.init();
  });
} else {
  DebugConsole.init();
}
