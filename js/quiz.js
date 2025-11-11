/**
 * Quiz Module
 * Handles quiz functionality, answer checking, scoring, and detailed feedback
 */

var Quiz = {
  // Scoring and tracking
  scoreData: {
    totalQuestions: 0,
    answeredCorrectly: 0,
    answeredTotal: 0,
    attempts: {},
    answers: [],
    startTime: null,
    endTime: null
  },

  /**
   * Initialize quiz handlers and scoring system
   */
  init: function() {
    this.initScoring();
    this.bindQuizButtons();
    console.log("[Quiz] Module initialized");
  },

  /**
   * Initialize scoring system
   */
  initScoring: function() {
    // Reset scoring data
    this.scoreData.startTime = Date.now();
    this.loadScoringData();
    this.countTotalQuestions();
  },

  /**
   * Load scoring data from localStorage
   */
  loadScoringData: function() {
    var saved = localStorage.getItem("quizScoreData");
    if (saved) {
      try {
        var data = JSON.parse(saved);
        var key;
        for (key in data) {
          if (data.hasOwnProperty(key)) {
            this.scoreData[key] = data[key];
          }
        }
        console.log("[Quiz] Scoring data loaded from localStorage");
      } catch (e) {
        console.warn("[Quiz] Error loading scoring data: " + e.message);
      }
    }
  },

  /**
   * Save scoring data to localStorage
   */
  saveScoringData: function() {
    try {
      localStorage.setItem("quizScoreData", JSON.stringify(this.scoreData));
      console.log("[Quiz] Scoring data saved");
    } catch (e) {
      console.warn("[Quiz] Error saving scoring data: " + e.message);
    }
  },

  /**
   * Count total questions on page
   */
  countTotalQuestions: function() {
    var quizzes = document.querySelectorAll(".quiz-container");
    this.scoreData.totalQuestions = quizzes.length;
    console.log("[Quiz] Total questions found: " + this.scoreData.totalQuestions);
  },

  /**
   * Bind check answer buttons
   */
  bindQuizButtons: function() {
    var self = this;
    document.addEventListener("click", function(e) {
      if (e.target.getAttribute("data-action") === "check") {
        var quizContainer = e.target.closest(".quiz-container");
        if (quizContainer) {
          self.checkAnswer(quizContainer);
        }
      }
    });

    // Handle radio button selection
    document.addEventListener("change", function(e) {
      if (e.target.type === "radio") {
        var label = e.target.closest(".answer-option");
        if (label) {
          // Remove selected class from siblings
          var parent = label.closest(".quiz-options");
          if (parent) {
            parent.querySelectorAll(".answer-option").forEach(function(option) {
              option.classList.remove("selected");
            });
          }

          // Add selected class to current
          label.classList.add("selected");
        }
      }
    });
  },

  /**
   * Get quiz identifier
   * @param {HTMLElement} quizContainer - Quiz container element
   * @returns {string} Quiz ID
   */
  getQuizId: function(quizContainer) {
    return (
      quizContainer.parentElement.getAttribute("data-quiz-id") ||
      "quiz-" + new Date().getTime()
    );
  },

  /**
   * Check answer and show feedback
   * @param {HTMLElement} quizContainer - Quiz container element
   */
  checkAnswer: function(quizContainer) {
    var selectedOption = quizContainer.querySelector("input[type='radio']:checked");

    // Check if user selected an answer
    if (!selectedOption) {
      alert("Пожалуйста, выберите вариант ответа");
      return;
    }

    // Get correctness
    var isCorrect = selectedOption.getAttribute("data-correct") === "true";

    // Get quiz info
    var quizId = this.getQuizId(quizContainer);
    var questionElement = quizContainer.querySelector(".quiz-question");
    var question = questionElement ? questionElement.textContent : "Unknown";
    var selectedValue = selectedOption.value;
    var answerOption = selectedOption.closest(".answer-option");
    var selectedTextElement = answerOption ? answerOption.querySelector("span") : null;
    var selectedText = selectedTextElement ? selectedTextElement.textContent : selectedValue;

    // Track attempt
    if (!this.scoreData.attempts[quizId]) {
      this.scoreData.attempts[quizId] = [];
    }

    this.scoreData.attempts[quizId].push({
      timestamp: Date.now(),
      isCorrect: isCorrect,
      selected: selectedValue
    });

    // Track answer
    this.scoreData.answers.push({
      quizId: quizId,
      question: question,
      selected: selectedText,
      selectedValue: selectedValue,
      isCorrect: isCorrect,
      timestamp: Date.now()
    });

    // Get all options
    var options = quizContainer.querySelectorAll(".answer-option");
    var correctOption = null;
    var i;
    for (i = 0; i < options.length; i++) {
      var input = options[i].querySelector("input");
      if (input && input.getAttribute("data-correct") === "true") {
        correctOption = options[i];
        break;
      }
    }

    // Process each option
    for (i = 0; i < options.length; i++) {
      var option = options[i];
      var input = option.querySelector("input");
      var isCorrectOption = input.getAttribute("data-correct") === "true";
      var isSelected = input.checked;

      // Remove previous states
      option.classList.remove("selected");

      // Apply new states
      if (isCorrectOption) {
        option.classList.add("correct");
      }

      if (isSelected && !isCorrectOption) {
        option.classList.add("wrong");
      }

      // Disable all inputs
      input.disabled = true;
    }

    // Update score
    if (isCorrect) {
      this.scoreData.answeredCorrectly++;
    }
    this.scoreData.answeredTotal++;

    // Show feedback with explanation
    this.showFeedback(quizContainer, isCorrect, correctOption);

    // Enable next button
    this.enableNextButton(quizContainer);

    // Save scoring data
    this.saveScoringData();

    // Log to SCORM
    this.logToSCORM(quizId, selectedValue, isCorrect);

    console.log(
      "[Quiz] Answer recorded: " +
        quizId +
        " - " +
        (isCorrect ? "Correct" : "Wrong") +
        " (" +
        this.scoreData.answeredCorrectly +
        "/" +
        this.scoreData.answeredTotal +
        ")"
    );
  },

  /**
   * Show feedback message with explanation
   * @param {HTMLElement} quizContainer - Quiz container
   * @param {boolean} isCorrect - Is answer correct
   * @param {HTMLElement} correctOption - The correct answer option
   */
  showFeedback: function(quizContainer, isCorrect, correctOption) {
    var feedbackContainer = quizContainer.querySelector(".feedback-container");

    if (!feedbackContainer) return;

    // Get feedback text
    var message = "";
    var explanation = "";

    if (isCorrect) {
      message = "✅ Правильно! Отличный выбор!";

      // Get explanation if available
      var correctTextElement = correctOption ? correctOption.querySelector("span") : null;
      var correctText = correctTextElement ? correctTextElement.textContent : "";
      explanation =
        (correctOption ? correctOption.getAttribute("data-explanation") : null) ||
        "Вы продемонстрировали хорошее понимание материала.";

      // Add encouragement based on attempt count
      var quizId = this.getQuizId(quizContainer);
      var attempts = (this.scoreData.attempts[quizId] || []).length;

      if (attempts === 1) {
        explanation += " Ответили с первой попытки - отлично!";
      }
    } else {
      message = "❌ Неверно. Попробуйте еще раз.";

      // Get explanation for wrong answer
      var selectedOption = quizContainer.querySelector("input[type='radio']:checked");
      var selectedAnswerOption = selectedOption ? selectedOption.closest(".answer-option") : null;
      explanation =
        (selectedAnswerOption ? selectedAnswerOption.getAttribute("data-explanation") : null) ||
        "Пожалуйста, внимательнее прочитайте варианты ответов и материал.";
    }

    // Combine message and explanation
    var fullMessage = explanation ? message + "<br>" + explanation : message;

    // Set content with HTML support
    feedbackContainer.innerHTML = fullMessage;

    // Apply styles
    feedbackContainer.classList.add("show");
    feedbackContainer.classList.toggle("correct", isCorrect);
    feedbackContainer.classList.toggle("wrong", !isCorrect);

    // Add animation
    feedbackContainer.style.animation = "none";
    setTimeout(function() {
      feedbackContainer.style.animation = "slideIn var(--transition-base)";
    }, 10);

    // Log feedback display
    console.log("[Quiz] Feedback displayed: " + (isCorrect ? "Correct" : "Wrong"));
  },

  /**
   * Enable next button after answer
   * @param {HTMLElement} quizContainer - Quiz container
   */
  enableNextButton: function(quizContainer) {
    var screen = quizContainer.closest(".screen");
    if (!screen) return;

    var nextButton = screen.querySelector('[data-action="next"]');
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.style.opacity = "1";
      console.log("[Quiz] Next button enabled");
    }
  },

  /**
   * Log interaction to SCORM
   * @param {string} quizId - Quiz identifier
   * @param {string} response - User's response value
   * @param {boolean} isCorrect - Is answer correct
   */
  logToSCORM: function(quizId, response, isCorrect) {
    if (SCORM && SCORM.initialized) {
      SCORM.addInteraction(quizId, "choice", response, isCorrect);

      // Set raw score if available
      var scorePercentage = this.getScorePercentage();
      if (scorePercentage >= 0) {
        // SCORM uses 0-100 for score
        SCORM.setValue("cmi.core.score.raw", scorePercentage);
      }

      console.log("[Quiz] SCORM interaction logged: " + quizId);
    }
  },

  /**
   * Get current score percentage
   * @returns {number} Score percentage (0-100) or -1 if no questions answered
   */
  getScorePercentage: function() {
    if (this.scoreData.answeredTotal === 0) {
      return -1;
    }
    return Math.round(
      (this.scoreData.answeredCorrectly / this.scoreData.answeredTotal) * 100
    );
  },

  /**
   * Get quiz statistics
   * @returns {object} Quiz statistics
   */
  getStatistics: function() {
    return {
      total: this.scoreData.answeredTotal,
      correct: this.scoreData.answeredCorrectly,
      incorrect: this.scoreData.answeredTotal - this.scoreData.answeredCorrectly,
      percentage: this.getScorePercentage(),
      totalQuestions: this.scoreData.totalQuestions,
      progress: this.scoreData.answeredTotal + "/" + this.scoreData.totalQuestions,
      elapsedTime: this.scoreData.endTime
        ? this.scoreData.endTime - this.scoreData.startTime
        : Date.now() - this.scoreData.startTime
    };
  },

  /**
   * Reset quiz (for retrying)
   * @param {HTMLElement} quizContainer - Quiz container
   */
  resetQuiz: function(quizContainer) {
    // Reset radio buttons
    quizContainer.querySelectorAll("input[type='radio']").forEach(function(input) {
      input.checked = false;
      input.disabled = false;
    });

    // Reset options styling
    quizContainer.querySelectorAll(".answer-option").forEach(function(option) {
      option.classList.remove("selected", "correct", "wrong");
    });

    // Hide feedback
    var feedbackContainer = quizContainer.querySelector(".feedback-container");
    if (feedbackContainer) {
      feedbackContainer.classList.remove("show", "correct", "wrong");
      feedbackContainer.innerHTML = "";
    }

    // Disable next button again
    var screen = quizContainer.closest(".screen");
    if (screen) {
      var nextButton = screen.querySelector('[data-action="next"]');
      if (nextButton) {
        nextButton.disabled = true;
        nextButton.style.opacity = "0.5";
      }
    }

    console.log("[Quiz] Quiz reset for retry");
  },

  /**
   * Finish quiz and record final stats
   */
  finishQuiz: function() {
    this.scoreData.endTime = Date.now();
    var stats = this.getStatistics();

    console.log("[Quiz] Quiz finished - Statistics: ", stats);

    // Save final data
    this.saveScoringData();

    // Log to SCORM
    if (SCORM && SCORM.initialized) {
      SCORM.setValue("cmi.core.score.raw", stats.percentage);
      SCORM.commit();
    }

    return stats;
  }
};

/**
 * Initialize quiz when DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  Quiz.init();
});
