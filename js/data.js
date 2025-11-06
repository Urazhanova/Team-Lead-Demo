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
      image: "assets/characters/alex-1.webp",
      description: "Главный герой нашей истории. 28 лет, четыре года писал код, только что получил должность Team Lead. Волнуется, но готов учиться."
    },

    maria: {
      name: "Мария",
      role: "Senior Developer (опытная)",
      image: "assets/characters/maria.webp",
      description: "Самая опытная разработчица в команде. Она помогает новичкам, но может быть критичной к новым идеям."
    },

    denis: {
      name: "Денис",
      role: "Middle Developer (энергичный)",
      image: "assets/characters/denis.webp",
      description: "Молодой разработчик с большой энергией. Всегда полон идей, иногда импульсивен."
    },

    lena: {
      name: "Елена",
      role: "UI/UX Designer (креативная)",
      image: "assets/characters/lena.webp",
      description: "Дизайнер команды, творческая и перфекционистка. Заботится о деталях и пользовательском опыте."
    },

    igor: {
      name: "Игорь",
      role: "QA Engineer (перфекционист)",
      image: "assets/characters/igor.webp",
      description: "QA специалист, находит баги где их нет. Очень важен для качества продукта."
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

    fetch("data/lessons.json")
      .then(function(response) {
        if (!response.ok) {
          throw new Error("Failed to load lessons: " + response.statusText);
        }
        return response.json();
      })
      .then(function(data) {
        // Cache the data
        self.courseData = data;
        // Also expose lessons array directly
        self.lessons = data.lessons || [];
        console.log("Lessons loaded successfully: " + self.lessons.length + " lessons");
        callback(null, data);
      })
      .catch(function(error) {
        console.error("Error loading lessons: " + error.message);
        callback(error, null);
      });
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
