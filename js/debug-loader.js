/**
 * Debug Loader
 * Helps diagnose screen loading issues
 */

const DebugLoader = {
  /**
   * Run comprehensive diagnostics
   */
  runDiagnostics() {
    console.log("=== TEAM LEAD ACADEMY DEBUG DIAGNOSTICS ===");

    // Test 1: Check modules exist
    console.log("\n1. MODULE AVAILABILITY:");
    console.log(`   ✓ Utilities: ${typeof Utilities !== 'undefined'}`);
    console.log(`   ✓ SCORM: ${typeof SCORM !== 'undefined'}`);
    console.log(`   ✓ Data: ${typeof Data !== 'undefined'}`);
    console.log(`   ✓ ScreenRenderer: ${typeof ScreenRenderer !== 'undefined'}`);
    console.log(`   ✓ Navigation: ${typeof Navigation !== 'undefined'}`);

    // Test 2: Check DOM elements
    console.log("\n2. DOM ELEMENTS:");
    const mainContent = document.getElementById('mainContent');
    console.log(`   ✓ mainContent exists: ${!!mainContent}`);
    console.log(`   ✓ mainContent children: ${mainContent?.children?.length || 0}`);

    // Test 3: Try loading lessons directly
    console.log("\n3. LOADING LESSONS.JSON:");
    fetch('data/lessons.json')
      .then(r => {
        console.log(`   ✓ Fetch response status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log(`   ✓ JSON parsed successfully`);
        console.log(`   ✓ Lessons count: ${data.lessons.length}`);
        console.log(`   ✓ Intro lesson screens: ${data.lessons[0]?.screens?.length || 0}`);

        // Test 4: Try screen rendering
        console.log("\n4. SCREEN RENDERING:");
        if (typeof ScreenRenderer !== 'undefined') {
          try {
            const screens = ScreenRenderer.generateScreens(data.lessons[0]);
            console.log(`   ✓ Screens generated: ${screens.length}`);
            console.log(`   ✓ First screen type: ${screens[0]?.getAttribute('data-type')}`);
          } catch (e) {
            console.error(`   ✗ Error generating screens: ${e.message}`);
          }
        } else {
          console.error(`   ✗ ScreenRenderer not available`);
        }

        // Test 5: Check Navigation state
        console.log("\n5. NAVIGATION STATE:");
        if (typeof Navigation !== 'undefined') {
          console.log(`   ✓ Navigation.screens.length: ${Navigation.screens?.length || 0}`);
          console.log(`   ✓ Navigation.currentScreenIndex: ${Navigation.currentScreenIndex}`);
          console.log(`   ✓ Navigation.currentLesson: ${Navigation.currentLesson?.title || 'null'}`);
        }
      })
      .catch(error => {
        console.error(`   ✗ Error loading lessons: ${error.message}`);
      });
  },

  /**
   * Force manual initialization
   */
  forceInit() {
    console.log("\n=== FORCING MANUAL INITIALIZATION ===");

    if (typeof Data === 'undefined') {
      console.error("Data module not loaded");
      return;
    }

    if (typeof ScreenRenderer === 'undefined') {
      console.error("ScreenRenderer module not loaded");
      return;
    }

    if (typeof Navigation === 'undefined') {
      console.error("Navigation module not loaded");
      return;
    }

    // Load and render
    Data.loadLessonWithScreens(0, (error, result) => {
      if (error) {
        console.error("Error loading lesson:", error);
        return;
      }

      console.log("✓ Lesson loaded, generating screens...");
      const mainContent = document.getElementById('mainContent');
      mainContent.innerHTML = ''; // Clear

      const screens = ScreenRenderer.generateScreens(result.lesson);
      console.log(`✓ Generated ${screens.length} screens`);

      screens.forEach(screen => {
        mainContent.appendChild(screen);
      });

      console.log("✓ Screens inserted into DOM");

      // Initialize navigation with the new screens
      Navigation.screens = Array.from(document.querySelectorAll('.screen'));
      Navigation.initializeNavigation();
      console.log("✓ Navigation initialized");
    });
  },
};

// Run diagnostics on load
console.log("Debug Loader Ready");
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => DebugLoader.runDiagnostics(), 500);
  });
} else {
  setTimeout(() => DebugLoader.runDiagnostics(), 500);
}
