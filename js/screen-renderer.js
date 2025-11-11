/**
 * Screen Renderer Module
 * Dynamically generates screens from lessons.json
 */

var ScreenRenderer = {
  /**
   * Render a single screen based on type
   * @param {object} screen - Screen data from lessons.json
   * @param {object} lesson - Parent lesson data
   * @returns {HTMLElement} Rendered screen element
   */
  renderScreen: function(screen, lesson) {
    lesson = lesson || {};
    var screenEl = document.createElement('div');
    screenEl.className = 'screen';
    screenEl.setAttribute('data-type', screen.type);
    screenEl.setAttribute('data-lesson', lesson.id || '0');
    screenEl.setAttribute('data-screen', screen.id || '0');
    screenEl.id = 'screen-' + screen.id;

    // Start with hidden state if not first screen
    if (screen.id !== 1) {
      screenEl.classList.add('hidden');
    }

    // Render based on type
    var content = this.renderScreenContent(screen, screen.type);
    screenEl.appendChild(content);

    // Add navigation if exists
    if (screen.navigation) {
      screenEl.appendChild(this.renderNavigation(screen.navigation));
    }

    return screenEl;
  },

  /**
   * Render screen content based on type
   * @param {object} screen - Screen data
   * @param {string} type - Screen type
   * @returns {HTMLElement} Content element
   */
  renderScreenContent: function(screen, type) {
    var content = screen.content || {};

    switch (type) {
      case 'intro':
        return this.renderIntroScreen(content);
      case 'story':
        return this.renderStoryScreen(content);
      case 'character_card':
        return this.renderCharacterCardScreen(content);
      case 'progress_showcase':
        return this.renderProgressScreen(content);
      case 'progress':
        return this.renderProgressScreen(content);
      case 'content':
        return this.renderContentScreen(content);
      case 'timeline_structure':
        return this.renderTimelineScreen(content);
      case 'cta_final':
        return this.renderCtaScreen(content);
      case 'quiz':
        return this.renderQuizScreen(screen);
      case 'interactive_modal':
        return this.renderInteractiveModalScreen(content);
      case 'interactive_dragdrop':
        return this.renderDragDropScreen(content);
      case 'interactive_choice':
        return this.renderInteractiveChoiceScreen(content);
      case 'interactive_result':
        return this.renderInteractiveResultScreen(content);
      case 'celebration':
        return this.renderCelebrationScreen(content);
      case 'interactive_carousel':
        return this.renderInteractiveCarouselScreen(content);
      case 'interactive_accordion':
        return this.renderInteractiveAccordionScreen(content);
      case 'dialogue':
        return this.renderDialogueScreen(content);
      default:
        return this.renderDefaultScreen(content);
    }
  },

  /**
   * Render intro screen
   */
  renderIntroScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="content-left">' +
      '<h2>' + (content.title || 'Welcome') + '</h2>' +
      (content.subtitle ? '<h3 class="intro-subtitle">' + content.subtitle + '</h3>' : '') +
      '<p class="intro-text">' +
        (content.text || '') +
      '</p>' +
      (content.icon ? '<div class="intro-icon">' + content.icon + '</div>' : '') +
      '</div>' +
      '<div class="content-right">' +
        (content.image ? '<img src="' + content.image + '" alt="Content" class="character-image" loading="lazy">' : '') +
      '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render story screen
   */
  renderStoryScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="content-left">' +
      (content.greeting ? '<h1 class="story-greeting">' + content.greeting + '</h1>' : '') +
      '<h2>' + (content.title || '') + '</h2>' +
      (content.text ? '<p class="story-text">' + content.text + '</p>' : '');

    if (content.questions && content.questions.length > 0) {
      html += '<ul class="story-questions">';
      for (var i = 0; i < content.questions.length; i++) {
        html += '<li>' + content.questions[i] + '</li>';
      }
      html += '</ul>';
    }

    if (content.cta) {
      html += '<div class="story-cta-box">' +
        '<p class="text-secondary font-semibold">' + content.cta + '</p>' +
        '</div>';
    }

    html += '</div>' +
      '<div class="content-right">' +
        (content.image ? '<img src="' + content.image + '" alt="Story" class="character-image" loading="lazy">' : '') +
      '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render character card screen
   */
  renderCharacterCardScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-text';

    var html = '<h2>' + (content.title || 'Characters') + '</h2>' +
      (content.subtitle ? '<h3 class="character-subtitle">' + content.subtitle + '</h3>' : '') +
      (content.intro ? '<p class="character-intro">' + content.intro + '</p>' : '') +
      '<div class="character-grid">';

    if (content.characters && content.characters.length > 0) {
      for (var idx = 0; idx < content.characters.length; idx++) {
        var char = content.characters[idx];
        html += '<div class="character-card">' +
          (char.image ? '<img src="' + char.image + '" alt="' + char.name + '" class="character-card-image">' : '') +
          '<div class="character-card-name">' + char.name + '</div>' +
          '<div class="character-card-position">' + char.age + ' лет • ' + char.position + '</div>' +
          '<p class="character-card-description">' + char.description + '</p>' +
          '<div class="character-card-personality">' +
            '<strong>Характер:</strong> ' + char.personality +
          '</div>' +
          '<button class="btn btn-outline character-card-btn" data-character-modal="' + idx + '">' +
            'Узнать больше' +
          '</button>' +
          '</div>';
      }
    }

    html += '</div>';
    card.innerHTML = html;

    // Bind character modal buttons
    setTimeout(function() {
      var buttons = card.querySelectorAll('[data-character-modal]');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
          e.preventDefault();
          var idx = parseInt(this.getAttribute('data-character-modal'));
          var char = content.characters[idx];
          ScreenRenderer.showCharacterModal(char);
        });
      }
    }, 0);

    return card;
  },

  /**
   * Show character modal
   */
  showCharacterModal: function(character) {
    var modal = document.createElement('div');
    modal.className = 'modal-overlay';

    var html = '<div class="modal-content" style="max-width: 500px;">' +
      '<button class="modal-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--neutral-700);">&times;</button>' +
      '<h2 style="color: var(--brand-primary); margin-bottom: var(--space-sm);">' + character.name + '</h2>' +
      '<div style="font-size: 12px; color: var(--brand-secondary); font-weight: 600; margin-bottom: var(--space-md);">' +
        character.age + ' лет • ' + character.position +
      '</div>' +
      '<div style="background: var(--neutral-50); padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-md);">' +
        '<p style="margin-bottom: var(--space-sm);">' + character.description + '</p>' +
      '</div>' +
      '<div style="margin-bottom: var(--space-md);">' +
        '<strong style="display: block; color: var(--brand-primary); margin-bottom: 8px;">Сильные стороны:</strong>' +
        '<p>' + (character.strengths || '') + '</p>' +
      '</div>' +
      '<div style="margin-bottom: var(--space-md);">' +
        '<strong style="display: block; color: var(--brand-primary); margin-bottom: 8px;">Вызовы:</strong>' +
        '<p>' + (character.challenges || '') + '</p>' +
      '</div>' +
      '<div style="background: rgba(22, 63, 111, 0.05); padding: var(--space-md); border-radius: var(--radius-md);">' +
        '<strong style="display: block; color: var(--brand-primary); margin-bottom: 8px;">💡 Совет для руководителя:</strong>' +
        '<p>' + (character.managementTip || '') + '</p>' +
      '</div>' +
      '</div>';

    modal.innerHTML = html;
    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.modal-close').addEventListener('click', function() {
      modal.remove();
    });

    // Click outside to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },

  /**
   * Render progress/skills screen
   */
  renderProgressScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="content-left">' +
      '<h2>' + (content.title || 'Skills') + '</h2>' +
      (content.subtitle ? '<p style="margin-bottom: var(--space-lg);">' + content.subtitle + '</p>' : '');

    if (content.skills && content.skills.length > 0) {
      for (var i = 0; i < content.skills.length; i++) {
        var skill = content.skills[i];
        var percent = (skill.current / skill.max) * 100;
        html += '<div class="skill-progress">' +
          '<span class="skill-label">' + skill.name + '</span>' +
          '<div class="skill-bar">' +
            '<div class="skill-bar-fill" style="width: ' + percent + '%"></div>' +
          '</div>' +
          '<span class="skill-score">' + skill.current + '/' + skill.max + '</span>' +
          '</div>';
      }
    }

    html += '</div>' +
      '<div class="content-right">' +
        (content.image ? '<img src="' + content.image + '" alt="Progress" class="character-image" loading="lazy">' : '') +
      '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render content screen (with sections)
   */
  renderContentScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-text';

    var html = '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: var(--space-lg);">' + content.subtitle + '</h3>' : '');

    // Add definition if present
    if (content.definition) {
      html += '<div style="background: var(--neutral-50); padding: var(--space-md); border-radius: var(--radius-md); border-left: 4px solid var(--brand-accent); margin-bottom: var(--space-lg);">' +
        '<p style="font-size: 15px; color: var(--neutral-800); line-height: 1.6; margin: 0;">' + content.definition + '</p>' +
      '</div>';
    }

    // Add notIsThis section if present
    if (content.notIsThis && content.notIsThis.length > 0) {
      html += '<div style="margin-bottom: var(--space-lg);">' +
        '<h3 style="color: var(--brand-primary); margin-bottom: var(--space-md); font-size: 16px;">Это НЕ обратная связь:</h3>';
      for (var ni = 0; ni < content.notIsThis.length; ni++) {
        html += '<p style="font-size: 14px; color: var(--neutral-700); margin-bottom: 8px;">' + content.notIsThis[ni] + '</p>';
      }
      html += '</div>';
    }

    // Add goodExample if present
    if (content.goodExample) {
      html += '<div style="background: #E8F5E9; padding: var(--space-md); border-radius: var(--radius-md); border-left: 4px solid #4CAF50; margin-bottom: var(--space-lg);">' +
        '<h3 style="color: #2E7D32; margin-top: 0; margin-bottom: var(--space-sm); font-size: 16px;">Пример правильной обратной связи:</h3>' +
        '<p style="font-size: 14px; color: #1B5E20; margin: 0; line-height: 1.6;">' + content.goodExample + '</p>' +
      '</div>';
    }

    // Add types section if present
    if (content.types && content.types.length > 0) {
      html += '<div style="margin-bottom: var(--space-lg);">' +
        '<h3 style="color: var(--brand-primary); margin-bottom: var(--space-md); font-size: 16px;">Типы обратной связи:</h3>' +
        '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-lg);">';
      for (var ti = 0; ti < content.types.length; ti++) {
        var typeItem = content.types[ti];
        html += '<div style="background: var(--neutral-50); padding: var(--space-md); border-radius: var(--radius-md); border-top: 4px solid var(--brand-accent);">' +
          '<h4 style="color: var(--brand-primary); margin-top: 0; margin-bottom: var(--space-sm); font-size: 15px;">' + typeItem.type + '</h4>' +
          '<p style="font-size: 14px; color: var(--neutral-700); margin: 0;">' + typeItem.description + '</p>' +
        '</div>';
      }
      html += '</div></div>';
    }

    // Support both 'sections' and 'rules' formats (fallback)
    var items = content.sections || content.rules || [];

    if (items && items.length > 0) {
      html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-lg); margin-top: var(--space-lg);">';

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var bgColor = item.backgroundColor || 'var(--neutral-50)';
        html += '<div style="background: ' + bgColor + '; padding: var(--space-md); border-radius: var(--radius-md); border-top: 4px solid var(--brand-accent);">' +
          (item.icon ? '<div style="font-size: 32px; margin-bottom: var(--space-sm);">' + item.icon + '</div>' : '') +
          '<h3 style="color: var(--brand-primary); margin-bottom: var(--space-sm); font-size: 16px;">' + item.title + '</h3>';

        // Add description/text if present
        if (item.text || item.description) {
          html += '<p style="font-size: 14px; color: var(--neutral-700); margin-bottom: var(--space-sm);">' + (item.text || item.description || '') + '</p>';
        }

        // Add list items if present
        if (item.items && item.items.length > 0) {
          html += '<ul style="margin: 0; padding-left: 20px; font-size: 14px; color: var(--neutral-700);">';
          for (var j = 0; j < item.items.length; j++) {
            html += '<li style="margin-bottom: 8px;">' + item.items[j] + '</li>';
          }
          html += '</ul>';
        }

        html += '</div>';
      }

      html += '</div>';
    }

    card.innerHTML = html;
    return card;
  },

  /**
   * Render timeline/structure screen
   */
  renderTimelineScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-text';

    var html = '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: var(--space-md);">' + content.subtitle + '</h3>' : '') +
      (content.description ? '<p style="margin-bottom: var(--space-lg); color: var(--neutral-700);">' + content.description + '</p>' : '') +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-top: var(--space-lg);">';

    if (content.lessons && content.lessons.length > 0) {
      for (var i = 0; i < content.lessons.length; i++) {
        var lesson = content.lessons[i];
        html += '<div style="background: linear-gradient(135deg, rgba(22, 63, 111, 0.08), rgba(123, 104, 238, 0.08)); color: var(--brand-primary); padding: var(--space-md); border-radius: var(--radius-md); border-left: 4px solid var(--brand-accent);">' +
          '<div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: var(--brand-accent);">' + lesson.number + '</div>' +
          '<h4 style="margin: 0 0 var(--space-sm) 0; font-size: 14px; font-weight: 600; color: var(--brand-primary);">' + lesson.title + '</h4>' +
          '<p style="font-size: 12px; margin: 0; color: var(--neutral-700);">' + lesson.description + '</p>' +
          '</div>';
      }
    }

    html += '</div>';
    card.innerHTML = html;
    return card;
  },

  /**
   * Render CTA (call to action) screen
   */
  renderCtaScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="content-left" style="display: flex; flex-direction: column; justify-content: center;">' +
      '<h2 style="color: var(--brand-primary); margin-bottom: var(--space-md);">' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: var(--space-md);">' + content.subtitle + '</h3>' : '') +
      '<p style="font-size: var(--body-large-size); margin-bottom: var(--space-lg);">' + (content.text || '') + '</p>';

    if (content.points && content.points.length > 0) {
      html += '<ul style="margin: var(--space-lg) 0; padding-left: 0;">';
      for (var i = 0; i < content.points.length; i++) {
        html += '<li style="margin-bottom: var(--space-sm); font-size: 16px; font-weight: 500;">' + content.points[i] + '</li>';
      }
      html += '</ul>';
    }

    // Add CTA button if provided
    if (content.buttonText) {
      html += '<div style="margin-top: var(--space-xl); display: flex; gap: var(--space-md);">' +
        '<button class="btn btn-primary" data-action="cta-button" style="flex: 1;">' +
          content.buttonText +
        '</button>' +
      '</div>';
    }

    html += '</div>' +
      '<div class="content-right" style="display: flex; align-items: center; justify-content: center;">' +
        (content.image ? '<img src="' + content.image + '" alt="CTA" style="width: 100%; max-width: 400px; height: auto; border-radius: var(--radius-lg);" loading="lazy">' : '<div style="text-align: center;"><div style="font-size: 96px; margin-bottom: var(--space-lg);">🚀</div></div>') +
      '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render quiz screen
   */
  renderQuizScreen: function(screen) {
    var card = document.createElement('div');
    card.className = 'card card-quiz';

    var content = screen.content || screen;

    var html = '<div class="quiz-container">';

    // Add title if present
    if (content.title) {
      html += '<h2 style="margin-bottom: var(--space-lg); color: var(--brand-primary);">' + content.title + '</h2>';
    }

    // Check if this is a multi-question quiz or single question
    var questions = content.questions || [];

    if (questions.length > 0) {
      // Multi-question quiz format
      html += '<div style="display: flex; flex-direction: column; gap: var(--space-lg);">';

      for (var q = 0; q < questions.length; q++) {
        var question = questions[q];
        var questionId = 'quiz-' + screen.id + '-q' + question.id;

        html += '<div style="padding: var(--space-md); background: var(--neutral-50); border-radius: var(--radius-md); border-left: 4px solid var(--brand-accent);">' +
          '<h4 style="margin-top: 0; margin-bottom: var(--space-md); color: var(--brand-primary);">' +
            (q + 1) + '. ' + question.question +
          '</h4>' +
          '<div class="quiz-options" style="display: flex; flex-direction: column; gap: 12px;">';

        if (question.options && question.options.length > 0) {
          for (var i = 0; i < question.options.length; i++) {
            var option = question.options[i];
            var isCorrect = (i === question.correct);
            html += '<label class="answer-option" style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">' +
              '<input type="radio" name="' + questionId + '" value="' + i + '" data-correct="' + isCorrect + '" style="margin-right: 8px; cursor: pointer;">' +
              '<span>' + option + '</span>' +
              '</label>';
          }
        }

        html += '</div></div>';
      }

      html += '</div>';

      html += '<button class="btn btn-primary" data-action="check" style="width: 100%; margin-top: var(--space-lg);" aria-label="Проверить ответ">' +
        'Проверить ответ' +
      '</button>';
    } else {
      // Old single-question format (for backwards compatibility)
      html += '<h3 class="quiz-question">' + (content.question || '') + '</h3>' +
        '<div class="quiz-options">';

      if (content.options && content.options.length > 0) {
        for (var i = 0; i < content.options.length; i++) {
          var option = content.options[i];
          html += '<label class="answer-option">' +
            '<input type="radio" name="quiz-' + screen.id + '" value="' + option.id + '" data-correct="' + option.correct + '">' +
            '<span>' + option.text + '</span>' +
            '</label>';
        }
      }

      html += '</div>' +
        '<button class="btn btn-primary mt-6" data-action="check" aria-label="Проверить ответ">' +
          'Проверить ответ' +
        '</button>';
    }

    html += '<div class="feedback-container"></div></div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render default/unknown screen type
   */
  renderDefaultScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-text';
    card.innerHTML = '<h2>' + (content.title || 'Screen') + '</h2>' +
      '<p>' + (content.text || JSON.stringify(content)) + '</p>';
    return card;
  },

  /**
   * Render navigation buttons
   */
  renderNavigation: function(navConfig) {
    var nav = document.createElement('div');
    nav.className = 'navigation';

    var html = '';

    if (navConfig.prev !== false) {
      html += '<button class="btn btn-secondary" data-action="prev" aria-label="Предыдущий экран">' +
        '← Назад' +
        '</button>';
    }

    if (navConfig.next !== false) {
      // Check if this is an interactive modal screen that requires all blocks to be studied
      var nextBtnDisabled = '';
      if (navConfig.requireAllBlocks) {
        nextBtnDisabled = ' disabled style="opacity: 0.5; cursor: not-allowed;"';
      }
      html += '<button class="btn btn-primary" data-action="next" aria-label="Следующий экран"' + nextBtnDisabled + '>' +
        'Далее →' +
        '</button>';
    }

    nav.innerHTML = html;
    return nav;
  },

  /**
   * Render interactive modal screen (SBI model)
   */
  renderInteractiveModalScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    // Store content data for modal handler
    card.__lessonData = content;

    var html = '<div class="content-left">' +
      '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: 16px;">' + content.subtitle + '</h3>' : '') +
      (content.intro ? '<p style="margin-bottom: 24px;">' + content.intro + '</p>' : '');

    // Render blocks
    if (content.blocks && content.blocks.length > 0) {
      html += '<div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">';
      for (var i = 0; i < content.blocks.length; i++) {
        var block = content.blocks[i];
        html += '<button class="interactive-block" style="flex: 1; min-width: 120px; padding: 20px; border-radius: 8px; border: 2px solid ' + block.borderColor + '; background: ' + block.color + '; cursor: pointer; font-weight: bold; color: ' + block.textColor + ';" data-block-id="' + block.id + '">' +
          block.label +
        '</button>';
      }
      html += '</div>';
    }

    if (content.progressText) {
      html += '<p style="text-align: center; color: var(--brand-secondary); margin-top: 16px;">' + content.progressText + ': <strong id="progress-counter">0/' + (content.blocks ? content.blocks.length : 0) + '</strong></p>';
    }

    html += '</div>' +
      '<div class="content-right" style="display: flex; align-items: center; justify-content: center;">' +
        (content.image ? '<img src="' + content.image + '" alt="Content" style="max-width: 100%; height: auto;">' : '') +
      '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render drag and drop screen
   */
  renderDragDropScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    // Store drag-drop data for validation
    card.__dragDropData = content;

    // Use a wrapper div to span both columns
    var html = '<div style="grid-column: 1 / -1; width: 100%;" class="dragdrop-container">' +
      '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: 16px;">' + content.subtitle + '</h3>' : '') +
      '<p style="margin-bottom: 24px;">' + (content.instruction || '') + '</p>' +
      '<div style="background: ' + (content.backgroundColor || '#FFF9E6') + '; padding: 20px; border-radius: 8px; margin-bottom: 24px;">' +
        '<h4 style="margin-bottom: 12px;">Карточки для перетаскивания:</h4>' +
        '<div style="display: flex; gap: 12px; flex-wrap: wrap;" id="drag-cards">';

    if (content.cards && content.cards.length > 0) {
      for (var i = 0; i < content.cards.length; i++) {
        var card_item = content.cards[i];
        html += '<div class="drag-card" draggable="true" data-card-id="' + card_item.id + '" style="flex: 1; min-width: 100px; padding: 16px; background: white; border: 2px solid var(--brand-secondary); border-radius: 6px; cursor: move; font-size: 14px;">' +
          card_item.content +
        '</div>';
      }
    }

    html += '</div></div>' +
      '<div style="grid-column: 1 / -1; width: 100%; display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;" id="drop-slots">';

    if (content.slots && content.slots.length > 0) {
      for (var j = 0; j < content.slots.length; j++) {
        var slot = content.slots[j];
        html += '<div class="drop-slot" data-slot-id="' + slot.id + '" data-border-color="' + slot.borderColor + '" style="flex: 1; min-width: 100px; padding: 16px; border: 3px dashed ' + slot.borderColor + '; border-radius: 6px; text-align: center; min-height: 80px; display: flex; align-items: center; justify-content: center; color: ' + slot.borderColor + '; font-weight: bold; font-size: 13px;">' +
          slot.label +
        '</div>';
      }
    }

    html += '</div>' +
      '<div style="grid-column: 1 / -1; width: 100%;">' +
      '<button type="button" class="btn btn-primary" data-action="check-dragdrop" style="width: 100%; margin-top: 16px; padding: 16px;">Проверить</button>' +
      '</div></div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render interactive choice screen
   */
  renderInteractiveChoiceScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    // Left column with content
    var html = '<div class="content-left">' +
      '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: 16px;">' + content.subtitle + '</h3>' : '') +
      '<div style="background: rgba(123, 104, 238, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 24px;">' +
        '<p>' + (content.situation || '') + '</p>' +
      '</div>' +
      '<div style="display: flex; flex-direction: column; gap: 12px;" id="choice-buttons">';

    if (content.choices && content.choices.length > 0) {
      for (var i = 0; i < content.choices.length; i++) {
        var choice = content.choices[i];
        html += '<button class="choice-btn" data-choice-id="' + choice.id + '" style="padding: 16px; border: 2px solid var(--brand-secondary); border-radius: 6px; background: white; cursor: pointer; text-align: left;">' +
          '<strong>' + choice.label + '</strong><br>' +
          '<small>' + choice.text + '</small>' +
        '</button>';
      }
    }

    html += '</div>' +
      '</div>' +
      '<div class="content-right" style="display: flex; align-items: center; justify-content: center;">' +
        (content.image ? '<img src="' + content.image + '" alt="Choice" style="max-width: 100%; height: auto;">' : '') +
      '</div>';

    card.innerHTML = html;

    // Store choice data for interactive feedback
    card.__interactiveChoiceData = {
      title: content.title,
      situation: content.situation,
      choices: content.choices || []
    };

    return card;
  },

  /**
   * Render interactive result screen
   */
  renderInteractiveResultScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="result-container">' +
      '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: 16px;">' + content.subtitle + '</h3>' : '') +
      '<p>Результаты вашего выбора...</p>';

    if (content.accordion) {
      html += '<div style="margin-top: 24px; border-top: 1px solid #ddd; padding-top: 16px;">' +
        '<button class="accordion-toggle" style="width: 100%; text-align: left; padding: 12px; background: none; border: none; cursor: pointer; font-weight: bold;">' +
          content.accordion.title +
        '</button>' +
        '<div class="accordion-content" style="display: none; padding: 12px 0;">' +
          '<p>' + content.accordion.description + '</p>' +
        '</div>' +
      '</div>';
    }

    html += '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render celebration screen
   */
  renderCelebrationScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    // Left content column
    var html = '<div class="content-left">' +
      '<h2>' + (content.title || '🎉 УРОК ПРОЙДЕН!') + '</h2>';

    // Skills with same style as progress_showcase
    if (content.skills && content.skills.length > 0) {
      for (var i = 0; i < content.skills.length; i++) {
        var skill = content.skills[i];
        var percent = (skill.to / 10) * 100;
        html += '<div class="skill-progress">' +
          '<span class="skill-label">' + skill.name + '</span>' +
          '<div class="skill-bar">' +
            '<div class="skill-bar-fill" style="width: ' + percent + '%"></div>' +
          '</div>' +
          '<span class="skill-score">' + skill.to + '/10</span>' +
          '</div>';
      }
    }

    // Achievements below skills
    if (content.achievements && content.achievements.length > 0) {
      html += '<div style="margin-top: var(--space-xl);">' +
        '<h4 style="margin: 0 0 var(--space-md) 0; color: var(--brand-primary); font-size: 16px; font-weight: 600;">Достижения:</h4>';
      for (var j = 0; j < content.achievements.length; j++) {
        var achievement = content.achievements[j];
        html += '<div style="padding: 12px; background: rgba(76, 175, 80, 0.1); border-radius: 6px; margin-bottom: 12px; border-left: 4px solid #4CAF50;">' +
          '<div style="display: flex; align-items: flex-start; gap: 8px;">' +
            '<span style="font-size: 20px; min-width: 24px; text-align: center;">' + achievement.icon + '</span>' +
            '<div>' +
              '<strong style="color: var(--brand-primary); display: block; margin-bottom: 2px; font-size: 14px;">' + achievement.name + '</strong>' +
              '<small style="color: var(--neutral-700); font-size: 12px;">' + achievement.description + '</small>' +
            '</div>' +
          '</div>' +
        '</div>';
      }
      html += '</div>';
    }

    html += '</div>' +
      '<div class="content-right" style="display: flex; align-items: flex-start; justify-content: center;">' +
        (content.image ? '<img src="' + content.image + '" alt="Celebration" class="character-image" loading="lazy">' : '') +
      '</div>';

    card.innerHTML = html;
    return card;
  },

  /**
   * Render interactive carousel screen (character cards with flip animation)
   */
  renderInteractiveCarouselScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    // Two-column layout
    var html = '<div style="display: flex; gap: 24px; align-items: flex-start;">' +
      '<div class="carousel-container" style="flex: 1;">' +
        '<h2>' + (content.title || '') + '</h2>' +
        (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: 24px;">' + content.subtitle + '</h3>' : '') +
        '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">' +
          '<button class="carousel-prev" style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: var(--brand-secondary); color: white; border: none; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">‹</button>' +
          '<div style="display: flex; gap: 16px; overflow-x: auto; padding: 16px 0; flex: 1; scroll-behavior: smooth;" class="carousel-track">';

    // Render character cards
    if (content.characters && content.characters.length > 0) {
      for (var i = 0; i < content.characters.length; i++) {
        var char = content.characters[i];
        html += '<div class="carousel-card" data-char-id="' + char.id + '" style="flex: 0 0 200px; min-width: 200px; height: 280px; perspective: 1000px; cursor: pointer;">' +
          '<div class="card-inner" style="position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d;">' +
            // Front side
            '<div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
              (char.avatar ? '<img src="' + char.avatar + '" alt="' + char.name + '" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 12px; object-fit: cover;">' : '<div style="width: 80px; height: 80px; border-radius: 50%; background: var(--neutral-200); margin-bottom: 12px;"></div>') +
              '<h4 style="margin: 0 0 4px 0; color: var(--brand-primary); font-size: 14px; text-align: center;">' + char.name + '</h4>' +
              '<p style="margin: 0; color: var(--neutral-600); font-size: 12px; text-align: center;">' + char.position + '</p>' +
              '<div style="position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: var(--brand-secondary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; animation: pulse 2s infinite; font-size: 14px;">?</div>' +
            '</div>' +
            // Back side
            '<div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, #7B68EE 0%, #FF9800 100%); border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: rotateY(180deg); display: flex; flex-direction: column; justify-content: space-between; color: white; overflow-y: auto; font-size: 11px;">' +
              '<div>' +
                '<h4 style="margin: 0 0 4px 0; font-size: 13px;">' + char.name + '</h4>' +
                '<p style="margin: 0 0 6px 0; font-size: 10px; opacity: 0.9;">' + char.position + ', ' + (char.age || '') + ' лет</p>' +
                (char.back && char.back.character ? '<p style="margin: 0 0 6px 0; font-size: 10px;"><strong>Характер:</strong> ' + char.back.character + '</p>' : '') +
                (char.back && char.back.strengths && char.back.strengths.length ? '<p style="margin: 0 0 4px 0; font-size: 10px;"><strong>Сильные:</strong></p><ul style="margin: 0; padding-left: 12px; font-size: 9px;">' +
                  char.back.strengths.map(s => '<li style="margin-bottom: 2px;">' + s + '</li>').join('') +
                '</ul>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }
    }

    html += '</div>' +
          '<button class="carousel-next" style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: var(--brand-secondary); color: white; border: none; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">›</button>' +
        '</div>' +
        '<p style="text-align: center; color: var(--brand-secondary); margin-bottom: 16px;">' + (content.progressText || 'Изучено') + ': <strong id="carousel-progress">0/' + (content.characters ? content.characters.length : 0) + '</strong></p>' +
      '</div>';

    // Right column: Image (if provided)
    if (content.image) {
      html += '<div style="flex: 0 0 280px; text-align: center;">' +
        '<img src="' + content.image + '" alt="Team" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">' +
      '</div>';
    }

    html += '</div>';

    card.innerHTML = html;
    card.__carouselData = {
      characters: content.characters || [],
      progressText: content.progressText || 'Изучено'
    };

    return card;
  },

  /**
   * Render interactive accordion screen (expandable sections)
   */
  renderInteractiveAccordionScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="accordion-container">' +
      '<h2>' + (content.title || '') + '</h2>' +
      (content.subtitle ? '<h3 style="color: var(--brand-secondary); margin-bottom: 24px;">' + content.subtitle + '</h3>' : '') +
      '<div>';

    // Render accordion sections
    if (content.sections && content.sections.length > 0) {
      for (var s = 0; s < content.sections.length; s++) {
        var section = content.sections[s];
        html += '<div class="accordion-section" data-section-id="' + section.id + '" style="margin-bottom: 12px; border: 1px solid var(--neutral-200); border-radius: 8px; overflow: hidden;">' +
          '<div class="accordion-header" style="background: var(--neutral-50); padding: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; transition: background 0.2s;">' +
            '<h4 style="margin: 0; color: var(--brand-primary); font-size: 15px; font-weight: 600;">' + (section.emoji ? section.emoji + ' ' : '') + section.title + '</h4>' +
            '<span style="font-size: 16px; transition: transform 0.3s;" class="accordion-arrow">▼</span>' +
          '</div>' +
          '<div class="accordion-content" style="padding: 16px; display: none; background: white;">' +
            '<ul style="margin: 0; padding-left: 20px;">';

        if (section.items && section.items.length > 0) {
          for (var j = 0; j < section.items.length; j++) {
            html += '<li style="margin-bottom: 8px; color: var(--neutral-700); font-size: 14px;">' + section.items[j] + '</li>';
          }
        }

        html += '</ul>' +
          (section.tip ? '<p style="margin: 12px 0 0 0; padding-top: 12px; border-top: 1px solid var(--neutral-100); font-size: 13px; color: var(--brand-secondary); font-style: italic;">💡 ' + section.tip + '</p>' : '') +
        '</div>' +
      '</div>';
      }
    }

    html += '</div>' +
      '<p style="text-align: center; color: var(--brand-secondary); margin-top: 24px; margin-bottom: 16px;">Изучено секций: <strong id="accordion-progress">0/' + (content.sections ? content.sections.length : 0) + '</strong></p>' +
      '</div>';

    card.innerHTML = html;
    card.__accordionData = {
      sections: content.sections || []
    };

    return card;
  },

  /**
   * Render dialogue screen (visual novel style)
   */
  renderDialogueScreen: function(content) {
    var card = document.createElement('div');
    card.className = 'card card-content';

    var html = '<div class="dialogue-container">' +
      (content.title ? '<h3 style="color: var(--brand-secondary); margin-bottom: 16px;">' + content.title + '</h3>' : '');

    // Background image
    if (content.image) {
      html += '<div style="position: relative; background: url(' + content.image + ') center/cover; border-radius: 12px; height: 300px; margin-bottom: 24px; overflow: hidden;">';

      // Character portraits overlay
      if (content.characters) {
        html += '<div style="position: absolute; width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 20px;">';

        for (var charKey in content.characters) {
          var character = content.characters[charKey];
          if (character.portrait) {
            html += '<div style="width: 100px; height: 180px; background: url(' + character.portrait + ') center/cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"></div>';
          }
        }

        html += '</div>';
      }

      html += '</div>';
    }

    // Dialogue content
    html += '<div style="background: var(--neutral-50); padding: 20px; border-radius: 12px; margin-bottom: 24px;">';

    if (content.dialogues && content.dialogues.length > 0) {
      for (var d = 0; d < content.dialogues.length; d++) {
        var dialogue = content.dialogues[d];

        if (dialogue.speaker === 'system') {
          html += '<p style="text-align: center; color: var(--neutral-600); font-style: italic; margin: 12px 0; font-size: 13px;">' + dialogue.text + '</p>';
        } else {
          var speakerName = dialogue.speaker === 'alex' ? 'АЛЕКС' : (dialogue.speaker === 'maria' ? 'МАРИЯ' : dialogue.speaker.toUpperCase());
          html += '<div style="margin-bottom: 16px;">' +
            '<strong style="color: var(--brand-primary); font-size: 13px;">' + speakerName + ':</strong>' +
            '<p style="margin: 8px 0 0 0; color: var(--neutral-800); font-size: 14px; line-height: 1.6;">"' + dialogue.text + '"</p>' +
          '</div>';
        }
      }
    }

    html += '</div>' +
      '</div>';

    card.innerHTML = html;
    card.__dialogueData = {
      dialogues: content.dialogues || []
    };

    return card;
  },

  /**
   * Generate all screens for a lesson
   * @param {object} lesson - Lesson data
   * @returns {HTMLElement[]} Array of screen elements
   */
  generateScreens: function(lesson) {
    var screens = [];

    if (lesson.screens && lesson.screens.length > 0) {
      for (var i = 0; i < lesson.screens.length; i++) {
        screens.push(this.renderScreen(lesson.screens[i], lesson));
      }
    }

    return screens;
  }
};

console.log("[ScreenRenderer] Module loaded successfully");
