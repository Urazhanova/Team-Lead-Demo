/**
 * GAME 2D - Lesson 3: Planning & Prioritization
 * Full 2D game with Canvas, NPC interactions, dialogue system, crisis management
 *
 * This module is completely self-contained and isolated from other lessons
 */

const GameLesson2D = (() => {
    // ============================================
    // PRIVATE STATE
    // ============================================

    let gameState = {
        currentScene: 'intro',      // intro, game, scenario, quiz, results
        player: null,
        npcs: {},
        canvas: null,
        ctx: null,
        keys: {},

        // Zone system
        currentZone: null,
        lastZoneMessage: null,

        // Character images cache
        characterImages: {},

        // Game progress
        completedScenarios: [],
        crisisChoices: {},
        quizAnswers: [],
        totalXP: 0,
        totalSkills: {},
        achievements: [],
        theoriesRead: [],            // Track read theory blocks

        // Crisis state
        crisisTime: 60,             // minutes left
        crisisTimeSpent: 0,
        criticalProblemsHandled: 0
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    function initGame(lesson, container) {
        // Clear container
        container.innerHTML = '';

        // Create game HTML
        const gameHTML = createGameHTML();
        container.appendChild(gameHTML);

        // Get canvas
        gameState.canvas = document.getElementById('gameCanvas2D');
        gameState.ctx = gameState.canvas.getContext('2d');

        // Setup player
        gameState.player = {
            x: 710,
            y: 110,
            size: 60,
            speed: 3,
            color: GameData.npcs.alex.color,
            emoji: GameData.npcs.alex.emoji
        };

        // Setup NPCs
        Object.keys(GameData.npcs).forEach(key => {
            if (key !== 'alex') {
                const npcData = GameData.npcs[key];
                const behaviorData = GameData.npcBehavior[key] || {};
                gameState.npcs[key] = {
                    ...npcData,
                    x: behaviorData.startX || 400,
                    y: behaviorData.startY || 300,
                    size: 60,
                    interactionDistance: 100,
                    canInteract: false
                };
            }
        });

        // Initialize team metrics with default values
        if (!gameState.totalSkills) {
            gameState.totalSkills = {
                team_satisfaction: 50,
                team_morale: 50,
                team_stress: 50,
                strategic_value: 50,
                sprint_quality: 50
            };
        }

        // Load character images
        loadCharacterImages();

        // Setup event listeners
        setupEventListeners();

        // Start game loop
        gameLoop();
    }

    function loadCharacterImages() {
        // Load images for all NPCs
        Object.keys(GameData.npcs).forEach(key => {
            const npc = GameData.npcs[key];
            if (npc.image) {
                const img = new Image();
                img.onload = () => {
                    gameState.characterImages[npc.image] = img;
                    console.log(`[Game2D] Loaded image: ${npc.image}`);
                };
                img.onerror = () => {
                    console.warn(`[Game2D] Failed to load image: ${npc.image}`);
                };
                img.src = npc.image;
            }
        });
    }

    function createGameHTML() {
        const container = document.createElement('div');
        container.id = 'game-2d-container';

        container.innerHTML = `
            <!-- Top Bar -->
            <div class="game-2d-top-bar">
                <div class="game-2d-day-info">
                    📅 ДЕНЬ 5 | Пятница, 16:00
                </div>
                <div class="game-2d-stats">
                    <div class="game-2d-stat-item">⭐ <span id="xp-counter">0</span> XP</div>
                    <div class="game-2d-stat-item">🏆 Level <span id="level-counter">1</span></div>
                </div>
            </div>

            <!-- Main Game Area -->
            <div class="game-2d-main">
                <div class="game-2d-canvas-wrapper">
                    <canvas id="gameCanvas2D" width="800" height="600"></canvas>

                    <!-- Mobile Controls -->
                    <div id="mobile-controls" class="game-2d-mobile-controls">
                        <div class="game-2d-joystick">
                            <button class="game-2d-move-btn game-2d-move-up" data-direction="up">▲</button>
                            <button class="game-2d-move-btn game-2d-move-left" data-direction="left">◄</button>
                            <button class="game-2d-move-btn game-2d-move-right" data-direction="right">►</button>
                            <button class="game-2d-move-btn game-2d-move-down" data-direction="down">▼</button>
                        </div>
                        <div class="game-2d-action-buttons">
                            <button class="game-2d-action-btn game-2d-interact-btn" id="interact-btn">⏎ ENTER</button>
                            <button class="game-2d-action-btn game-2d-menu-btn" id="menu-btn">☰ MENU</button>
                        </div>
                    </div>
                </div>

                <div id="side-panel">
                    <div class="game-2d-panel-title">📋 СТАТУС</div>
                    <div id="game-status"></div>
                </div>
            </div>

            <!-- Bottom Panel -->
            <div class="game-2d-bottom-panel">
                <div id="bottom-objective">
                    Добро пожаловать! Нажми SPACE для меню.
                </div>
            </div>

            <!-- Dialogue Modal -->
            <div id="dialogue-modal-2d" class="game-2d-modal-overlay">
                <div id="dialogue-content" class="game-2d-modal-content"></div>
            </div>

            <!-- Menu Modal -->
            <div id="menu-modal-2d" class="game-2d-modal-overlay">
                <div id="menu-content" class="game-2d-modal-content"></div>
            </div>

            <!-- Theory Modal -->
            <div id="theory-modal-2d" class="game-2d-modal-overlay">
                <div class="game-2d-modal-content">
                    <div id="theory-content"></div>
                </div>
            </div>
        `;

        return container;
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    function setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            gameState.keys[e.key.toLowerCase()] = true;

            if (e.key.toLowerCase() === ' ') {
                e.preventDefault();
                showMenu();
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                handleInteraction();
            }
        });

        document.addEventListener('keyup', (e) => {
            gameState.keys[e.key.toLowerCase()] = false;
        });

        // Mobile Controls - Movement Buttons
        const moveButtons = document.querySelectorAll('.game-2d-move-btn');
        moveButtons.forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                const direction = e.currentTarget.getAttribute('data-direction');
                const keyMap = {
                    'up': 'w',
                    'down': 's',
                    'left': 'a',
                    'right': 'd'
                };
                gameState.keys[keyMap[direction]] = true;
                e.currentTarget.classList.add('active');
            });

            btn.addEventListener('pointerup', (e) => {
                const direction = e.currentTarget.getAttribute('data-direction');
                const keyMap = {
                    'up': 'w',
                    'down': 's',
                    'left': 'a',
                    'right': 'd'
                };
                gameState.keys[keyMap[direction]] = false;
                e.currentTarget.classList.remove('active');
            });

            btn.addEventListener('pointercancel', (e) => {
                const direction = e.currentTarget.getAttribute('data-direction');
                const keyMap = {
                    'up': 'w',
                    'down': 's',
                    'left': 'a',
                    'right': 'd'
                };
                gameState.keys[keyMap[direction]] = false;
                e.currentTarget.classList.remove('active');
            });
        });

        // Mobile Controls - Action Buttons
        const interactBtn = document.getElementById('interact-btn');
        if (interactBtn) {
            interactBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                handleInteraction();
                e.currentTarget.classList.add('active');
            });
            interactBtn.addEventListener('pointerup', (e) => {
                e.currentTarget.classList.remove('active');
            });
        }

        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                showMenu();
                e.currentTarget.classList.add('active');
            });
            menuBtn.addEventListener('pointerup', (e) => {
                e.currentTarget.classList.remove('active');
            });
        }
    }

    // ============================================
    // GAME LOOP
    // ============================================

    function gameLoop() {
        if (gameState.currentScene === 'game') {
            updateGameState();
            drawGame();
        }

        requestAnimationFrame(gameLoop);
    }

    function updateGameState() {
        // Player movement
        let newX = gameState.player.x;
        let newY = gameState.player.y;

        if (gameState.keys['w'] || gameState.keys['arrowup']) {
            newY -= gameState.player.speed;
        }
        if (gameState.keys['s'] || gameState.keys['arrowdown']) {
            newY += gameState.player.speed;
        }
        if (gameState.keys['a'] || gameState.keys['arrowleft']) {
            newX -= gameState.player.speed;
        }
        if (gameState.keys['d'] || gameState.keys['arrowright']) {
            newX += gameState.player.speed;
        }

        // Keep in bounds
        newX = Math.max(20, Math.min(newX, 740));
        newY = Math.max(20, Math.min(newY, 560));

        gameState.player.x = newX;
        gameState.player.y = newY;

        // Check interactions with NPCs
        checkNPCProximity();

        // Update UI
        updateSidePanel();

        // Check zone entry/exit
        checkZoneEntry();
    }

    function drawZones() {
        const ctx = gameState.ctx;

        // Draw zone boundaries and labels from GameData
        Object.keys(GameData.zones).forEach(zoneId => {
            const zone = GameData.zones[zoneId];

            // Draw zone rectangle with color
            ctx.strokeStyle = zone.borderColor || '#4ecca3';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
            ctx.setLineDash([]);

            // Highlight if player is in zone
            if (gameState.currentZone === zoneId) {
                ctx.fillStyle = zone.borderColor || '#4ecca3';
                ctx.globalAlpha = 0.1;
                ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
                ctx.globalAlpha = 1;
            }

            // Draw zone label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(zone.label, zone.x + 8, zone.y + 8);
        });
    }

    function checkZoneEntry() {
        const player = gameState.player;
        let newZone = null;

        // Check which zone player is in
        Object.keys(GameData.zones).forEach(zoneId => {
            const zone = GameData.zones[zoneId];
            const playerCenterX = player.x + player.size / 2;
            const playerCenterY = player.y + player.size / 2;

            // Check if player center is in zone
            if (playerCenterX >= zone.x && playerCenterX <= zone.x + zone.width &&
                playerCenterY >= zone.y && playerCenterY <= zone.y + zone.height) {
                newZone = zoneId;
            }
        });

        // Zone changed
        if (newZone !== gameState.currentZone) {
            const oldZone = gameState.currentZone;
            gameState.currentZone = newZone;

            // Handle zone exit
            if (oldZone) {
                console.log(`Exited zone: ${oldZone}`);
            }

            // Handle zone entry
            if (newZone) {
                console.log(`Entered zone: ${newZone}`);
                handleZoneEntry(newZone);
            }
        }
    }

    function handleZoneEntry(zoneId) {
        const zone = GameData.zones[zoneId];

        // Only trigger for interactive zones
        if (!zone.interactive) {
            return;
        }

        // Special handling for theory zone - show theory menu
        if (zoneId === 'theory_zone') {
            console.log('[Game2D] Entered theory zone - showing theory menu');
            // Hide scrollbars before opening modal
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            if (document.querySelector('main')) {
                document.querySelector('main').style.overflow = 'hidden';
            }
            showTheoryMenu();
            return;
        }

        // Add visual feedback
        gameState.lastZoneMessage = {
            text: `Вы вошли в ${zone.label}`,
            time: Date.now(),
            duration: 2000
        };
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // THEORY BLOCKS SYSTEM
    // ============================================

    function getUnlockedTheoryBlocks() {
        const unlocked = [];
        // Use explicit order to ensure correct ordering
        const blockOrder = ['theory1', 'theory2', 'theory3', 'theory4', 'theory5'];

        blockOrder.forEach(blockId => {
            if (GameData.theoryBlocks[blockId]) {
                const block = GameData.theoryBlocks[blockId];
                if (isTheoryBlockUnlocked(blockId)) {
                    unlocked.push(blockId);
                }
            }
        });
        return unlocked;
    }

    function isTheoryBlockUnlocked(blockId) {
        const block = GameData.theoryBlocks[blockId];
        if (block.unlockedAt === 'start') return true;

        // Check unlock conditions
        if (block.unlockedAt === 'after_theory1') {
            return gameState.theoriesRead && gameState.theoriesRead.includes('theory1');
        }
        if (block.unlockedAt === 'after_case1') {
            return gameState.completedScenarios && gameState.completedScenarios.includes('case1');
        }
        if (block.unlockedAt === 'after_case2') {
            return gameState.completedScenarios && gameState.completedScenarios.includes('case2');
        }
        if (block.unlockedAt === 'after_case3') {
            return gameState.completedScenarios && gameState.completedScenarios.includes('case3');
        }

        return false;
    }

    function showTheoryModal(blockId) {
        console.log('[Game2D] showTheoryModal called with blockId:', blockId);

        const block = GameData.theoryBlocks[blockId];
        if (!block) {
            console.error('[Game2D] Block not found:', blockId);
            return;
        }

        const modal = document.getElementById('theory-modal-2d');
        if (!modal) {
            console.error('[Game2D] Theory modal element not found in DOM!');
            return;
        }

        console.log('[Game2D] Modal found, preparing content...');

        const theoryContent = document.getElementById('theory-content');
        if (!theoryContent) {
            console.error('[Game2D] Theory content element not found!');
            return;
        }

        const lines = block.content.split('\n');
        const htmlContent = lines.map(line => {
            if (!line.trim()) return '<br>';
            return `<div class="game-2d-theory-line">${escapeHtml(line)}</div>`;
        }).join('');

        theoryContent.innerHTML = `
            <div class="game-2d-theory-header">
                <h2>${block.title}</h2>
                <p class="game-2d-theory-reward">+${block.reward} XP</p>
            </div>
            <div class="game-2d-theory-content">
                ${htmlContent}
            </div>
            <div class="game-2d-theory-footer">
                <button class="game-2d-button game-2d-button-primary" onclick="GameLesson2D.closeTheoryModal()">
                    Закрыть
                </button>
            </div>
        `;

        console.log('[Game2D] Activating modal...');
        modal.classList.add('active');
        document.getElementById('gameCanvas2D').style.display = 'none';

        // Mark theory as read
        if (!gameState.theoriesRead) {
            gameState.theoriesRead = [];
        }
        if (!gameState.theoriesRead.includes(blockId)) {
            gameState.theoriesRead.push(blockId);
            gameState.totalXP += block.reward;
        }
    }

    function closeTheoryModal() {
        const modal = document.getElementById('theory-modal-2d');
        modal.classList.remove('active');
        document.getElementById('gameCanvas2D').style.display = 'block';

        // Restore scrollbars
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (document.querySelector('main')) {
            document.querySelector('main').style.overflow = '';
        }

        // Refresh side panel to show "✓ прочитано" status
        updateSidePanel();
    }

    function showTheoryMenu() {
        const modal = document.getElementById('theory-modal-2d');
        if (!modal) {
            console.error('[Game2D] Theory modal not found!');
            return;
        }

        const theoryContent = document.getElementById('theory-content');
        const unlockedBlocks = getUnlockedTheoryBlocks();

        console.log('[Game2D] Unlocked blocks count:', unlockedBlocks.length);
        console.log('[Game2D] Unlocked blocks:', unlockedBlocks);
        console.log('[Game2D] All theory blocks:', Object.keys(GameData.theoryBlocks));

        const blocksHtml = unlockedBlocks.map(blockId => {
            const block = GameData.theoryBlocks[blockId];
            const isRead = gameState.theoriesRead && gameState.theoriesRead.includes(blockId);
            return `
                <button class="game-2d-theory-menu-button ${isRead ? 'read' : ''}"
                        data-theory-id="${blockId}">
                    <span class="game-2d-theory-menu-icon">${block.icon}</span>
                    <span class="game-2d-theory-menu-title">${block.title}</span>
                    <span class="game-2d-theory-menu-reward">
                        ${isRead ? '✓ Прочитано' : `+${block.reward} XP`}
                    </span>
                </button>
            `;
        }).join('');

        theoryContent.innerHTML = `
            <div class="game-2d-theory-menu">
                <div class="game-2d-theory-menu-header">
                    <h2>💡 Зона обучения</h2>
                    <p>Выбери тему для изучения</p>
                </div>
                <div class="game-2d-theory-menu-list">
                    ${blocksHtml || '<div class="game-2d-text-muted">Нет доступных блоков</div>'}
                </div>
                <div class="game-2d-theory-menu-footer">
                    <button class="game-2d-button game-2d-button-secondary" onclick="GameLesson2D.closeTheoryModal()">
                        Выйти из зоны обучения
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.getElementById('gameCanvas2D').style.display = 'none';

        // Hide scrollbars to prevent white stripe
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        if (document.querySelector('main')) {
            document.querySelector('main').style.overflow = 'hidden';
        }

        // Attach listeners to theory menu buttons
        attachTheoryMenuListeners();
    }

    function attachTheoryMenuListeners() {
        const theoryContent = document.getElementById('theory-content');
        if (!theoryContent) return;

        const buttons = theoryContent.querySelectorAll('.game-2d-theory-menu-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const blockId = button.dataset.theoryId;
                console.log('[Game2D] Theory menu button clicked:', blockId);
                showTheoryContent(blockId);
            });
        });
    }

    function showTheoryContent(blockId) {
        const block = GameData.theoryBlocks[blockId];
        if (!block) return;

        const theoryContent = document.getElementById('theory-content');
        const lines = block.content.split('\n');

        // Format content with project styles
        const htmlContent = lines.map(line => {
            if (!line.trim()) return '<br>';

            const text = escapeHtml(line);

            // Apply styles to different types of lines
            if (text.match(/^[0-9]+\./)) {
                // Numbered lists
                return `<div class="game-2d-theory-line game-2d-theory-numbered">${text}</div>`;
            } else if (text.match(/^[•✓❌]/)) {
                // Bullet points
                return `<div class="game-2d-theory-line game-2d-theory-bullet">${text}</div>`;
            } else if (text.match(/^[A-Z\s]+\s*[-–]/)) {
                // Headers/titles (ALL CAPS with dash)
                return `<div class="game-2d-theory-line game-2d-theory-title">${text}</div>`;
            } else if (text.match(/^[🎯📊⏱️🎴🚨R\s]/)) {
                // Section headers with emoji/letters
                return `<div class="game-2d-theory-line game-2d-theory-section">${text}</div>`;
            } else {
                return `<div class="game-2d-theory-line">${text}</div>`;
            }
        }).join('');

        theoryContent.innerHTML = `
            <div class="game-2d-theory-view">
                <div class="game-2d-theory-back-button">
                    <button class="game-2d-button-link" onclick="GameLesson2D.showTheoryMenu()">← Вернуться к списку</button>
                </div>
                <div class="game-2d-theory-header">
                    <h2>${block.title}</h2>
                    <p class="game-2d-theory-reward">+${block.reward} XP</p>
                </div>
                <div class="game-2d-theory-content">
                    ${htmlContent}
                </div>
                <div class="game-2d-theory-footer">
                    <button class="game-2d-button game-2d-button-primary" onclick="GameLesson2D.closeTheoryModal()">
                        Закрыть и выйти
                    </button>
                </div>
            </div>
        `;

        // Mark theory as read
        if (!gameState.theoriesRead) {
            gameState.theoriesRead = [];
        }
        if (!gameState.theoriesRead.includes(blockId)) {
            gameState.theoriesRead.push(blockId);
            gameState.totalXP += block.reward;
            console.log('[Game2D] Theory marked as read:', blockId, 'New XP:', gameState.totalXP);
        }
    }

    // ============================================
    // MODAL HELPERS
    // ============================================

    function showDialogueModal(content) {
        const modal = document.getElementById('dialogue-modal-2d');
        const dialogueContent = document.getElementById('dialogue-content');
        dialogueContent.innerHTML = content;
        modal.classList.add('active');
        document.getElementById('gameCanvas2D').style.display = 'none';
    }

    function hideDialogueModal() {
        const modal = document.getElementById('dialogue-modal-2d');
        modal.classList.remove('active');
        document.getElementById('gameCanvas2D').style.display = 'block';
    }

    function showMenuModal(content) {
        const modal = document.getElementById('menu-modal-2d');
        const menuContent = document.getElementById('menu-content');
        menuContent.innerHTML = content;
        modal.classList.add('active');
        document.getElementById('gameCanvas2D').style.display = 'none';
    }

    function hideMenuModal() {
        const modal = document.getElementById('menu-modal-2d');
        modal.classList.remove('active');
        document.getElementById('gameCanvas2D').style.display = 'block';
    }

    function drawGame() {
        const ctx = gameState.ctx;

        // Clear
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(78, 204, 163, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < gameState.canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, gameState.canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < gameState.canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(gameState.canvas.width, i);
            ctx.stroke();
        }

        // Draw zones
        drawZones();

        // Draw NPCs
        Object.keys(gameState.npcs).forEach(key => {
            drawCharacter(gameState.npcs[key]);
        });

        // Draw player
        drawCharacter(gameState.player);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Алекс (ты)', gameState.player.x + gameState.player.size/2,
                     gameState.player.y - 10);

        // Draw interaction hints
        Object.keys(gameState.npcs).forEach(key => {
            const npc = gameState.npcs[key];
            if (npc.canInteract) {
                ctx.fillStyle = '#4ecca3';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⏎ ENTER', npc.x + npc.size/2, npc.y - 20);

                // Interaction circle
                ctx.strokeStyle = 'rgba(78, 204, 163, 0.5)';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(npc.x + npc.size/2, npc.y + npc.size/2, npc.interactionDistance, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });
    }

    function drawCharacter(char) {
        const ctx = gameState.ctx;

        // Check if character has an image
        if (char.image && gameState.characterImages && gameState.characterImages[char.image]) {
            const img = gameState.characterImages[char.image];
            // Draw image (scaled to character size)
            ctx.save();
            ctx.globalAlpha = 0.95;
            ctx.drawImage(img, char.x, char.y, char.size, char.size);
            ctx.restore();

            // Draw border around image
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(char.x, char.y, char.size, char.size);
        } else {
            // Fallback: Draw colored circle with emoji
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(char.x + char.size/2, char.y + char.size + 5, char.size/2, char.size/4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.fillStyle = char.color;
            ctx.beginPath();
            ctx.arc(char.x + char.size/2, char.y + char.size/2, char.size/2, 0, Math.PI * 2);
            ctx.fill();

            // Border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Emoji
            ctx.font = `${char.size * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char.emoji, char.x + char.size/2, char.y + char.size/2);
        }
    }

    // ============================================
    // INTERACTION SYSTEM
    // ============================================

    function checkNPCProximity() {
        Object.keys(gameState.npcs).forEach(key => {
            const npc = gameState.npcs[key];
            const dx = gameState.player.x - npc.x;
            const dy = gameState.player.y - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            npc.canInteract = distance < npc.interactionDistance;
        });
    }

    function handleInteraction() {
        // Check which NPC is close
        let closestNPC = null;
        let closestDistance = Infinity;

        Object.keys(gameState.npcs).forEach(key => {
            if (gameState.npcs[key].canInteract) {
                const dx = gameState.player.x - gameState.npcs[key].x;
                const dy = gameState.player.y - gameState.npcs[key].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestNPC = key;
                }
            }
        });

        if (closestNPC) {
            startScenario(closestNPC);
        }
    }

    // ============================================
    // SCENARIO SYSTEM
    // ============================================

    function startScenario(npcKey) {
        // Find scenario for this NPC
        const scenarios = GameData.scenarios;
        let targetScenario = null;

        for (let key in scenarios) {
            if (scenarios[key].npc === npcKey) {
                targetScenario = scenarios[key];
                break;
            }
        }

        if (targetScenario) {
            showScenarioDialogue(targetScenario);
        }
    }

    function showScenarioDialogue(scenario) {
        gameState.currentScene = 'scenario';
        document.getElementById('gameCanvas2D').style.display = 'none';

        const modal = document.getElementById('dialogue-modal-2d');
        const content = document.getElementById('dialogue-content');

        let html = `
            <div class="game-2d-mb-xl">
                <h2 class="game-2d-dialogue-header game-2d-text-center">
                    ${scenario.title}
                </h2>

                <div class="game-2d-context">
                    <div class="game-2d-context-title">📖 Ситуация:</div>
                    <div>${scenario.introduction.text}</div>
                </div>
        `;

        if (scenario.introduction.context) {
            html += `
                <div class="game-2d-warning-box">
                    <div class="game-2d-warning-title">${scenario.introduction.context.title}</div>
                    <div>
                        ${scenario.introduction.context.items.map(item => `<div>• ${item}</div>`).join('')}
                    </div>
                </div>
            `;
        }

        html += `
            <div class="game-2d-text-center">
                <button onclick="GameLesson2D.showChoices('${scenario.id}')"
                        class="game-2d-button">
                    Что делать? →
                </button>
            </div>
            </div>
        `;

        content.innerHTML = html;
        modal.classList.add('active');
    }

    // ============================================
    // MENU SYSTEM
    // ============================================

    function showMenu() {
        const modal = document.getElementById('menu-modal-2d');
        const content = document.getElementById('menu-content');

        let html = `
            <h2 class="game-2d-dialogue-header game-2d-text-center">МЕНЮ</h2>

            <button onclick="GameLesson2D.resumeGame()"
                    class="game-2d-menu-button game-2d-menu-button-primary">
                Продолжить игру (SPACE)
            </button>

            <button onclick="GameLesson2D.showScenarioList()"
                    class="game-2d-menu-button game-2d-menu-button-secondary">
                Выбрать сценарий
            </button>

            <button onclick="GameLesson2D.startCrisis()"
                    class="game-2d-menu-button game-2d-menu-button-danger">
                Финальный кризис (🚨)
            </button>

            <button onclick="GameLesson2D.closeMenu()"
                    class="game-2d-menu-button game-2d-menu-button-muted">
                Закрыть
            </button>

            <div class="game-2d-controls-info">
                <div>⌨️ Управление: WASD или стрелки</div>
                <div>💬 Взаимодействие: ENTER</div>
                <div>📋 Меню: SPACE</div>
            </div>
        `;

        content.innerHTML = html;
        modal.classList.add('active');
    }

    function getTeamMetricsHTML() {
        // Main team mood metrics to display
        const metrics = [
            { key: 'team_satisfaction', label: 'Удовлетворение', emoji: '😊', max: 100 },
            { key: 'team_morale', label: 'Боевой дух', emoji: '🚀', max: 100 },
            { key: 'team_stress', label: 'Стресс', emoji: '😰', max: 100, isNegative: true },
            { key: 'strategic_value', label: 'Стратегическая ценность', emoji: '🎯', max: 100 },
            { key: 'sprint_quality', label: 'Качество спринта', emoji: '✨', max: 100 }
        ];

        let html = '<div class="game-2d-team-metrics">';

        metrics.forEach(metric => {
            // Get metric value from gameState.totalSkills or default to 50
            const value = gameState.totalSkills && gameState.totalSkills[metric.key]
                ? gameState.totalSkills[metric.key]
                : 50;

            // Clamp value between 0 and max
            const clampedValue = Math.max(0, Math.min(metric.max, value));
            const percentage = (clampedValue / metric.max) * 100;

            // Determine color based on value
            let barColor = '#4ECC A3'; // success green
            if (metric.isNegative) {
                // For negative metrics (stress), invert colors
                barColor = percentage > 70 ? '#FF6B6B' : percentage > 40 ? '#FFD93D' : '#4ECC A3';
            } else {
                // For positive metrics, green is good
                barColor = percentage > 70 ? '#4ECC A3' : percentage > 40 ? '#FFD93D' : '#FF6B6B';
            }

            html += `
                <div class="game-2d-metric-item">
                    <div class="game-2d-metric-header">
                        <span class="game-2d-metric-label">${metric.emoji} ${metric.label}</span>
                        <span class="game-2d-metric-value">${Math.round(clampedValue)}</span>
                    </div>
                    <div class="game-2d-metric-bar-bg">
                        <div class="game-2d-metric-bar" style="width: ${percentage}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function updateSidePanel() {
        const panel = document.getElementById('side-panel');
        if (!panel) return;

        const nearbyNPCs = [];
        Object.keys(gameState.npcs).forEach(key => {
            if (gameState.npcs[key].canInteract) {
                nearbyNPCs.push(key);
            }
        });

        let html = `
            <div class="game-2d-panel-title">👥 РЯДОМ</div>
            ${nearbyNPCs.length > 0
                ? nearbyNPCs.map(key => {
                    const npc = gameState.npcs[key];
                    return `
                        <div class="game-2d-npc-card">
                            ${npc.image ? `<div class="game-2d-npc-card-image-small" style="background-image: url(${npc.image});"></div>` : ''}
                            <div class="game-2d-npc-card-content">
                                <div class="game-2d-npc-card-name">${npc.emoji} ${npc.name}</div>
                                <div class="game-2d-npc-card-role">${npc.role}</div>
                                <div class="game-2d-npc-card-hint">
                                    ⏎ Нажми ENTER
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')
                : '<div class="game-2d-text-muted">Никого рядом</div>'
            }

            <div class="game-2d-panel-title game-2d-mt-lg">
                📊 СТАТИСТИКА
            </div>
            <div class="game-2d-text-small">
                <div>XP: <span id="xp-stat">${gameState.totalXP}</span></div>
                <div class="game-2d-mt-sm">Сценариев пройдено: <span id="scenarios-stat">${gameState.completedScenarios.length}</span></div>
                <div class="game-2d-mt-sm">Блоков прочитано: <span id="theory-stat">${(gameState.theoriesRead && gameState.theoriesRead.length) || 0}</span>/5</div>
            </div>

            <div class="game-2d-panel-title game-2d-mt-lg">
                👥 СОСТОЯНИЕ КОМАНДЫ
            </div>
            ${getTeamMetricsHTML()}
        `;

        panel.innerHTML = html;
    }

    // ============================================
    // PUBLIC API
    // ============================================

    return {
        render: function(lesson, container) {
            initGame(lesson, container);
            gameState.currentScene = 'game';
        },

        showChoices: function(scenarioId) {
            // Find scenario
            const scenario = GameData.scenarios[scenarioId];
            if (!scenario) return;

            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 class="game-2d-dialogue-header game-2d-text-center">Что выбираешь?</h2>
            `;

            scenario.choices.forEach((choice, index) => {
                html += `
                    <div class="game-2d-choice-option"
                         onclick="GameLesson2D.selectChoice('${scenarioId}', '${choice.id}')">
                        <div class="game-2d-choice-title">
                            ${String.fromCharCode(65 + index)}. ${choice.title}
                        </div>
                    </div>
                `;
            });

            content.innerHTML = html;
        },

        selectChoice: function(scenarioId, choiceId) {
            const scenario = GameData.scenarios[scenarioId];
            const choice = scenario.choices.find(c => c.id === choiceId);

            if (!choice) return;

            // Show consequence
            this.showConsequence(choice, scenario);

            // Mark scenario as completed
            if (!gameState.completedScenarios.includes(scenarioId)) {
                gameState.completedScenarios.push(scenarioId);
            }
        },

        showConsequence: function(choice, scenario) {
            const consequence = choice.consequence;
            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <div class="game-2d-mb-lg">
                    <h2 class="game-2d-dialogue-header game-2d-text-center">
                        Результат выбора
                    </h2>
            `;

            if (consequence.dialogue) {
                const speakerNames = {
                    'alex': 'Алекс',
                    'denis': 'Денис',
                    'katya': 'Катя',
                    'maria': 'Мария',
                    'igor': 'Игорь',
                    'lena': 'Лена',
                    'olga': 'Ольга',
                    'ceo': 'CEO',
                    'system': '📢'
                };

                html += `
                    <div class="game-2d-dialogue-box">
                        ${consequence.dialogue.map(line => `
                            <div class="game-2d-info-line">
                                <strong class="game-2d-dialogue-speaker">${speakerNames[line.speaker] || line.speaker}:</strong>
                                <span>${line.text}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            if (consequence.stats) {
                html += `
                    <div class="game-2d-stats-box">
                        <div class="game-2d-stats-title">📊 Изменения:</div>
                `;

                // Define stat icons and Russian names
                const statIcons = {
                    'xp': '⭐',
                    'time_left': '⏱️',
                    'time_cost': '⏱️',
                    'alex_stress': '😰',
                    'team_morale': '😊',
                    'team_stress': '😰',
                    'satisfaction': '😊',
                    'motivation': '💪',
                    'growth': '📈',
                    'problem_managed': '✅',
                    'risk_of_failure': '⚠️',
                    'sprint_plan': '📋',
                    'communication_skill': '💬',
                    'political_capital': '🏛️',
                    'work_life_balance': '⚖️',
                    'personal_life': '👨‍👩‍👧‍👦',
                    'loyalty': '💙'
                };

                const statNames = {
                    'xp': 'Опыт',
                    'time_left': 'Время осталось',
                    'time_cost': 'Затрачено времени',
                    'alex_stress': 'Стресс Алекса',
                    'team_morale': 'Боевой дух команды',
                    'team_stress': 'Стресс команды',
                    'team_satisfaction': 'Удовлетворение команды',
                    'morale': 'Боевой дух',
                    'stress': 'Стресс',
                    'katya_satisfaction': 'Удовлетворение Кати',
                    'katya_motivation': 'Мотивация Кати',
                    'katya_growth': 'Рост Кати',
                    'katya_development': 'Развитие Кати',
                    'katya_skills': 'Навыки Кати',
                    'denis_satisfaction': 'Удовлетворение Дениса',
                    'denis_motivation': 'Мотивация Дениса',
                    'denis_growth': 'Рост Дениса',
                    'denis_stress': 'Стресс Дениса',
                    'denis_understanding': 'Понимание Дениса',
                    'maria_satisfaction': 'Удовлетворение Марии',
                    'maria_growth': 'Рост Марии',
                    'maria_leadership': 'Лидерство Марии',
                    'maria_loyalty': 'Лояльность Марии',
                    'lena_satisfaction': 'Удовлетворение Лены',
                    'igor_satisfaction': 'Удовлетворение Игоря',
                    'ceo_satisfaction': 'Удовлетворение CEO',
                    'olga_satisfaction': 'Удовлетворение Ольги',
                    'satisfaction': 'Удовлетворение',
                    'motivation': 'Мотивация',
                    'growth': 'Рост',
                    'problem_managed': 'Проблема решена',
                    'risk_of_failure': 'Риск провала',
                    'sprint_plan': 'План спринта',
                    'sprint_impact': 'Влияние на спринт',
                    'communication_skill': 'Навык общения',
                    'skill_communication': 'Навык общения',
                    'skill_development': 'Развитие навыков',
                    'skill_people_management': 'Навык управления людьми',
                    'skill_project_management': 'Навык управления проектами',
                    'estimation_accuracy': 'Точность оценок',
                    'strategic_value': 'Стратегическая ценность',
                    'sprint_quality': 'Качество спринта',
                    'political_capital': 'Политический капитал',
                    'work_life_balance': 'Баланс жизни и работы',
                    'personal_life': 'Личная жизнь',
                    'loyalty': 'Лояльность',
                    'code_quality': 'Качество кода',
                    'team_morale_impact': 'Влияние на боевой дух',
                    'clarity': 'Ясность',
                    'quality_of_decision': 'Качество решения',
                    'client_satisfaction': 'Удовлетворение клиента',
                    'weekend_work': 'Работа в выходные',
                    'future_commitment': 'Будущие обязательства',
                    'maria_weekend': 'Выходные Марии',
                    'future_burnout_risk': 'Риск выгорания в будущем'
                };

                Object.entries(consequence.stats).forEach(([key, value]) => {
                    // Skip non-numeric values
                    if (typeof value !== 'number') return;

                    const sign = value > 0 ? '+' : '';
                    const colorClass = value > 0 ? 'game-2d-stat-positive' : 'game-2d-stat-negative';
                    const icon = statIcons[key] || '•';
                    const displayKey = statNames[key] || key.replace(/_/g, ' ');
                    const absValue = Math.abs(value);

                    // Create scale visualization
                    const scaleWidth = Math.min(absValue * 5, 100); // Max 100px for scale
                    const scaleColor = value > 0 ? '#4ecca3' : '#ff6b6b';

                    html += `
                        <div class="game-2d-stat-item">
                            <div class="game-2d-stat-label">
                                ${icon} <span class="game-2d-stat-name">${displayKey}</span>
                                <span class="${colorClass}"> ${sign}${value}</span>
                            </div>
                            <div class="game-2d-stat-scale">
                                <div class="game-2d-scale-bar" style="width: ${scaleWidth}px; background-color: ${scaleColor};"></div>
                            </div>
                        </div>
                    `;
                });

                html += `
                    </div>
                `;

                // Apply stats to gameState
                Object.entries(consequence.stats).forEach(([key, value]) => {
                    if (typeof value === 'number') {
                        // Initialize totalSkills if needed
                        if (!gameState.totalSkills) {
                            gameState.totalSkills = {};
                        }

                        // Initialize metric if it doesn't exist (default to 50)
                        if (!gameState.totalSkills[key]) {
                            gameState.totalSkills[key] = 50;
                        }

                        // Apply change
                        gameState.totalSkills[key] += value;

                        // Clamp values between 0 and 100 for most metrics
                        if (key !== 'xp' && key !== 'time_left') {
                            gameState.totalSkills[key] = Math.max(0, Math.min(100, gameState.totalSkills[key]));
                        }
                    }
                });

                // Apply XP separately
                gameState.totalXP += (consequence.stats.xp || 0);
            }

            if (consequence.feedback) {
                html += `
                    <div class="game-2d-feedback-box">
                        <div class="game-2d-feedback-title">
                            ${consequence.feedback.title}
                        </div>
                        ${(consequence.feedback.points || []).map(point =>
                            `<div class="game-2d-text-small game-2d-list-item">• ${point}</div>`
                        ).join('')}
                    </div>
                `;
            }

            html += `
                <button onclick="GameLesson2D.closeDialogue()"
                        class="game-2d-button game-2d-mt-md">
                    Продолжить
                </button>
                </div>
            `;

            content.innerHTML = html;
        },

        closeDialogue: function() {
            const modal = document.getElementById('dialogue-modal-2d');
            modal.classList.remove('active');
            document.getElementById('gameCanvas2D').style.display = 'block';
            gameState.currentScene = 'game';
            updateSidePanel();
        },

        resumeGame: function() {
            this.closeMenu();
            gameState.currentScene = 'game';
            document.getElementById('gameCanvas2D').style.display = 'block';
            updateSidePanel();
        },

        closeMenu: function() {
            const modal = document.getElementById('menu-modal-2d');
            modal.classList.remove('active');
        },

        showScenarioList: function() {
            // Placeholder
            alert('Выберите сценарий подойдя к нужному персонажу!\n\n' +
                  'Катя (розовая) - Обратная связь\n' +
                  'Мария (фиолетовая) - Планирование\n' +
                  'Игорь (желтая) - Распределение\n' +
                  'Лена (зеленая) - Planning Poker');
        },

        startCrisis: function() {
            this.closeMenu();
            this.showCrisisScenario();
        },

        showCrisisScenario: function() {
            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 class="game-2d-crisis-header">
                    🚨 КРИЗИС: ПЯТНИЦА В 17:00
                </h2>

                <div class="game-2d-crisis-box">
                    <div class="game-2d-crisis-box-title">
                        ⏰ На тебя одновременно свалилось 6 проблем
                    </div>
                    <div>
                        Только 60 минут до твоей личной встречи.
                        Как ты будешь расставлять приоритеты?
                    </div>
                </div>

                <button onclick="GameLesson2D.handleCrisisProblem(0)"
                        class="game-2d-crisis-button game-2d-mb-md">
                    ① ДЕНИС ЗАСТРЯЛ - Помощь?
                </button>

                <button onclick="GameLesson2D.handleCrisisProblem(1)"
                        class="game-2d-crisis-button game-2d-mb-md">
                    ② ИГОРЬ: БАГ В БОЕВОМ - Исправлять?
                </button>

                <button onclick="GameLesson2D.handleCrisisProblem(2)"
                        class="game-2d-crisis-button game-2d-mb-md">
                    ③ CEO: ПРЕЗЕНТАЦИЯ - Делать сам?
                </button>

                <button onclick="GameLesson2D.handleCrisisProblem(3)"
                        class="game-2d-crisis-button game-2d-mb-md">
                    ④ ПРОДАКТ: ПЕРЕДЕЛКА - Согласиться?
                </button>

                <button onclick="GameLesson2D.handleCrisisProblem(4)"
                        class="game-2d-crisis-button game-2d-mb-md">
                    ⑤ МАРИЯ: УХОДИТ - Отпустить?
                </button>

                <button onclick="GameLesson2D.handleCrisisProblem(5)"
                        class="game-2d-crisis-button game-2d-mb-md">
                    ⑥ ЛИЧНАЯ ВСТРЕЧА - Идти или остаться?
                </button>
            `;

            content.innerHTML = html;
            modal.classList.add('active');
            gameState.currentScene = 'crisis';
        },

        handleCrisisProblem: function(problemIndex) {
            const problems = GameData.crisisCase.problems;
            const problem = problems[problemIndex];

            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 class="game-2d-crisis-header">${problem.title}</h2>

                <div class="game-2d-crisis-box">
                    <strong>${problem.from}</strong> (${problem.time})<br>
                    <div class="game-2d-mt-sm">${problem.message}</div>
                </div>
            `;

            problem.choices.forEach((choice, index) => {
                html += `
                    <div class="game-2d-choice-option game-2d-mb-sm"
                         onclick="GameLesson2D.selectCrisisChoice(${problemIndex}, '${choice.id}')">
                        <div class="game-2d-choice-title">
                            ${String.fromCharCode(65 + index)}. ${choice.label}
                        </div>
                        <div class="game-2d-text-tiny">
                            ⏱️ ${choice.time_cost} мин
                        </div>
                    </div>
                `;
            });

            content.innerHTML = html;
        },

        selectCrisisChoice: function(problemIndex, choiceId) {
            const problem = GameData.crisisCase.problems[problemIndex];
            const choice = problem.choices.find(c => c.id === choiceId);

            if (!choice) return;

            // Save choice
            const problemId = problem.id;
            gameState.crisisChoices[problemId] = choiceId;

            // Apply time
            gameState.crisisTimeSpent += choice.time_cost;
            gameState.crisisTime -= choice.time_cost;

            // Count critical problems handled
            if (choice.recommended || choice.consequence.stats?.problem_managed) {
                gameState.criticalProblemsHandled++;
            }

            // Show consequence
            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 class="game-2d-dialogue-header game-2d-text-center">✓ Выбор сделан</h2>

                <div class="game-2d-feedback-box">
                    <strong>${choice.label}</strong>
                </div>

                <div class="game-2d-stats-box game-2d-text-small">
                    <div class="game-2d-stats-title">⏱️ Время:</div>
                    Потратил: ${choice.time_cost} мин | Осталось: ${gameState.crisisTime} мин
                </div>

                <button onclick="GameLesson2D.showCrisisScenario()"
                        class="game-2d-button">
                    Следующая проблема
                </button>
            `;

            content.innerHTML = html;

            // After all 6 problems, show results
            if (Object.keys(gameState.crisisChoices).length === 6) {
                setTimeout(() => this.showCrisisResults(), 1500);
            }
        },

        showCrisisResults: function() {
            const choices = gameState.crisisChoices;
            const problems = GameData.crisisCase.problems;

            // Determine which path
            let path = null;
            const crisisPath = GameData.crisisCase.finalPaths;

            // Check for Wise Leader
            if (choices.denis_stuck &&
                (choices.denis_stuck === 'delegate_maria' || choices.denis_stuck === 'google_it') &&
                choices.igor_bug === 'workaround_plan' &&
                choices.ceo_presentation === 'manage_expectations' &&
                (choices.product_rework === 'schedule_meeting' || choices.product_rework === 'quick_fix') &&
                choices.maria_leave === 'allow_freely' &&
                choices.personal_meeting === 'go_relaxed') {
                path = crisisPath.wise;
            }
            // Check for Burnout
            else if (choices.denis_stuck === 'help_myself' &&
                     choices.igor_bug === 'fix_myself_now' &&
                     choices.personal_meeting === 'cancel') {
                path = crisisPath.burnout;
            }
            // Default to Panic
            else {
                path = crisisPath.panic;
            }

            // Apply XP and skills
            gameState.totalXP += path.xp;
            if (path.skills) {
                Object.entries(path.skills).forEach(([skill, value]) => {
                    gameState.totalSkills[skill] = (gameState.totalSkills[skill] || 0) + value;
                });
            }
            if (path.achievements) {
                gameState.achievements.push(...path.achievements);
            }

            // Show results
            this.showResults(path);
        },

        showResults: function(path) {
            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 class="${path.outcome === 'optimal' ? 'game-2d-dialogue-header' : 'game-2d-crisis-header'}">
                    ${path.title}
                </h2>

                <div class="game-2d-feedback-box">
                    <div class="game-2d-feedback-title">📊 Результаты:</div>
                    ${path.immediate.map(result => `<div class="game-2d-list-item">✓ ${result}</div>`).join('')}
                </div>

                <div class="game-2d-stats-box">
                    <div class="game-2d-stats-title">📈 Награды:</div>
                    <div>⭐ +${path.xp} XP</div>
                    ${path.achievements ? `<div>🏆 Достижения: ${path.achievements.join(', ')}</div>` : ''}
                </div>

                <button onclick="GameLesson2D.startQuiz()"
                        class="game-2d-button game-2d-mt-md">
                    Пройти финальный тест →
                </button>
            `;

            content.innerHTML = html;
            modal.classList.add('active');
        },

        startQuiz: function() {
            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            const questions = GameData.quiz.questions;
            let currentQuestion = 0;

            const showQuestion = () => {
                const q = questions[currentQuestion];

                let html = `
                    <h2 class="game-2d-dialogue-header">
                        Вопрос ${currentQuestion + 1}/${questions.length}
                    </h2>

                    <div class="game-2d-context">
                        ${q.question}
                    </div>
                `;

                q.options.forEach((option, index) => {
                    html += `
                        <div class="game-2d-choice-option game-2d-mb-sm"
                             onclick="GameLesson2D.selectQuizAnswer('${q.id}', '${option.id}', ${option.correct}, ${currentQuestion}, ${questions.length})">
                            ${String.fromCharCode(65 + index)}. ${option.text}
                        </div>
                    `;
                });

                content.innerHTML = html;
            };

            showQuestion();
        },

        selectQuizAnswer: function(questionId, optionId, isCorrect, currentQuestion, totalQuestions) {
            gameState.quizAnswers.push({
                questionId: questionId,
                selectedOption: optionId,
                isCorrect: isCorrect
            });

            if (currentQuestion + 1 < totalQuestions) {
                // Show correct/incorrect and continue
                setTimeout(() => {
                    this.startQuiz();
                }, 500);
            } else {
                // Show final results
                this.showFinalResults();
            }
        },

        showFinalResults: function() {
            const correctAnswers = gameState.quizAnswers.filter(a => a.isCorrect).length;
            const totalAnswers = gameState.quizAnswers.length;
            const percentage = Math.round((correctAnswers / totalAnswers) * 100);

            // Add quiz bonus XP
            const quizBonus = Math.round((percentage / 100) * 50);
            gameState.totalXP += quizBonus;

            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 class="game-2d-dialogue-header game-2d-text-center">
                    🎉 ПОЗДРАВЛЯЕМ!
                </h2>

                <div class="game-2d-feedback-box game-2d-text-center">
                    <div class="game-2d-result-score">
                        ${percentage}%
                    </div>
                    <div class="game-2d-mt-sm">
                        Правильно: ${correctAnswers}/${totalAnswers}
                    </div>
                </div>

                <div class="game-2d-stats-box">
                    <div class="game-2d-stats-title">🎁 ФИНАЛЬНЫЕ НАГРАДЫ:</div>
                    <div>⭐ +${quizBonus} XP (бонус за тест)</div>
                    <div>💫 Итого XP за урок: ${gameState.totalXP}</div>
                </div>

                <button onclick="GameLesson2D.finishLesson()"
                        class="game-2d-button">
                    ✓ ЗАВЕРШИТЬ УРОК
                </button>
            `;

            content.innerHTML = html;
        },

        finishLesson: function() {
            // Log to SCORM
            if (window.scormAPI) {
                window.scormAPI.setValue('cmi.core.score.raw', gameState.totalXP);
                window.scormAPI.setValue('cmi.core.lesson_status', 'completed');
            }

            // Go back to main screen
            const modal = document.getElementById('dialogue-modal-2d');
            modal.classList.remove('active');
            alert(`✅ Урок пройден!\n\nВы получили: ${gameState.totalXP} XP\n\nВозвращаемся к меню...`);
            window.location.reload();
        },

        getStatus: function() {
            return {
                currentScene: gameState.currentScene,
                totalXP: gameState.totalXP,
                completedScenarios: gameState.completedScenarios.length,
                achievements: gameState.achievements
            };
        },

        showTheoryModal: function(blockId) {
            showTheoryModal(blockId);
        },

        showTheoryMenu: function() {
            showTheoryMenu();
        },

        closeTheoryModal: function() {
            closeTheoryModal();
        },

        getUnlockedTheoryBlocks: function() {
            return getUnlockedTheoryBlocks();
        }
    };
})();
