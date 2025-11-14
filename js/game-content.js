/**
 * Game Content Module
 * Handles game-type lessons (separate from screen-based lessons)
 * Minimal, isolated implementation to avoid breaking existing lessons
 */

var GameContent = {
  currentGame: null,
  gameContainer: null,

  /**
   * Check if this module should handle the lesson
   */
  canHandle: function(lesson) {
    return lesson && lesson.type === 'game';
  },

  /**
   * Initialize and render game lesson
   */
  render: function(lesson, container) {
    console.log("[GameContent] Rendering game lesson: " + lesson.title);

    if (!container) {
      console.error("[GameContent] No container provided");
      return false;
    }

    this.currentGame = lesson;
    this.gameContainer = container;

    // Clear container
    container.innerHTML = '';

    // Create game wrapper
    var gameWrapper = document.createElement('div');
    gameWrapper.className = 'game-wrapper';
    gameWrapper.style.cssText = 'padding: 20px; max-width: 1200px; margin: 0 auto;';

    // Create game header
    var header = document.createElement('div');
    header.className = 'game-header';
    header.style.cssText = 'margin-bottom: 30px; text-align: center;';

    var title = document.createElement('h1');
    title.textContent = lesson.title;
    title.style.cssText = 'color: var(--brand-primary); margin-bottom: 10px; font-size: 28px;';
    header.appendChild(title);

    if (lesson.description) {
      var desc = document.createElement('p');
      desc.textContent = lesson.description;
      desc.style.cssText = 'color: var(--neutral-600); font-size: 16px;';
      header.appendChild(desc);
    }

    gameWrapper.appendChild(header);

    // Create game content area
    var gameArea = document.createElement('div');
    gameArea.className = 'game-area';
    gameArea.id = 'game-area';
    gameArea.style.cssText = 'background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 400px; display: flex; align-items: center; justify-content: center;';

    // Add intro text if available
    if (lesson.content && lesson.content.introText) {
      var introContent = document.createElement('div');
      introContent.className = 'game-intro';
      introContent.style.cssText = 'text-align: center;';

      var introTitle = document.createElement('h2');
      introTitle.textContent = 'Добро пожаловать!';
      introTitle.style.cssText = 'color: var(--brand-primary); margin-bottom: 20px;';
      introContent.appendChild(introTitle);

      var introText = document.createElement('p');
      introText.innerHTML = lesson.content.introText;
      introText.style.cssText = 'color: var(--neutral-700); font-size: 16px; line-height: 1.6; margin-bottom: 30px;';
      introContent.appendChild(introText);

      // Add start game button
      var startBtn = document.createElement('button');
      startBtn.className = 'btn btn-primary';
      startBtn.textContent = 'Начать игру';
      startBtn.style.cssText = 'padding: 12px 30px; background: var(--brand-primary); color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s;';
      startBtn.onclick = function() {
        GameContent.startGame();
      };
      introContent.appendChild(startBtn);

      gameArea.appendChild(introContent);
    } else {
      // No intro text - show placeholder for game content
      var placeholder = document.createElement('p');
      placeholder.textContent = 'Игровое содержание здесь';
      placeholder.style.cssText = 'color: var(--neutral-500); font-style: italic;';
      gameArea.appendChild(placeholder);
    }

    gameWrapper.appendChild(gameArea);

    // Create navigation buttons
    var navContainer = document.createElement('div');
    navContainer.className = 'game-navigation';
    navContainer.style.cssText = 'display: flex; justify-content: space-between; margin-top: 30px; gap: 10px;';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary';
    prevBtn.textContent = '← Предыдущий урок';
    prevBtn.setAttribute('data-action', 'prev');
    prevBtn.style.cssText = 'padding: 10px 20px; border: 1px solid var(--brand-primary); color: var(--brand-primary); background: white; border-radius: 6px; font-weight: 600; cursor: pointer;';
    navContainer.appendChild(prevBtn);

    var nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Следующий урок →';
    nextBtn.setAttribute('data-action', 'next');
    nextBtn.style.cssText = 'padding: 10px 20px; background: var(--brand-primary); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-left: auto;';
    navContainer.appendChild(nextBtn);

    gameWrapper.appendChild(navContainer);

    // Add wrapper to container
    container.appendChild(gameWrapper);

    console.log("[GameContent] Game rendered successfully: " + lesson.title);
    return true;
  },

  /**
   * Start the actual game logic
   */
  startGame: function() {
    console.log("[GameContent] Starting game: " + (this.currentGame ? this.currentGame.title : 'unknown'));

    var gameArea = document.getElementById('game-area');
    if (!gameArea) {
      console.error("[GameContent] Game area not found");
      return;
    }

    // Clear intro
    gameArea.innerHTML = '';

    // Create simple game board placeholder
    var board = document.createElement('div');
    board.className = 'game-board';
    board.style.cssText = 'width: 100%; max-width: 600px; margin: 0 auto;';

    var boardTitle = document.createElement('h2');
    boardTitle.textContent = 'Планирование спринта';
    boardTitle.style.cssText = 'color: var(--brand-primary); margin-bottom: 20px; text-align: center;';
    board.appendChild(boardTitle);

    var boardContent = document.createElement('p');
    boardContent.innerHTML = 'Игровое содержание будет здесь. Это интерактивная игра для планирования и приоритизации задач.<br><br>Система готова к расширению с добавлением конкретной игровой логики.';
    boardContent.style.cssText = 'color: var(--neutral-700); font-size: 16px; line-height: 1.6; text-align: center; padding: 40px 20px; background: var(--neutral-50); border-radius: 8px;';
    board.appendChild(boardContent);

    gameArea.appendChild(board);
    console.log("[GameContent] Game board initialized");
  },

  /**
   * Get current game status
   */
  getStatus: function() {
    return {
      currentGame: this.currentGame ? this.currentGame.id : null,
      gameTitle: this.currentGame ? this.currentGame.title : null
    };
  },

  /**
   * Cleanup game resources
   */
  cleanup: function() {
    console.log("[GameContent] Cleaning up game content");
    this.currentGame = null;
    this.gameContainer = null;
  }
};

console.log("[GameContent] Module loaded");
