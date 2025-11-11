/**
 * Sidebar Menu Module
 * Handles hamburger menu, sidebar navigation, and lesson list
 */

var SidebarMenu = {
  isOpen: false,
  hamburgerBtn: null,
  sidebar: null,
  overlay: null,
  lessonsList: null,
  closeSidebarBtn: null,

  /**
   * Initialize sidebar menu
   */
  init: function() {
    console.log("[SidebarMenu] Initializing...");

    // Get DOM elements
    this.hamburgerBtn = document.getElementById('hamburger-btn');
    this.sidebar = document.getElementById('sidebar-nav');
    this.overlay = document.getElementById('sidebar-overlay');
    this.lessonsList = document.getElementById('lessons-list');
    this.closeSidebarBtn = document.getElementById('close-sidebar-btn');

    if (!this.hamburgerBtn || !this.sidebar || !this.overlay) {
      console.error("[SidebarMenu] Required elements not found");
      return;
    }

    // Add event listeners
    this.hamburgerBtn.addEventListener('click', this.toggleSidebar.bind(this));
    this.closeSidebarBtn.addEventListener('click', this.closeSidebar.bind(this));
    this.overlay.addEventListener('click', this.closeSidebar.bind(this));

    // Load lessons
    this.loadLessons();

    console.log("[SidebarMenu] Initialized successfully");
  },

  /**
   * Toggle sidebar open/close
   */
  toggleSidebar: function() {
    if (this.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  },

  /**
   * Open sidebar
   */
  openSidebar: function() {
    console.log("[SidebarMenu] Opening sidebar");
    this.isOpen = true;
    this.hamburgerBtn.classList.add('active');
    this.sidebar.classList.add('open');
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close sidebar
   */
  closeSidebar: function() {
    console.log("[SidebarMenu] Closing sidebar");
    this.isOpen = false;
    this.hamburgerBtn.classList.remove('active');
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  },

  /**
   * Load lessons from Data module
   */
  loadLessons: function() {
    console.log("[SidebarMenu] Loading lessons...");

    if (typeof Data === 'undefined') {
      console.error("[SidebarMenu] Data module not available");
      return;
    }

    var self = this;

    // Load lessons asynchronously from Data module
    Data.getLessons(function(error, lessons) {
      if (error) {
        console.error("[SidebarMenu] Error loading lessons: " + error.message);
        return;
      }

      if (!lessons || lessons.length === 0) {
        console.warn("[SidebarMenu] No lessons found in course data");
        return;
      }

      var html = '';

      for (var i = 0; i < lessons.length; i++) {
        var lesson = lessons[i];
        var lessonId = lesson.id;
        var lessonTitle = lesson.title || ('Урок ' + lessonId);
        var emoji = '';

        // Add emoji based on lesson ID
        if (lessonId === 0) {
          emoji = '📚 ';
        } else {
          emoji = lessonId + '️⃣ ';
        }

        html += '<li><a href="#" class="lesson-link" data-lesson-id="' + lessonId + '">' +
                emoji + lessonTitle +
                '</a></li>';
      }

      if (self.lessonsList) {
        self.lessonsList.innerHTML = html;

        // Add click handlers to lesson links
        var lessonLinks = self.lessonsList.querySelectorAll('.lesson-link');
        lessonLinks.forEach(function(link) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            var lessonId = parseInt(this.getAttribute('data-lesson-id'));
            self.selectLesson(lessonId);
          });
        });
      }

      console.log("[SidebarMenu] Lessons loaded: " + lessons.length);
    });
  },

  /**
   * Select a lesson and navigate to it
   */
  selectLesson: function(lessonId) {
    console.log("[SidebarMenu] Selecting lesson: " + lessonId);

    // Close sidebar
    this.closeSidebar();

    // Update active state
    var lessonLinks = this.lessonsList.querySelectorAll('.lesson-link');
    lessonLinks.forEach(function(link) {
      link.classList.remove('active');
      if (parseInt(link.getAttribute('data-lesson-id')) === lessonId) {
        link.classList.add('active');
      }
    });

    // Navigate to lesson using Navigation module
    if (typeof Navigation !== 'undefined' && Navigation.loadLessonScreens) {
      Navigation.loadLessonScreens(lessonId);
    } else {
      console.warn("[SidebarMenu] Navigation.loadLessonScreens not available");
    }
  },

  /**
   * Update active lesson indicator
   */
  updateActiveLesson: function(lessonId) {
    if (!this.lessonsList) return;

    var lessonLinks = this.lessonsList.querySelectorAll('.lesson-link');
    lessonLinks.forEach(function(link) {
      var linkLessonId = parseInt(link.getAttribute('data-lesson-id'));
      if (linkLessonId === lessonId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    SidebarMenu.init();
  });
} else {
  SidebarMenu.init();
}
