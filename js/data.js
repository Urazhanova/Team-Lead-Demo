/**
 * Data Module
 * Handles character data and lesson content
 */

var Data = {
  /**
   * Loaded course data
   */
  courseData: null,
  lessons: [],
  lessonCache: {},

  /**
   * Character information database (fallback)
   */
  characters: {
    alex: {
      name: "Алекс",
      role: "Team Lead",
      image: "assets/images/characters/alex/smiling.png",
      description: "Четыре года программировал и был одним из лучших разработчиков. Недавно повышен в должности Team Lead. Волнуется, но готов учиться.",
      traits: [
        "целеустремленный",
        "готовый учиться",
        "скромный",
        "ответственный"
      ]
    },

    maria: {
      name: "Мария",
      role: "Senior разработчик",
      image: "assets/images/characters/Mariya/icon.svg",
      description: "Самая опытная в команде. Очень компетентна, но закрытая и неохотно делится опытом.",
      traits: [
        "опытная",
        "независимая",
        "закрытая",
        "перфекционистка"
      ],
      skills: ["Техническое лидерство", "Код-ревью", "Менторство"]
    },

    denis: {
      name: "Денис",
      role: "Middle разработчик",
      image: "assets/images/characters/Denis/icon.svg",
      description: "Энергичный и активный. Заинтересован в развитии, часто предлагает новые идеи и берется за интересные задачи.",
      traits: [
        "энергичный",
        "активный",
        "амбициозный",
        "инициативный"
      ],
      skills: ["Быстрое обучение", "Инициативность", "Позитивный настрой"]
    },

    lena: {
      name: "Лена",
      role: "Дизайнер",
      image: "assets/images/characters/lena/icon.svg",
      description: "Креативная и талантливая, но часто неуверена в своих идеях. Нуждается в поддержке и признании своего вклада.",
      traits: [
        "креативная",
        "чувствительная",
        "неуверенная",
        "усердная"
      ],
      skills: ["Дизайн интерфейсов", "Внимание к деталям", "Инновативность"]
    },

    igor: {
      name: "Игорь",
      role: "QA Engineer",
      image: "assets/images/characters/Igor/icon.svg",
      description: "Перфекционист, очень внимателен к качеству. Иногда может быть педантичным, но это гарантирует высокий стандарт.",
      traits: [
        "перфекционист",
        "ответственный",
        "скрупулезный",
        "честный"
      ],
      skills: ["Поиск багов", "Гарантия качества", "Скрупулезность"]
    },

    katya: {
      name: "Катя",
      role: "Junior разработчик",
      image: "assets/images/characters/Katya/icon.svg",
      description: "Совсем новенькая в профессии (только год). Энтузиастична, но нуждается в менторстве и четких инструкциях.",
      traits: [
        "энтузиастичная",
        "любопытная",
        "обучаемая",
        "трудолюбивая"
      ],
      skills: ["Быстрое обучение", "Свежий взгляд", "Мотивированность"]
    }
  },

  /**
   * Get character data
   * @param {string} characterId - Character ID
   * @returns {object|null} Character data
   */
  getCharacter: function(characterId) {
    return this.characters[characterId] || null;
  },

  /**
   * Get all characters
   * @returns {object} All characters
   */
  getAllCharacters: function() {
    return this.characters;
  },

  /**
   * Load lesson data from JSON file
   * @param {function} callback - Callback function
   */
  loadLessons: function(callback) {
    var self = this;
    // Return cached data if available
    if (this.courseData) {
      callback(null, this.courseData);
      return;
    }

    console.log("[Data] Starting fetch of lessons.json...");
    try {
      fetch("data/lessons.json?v=" + new Date().getTime())
        .then(function(response) {
          console.log("[Data] Response received, status: " + response.status);
          if (!response.ok) {
            throw new Error("Failed to load lessons: " + response.statusText);
          }
          console.log("[Data] Parsing JSON...");
          var jsonPromise = response.json();
          console.log("[Data] JSON promise created");
          return jsonPromise;
        })
        .then(function(data) {
          console.log("[Data] JSON parsed successfully, type: " + typeof data);
          if (!data) {
            throw new Error("Data is null or undefined");
          }
          // Cache the data
          self.courseData = data;
          // Also expose lessons array directly
          self.lessons = data.lessons || [];
          console.log("[Data] Lessons loaded successfully: " + self.lessons.length + " lessons");
          console.log("[Data] Loaded lesson IDs: " + self.lessons.map(function(l) { return l.id; }).join(", "));
          callback(null, data);
        })
        .catch(function(error) {
          console.error("[Data] Error loading lessons: " + error.message);
          console.error("[Data] Stack: " + error.stack);
          callback(error, null);
        });
    } catch (error) {
      console.error("[Data] Exception during fetch setup: " + error.message);
      callback(error, null);
    }
  },

  /**
   * Load a specific lesson with screens
   * @param {number} lessonId - Lesson ID
   * @param {function} callback - Callback function
   */
  loadLessonWithScreens: function(lessonId, callback) {
    this.loadLessons(function(error, data) {
      if (error) {
        callback(error, null);
        return;
      }

      var lesson = data.lessons.find(function(l) { return l.id === lessonId; });
      if (!lesson) {
        callback(new Error("Lesson not found: " + lessonId), null);
        return;
      }

      callback(null, { lesson: lesson, courseData: data });
    });
  },

  /**
   * Get lesson by ID
   * @param {number} lessonId - Lesson ID
   * @param {function} callback - Callback function
   */
  getLesson: function(lessonId, callback) {
    this.loadLessons(function(error, lessons) {
      if (error) {
        callback(error, null);
        return;
      }

      var lesson = lessons.lessons.find(function(l) { return l.id === lessonId; });
      callback(error, lesson || null);
    });
  },

  /**
   * Get all lessons
   * @param {function} callback - Callback function
   */
  getLessons: function(callback) {
    this.loadLessons(function(error, data) {
      if (error) {
        callback(error, null);
        return;
      }

      callback(error, data.lessons || []);
    });
  },

  /**
   * Get course information
   * @param {function} callback - Callback function
   */
  getCourseInfo: function(callback) {
    this.loadLessons(function(error, data) {
      if (error) {
        callback(error, null);
        return;
      }

      callback(error, data.course || null);
    });
  },

  /**
   * Save user progress locally
   * @param {object} progress - Progress data
   */
  saveProgress: function(progress) {
    try {
      localStorage.setItem("userProgress", JSON.stringify(progress));
      console.log("Progress saved locally");
    } catch (e) {
      console.error("Error saving progress: " + e.message);
    }
  },

  /**
   * Load user progress
   * @returns {object|null} Progress data
   */
  getProgress: function() {
    try {
      var progress = localStorage.getItem("userProgress");
      return progress ? JSON.parse(progress) : null;
    } catch (e) {
      console.error("Error loading progress: " + e.message);
      return null;
    }
  },

  /**
   * Clear user progress
   */
  clearProgress: function() {
    try {
      localStorage.removeItem("userProgress");
      console.log("Progress cleared");
    } catch (e) {
      console.error("Error clearing progress: " + e.message);
    }
  }
,

  /**
   * Get course data (synchronous - returns cached data if available)
   * @returns {object|null} Course data or null if not loaded yet
   */
  getCourseData: function() {
    return this.courseData;
  }
};

/**
 * Log data module availability
 */
console.log("Data module loaded with " + Object.keys(Data.characters).length + " characters");
