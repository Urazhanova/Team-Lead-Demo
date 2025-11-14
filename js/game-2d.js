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

        // Game progress
        completedScenarios: [],
        crisisChoices: {},
        quizAnswers: [],
        totalXP: 0,
        totalSkills: {},
        achievements: [],

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
            x: 100,
            y: 100,
            size: 40,
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
                    size: 40,
                    interactionDistance: 70,
                    canInteract: false
                };
            }
        });

        // Setup event listeners
        setupEventListeners();

        // Start game loop
        gameLoop();
    }

    function createGameHTML() {
        const container = document.createElement('div');
        container.id = 'game-2d-container';
        container.style.cssText = `
            display: grid;
            grid-template-rows: 60px 1fr 80px;
            height: 100vh;
            background: #1a1a2e;
            font-family: Arial, sans-serif;
        `;

        container.innerHTML = `
            <!-- Top Bar -->
            <div style="background: linear-gradient(180deg, #2d2d44 0%, #1f1f2e 100%);
                        display: flex; align-items: center; justify-content: space-between;
                        padding: 0 20px; border-bottom: 3px solid #3d3d5c;">
                <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
                            color: white; padding: 8px 20px; border-radius: 20px;
                            font-weight: bold; font-size: 14px;">
                    📅 ДЕНЬ 5 | Пятница, 16:00
                </div>
                <div style="color: #4ecca3; font-size: 13px; display: flex; gap: 16px;">
                    <div>⭐ <span id="xp-counter">0</span> XP</div>
                    <div>🏆 Level <span id="level-counter">1</span></div>
                </div>
            </div>

            <!-- Main Game Area -->
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 0; background: #16213e;">
                <div style="position: relative; background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                            display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <canvas id="gameCanvas2D" width="800" height="600"
                            style="border: 3px solid #1f4068; display: block;"></canvas>
                </div>

                <div id="side-panel" style="background: linear-gradient(135deg, #1f4068 0%, #16213e 100%);
                                            border-left: 3px solid #2d5f8d;
                                            padding: 20px; overflow-y: auto;
                                            color: white; font-size: 13px;">
                    <div style="color: #4ecca3; font-weight: bold; margin-bottom: 16px;">📋 СТАТУС</div>
                    <div id="game-status" style="color: rgba(255,255,255,0.9);"></div>
                </div>
            </div>

            <!-- Bottom Panel -->
            <div style="background: linear-gradient(180deg, #1f1f2e 0%, #2d2d44 100%);
                        border-top: 3px solid #3d3d5c;
                        display: flex; align-items: center; justify-content: center;
                        padding: 0 20px;">
                <div id="bottom-objective" style="color: #4ecca3; font-size: 14px; font-weight: bold; text-align: center;">
                    Добро пожаловать! Нажми SPACE для меню.
                </div>
            </div>

            <!-- Dialogue Modal -->
            <div id="dialogue-modal-2d" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                                               background: rgba(0,0,0,0.85); z-index: 1000;
                                               align-items: center; justify-content: center;">
                <div id="dialogue-content" style="background: linear-gradient(135deg, #2d2d44 0%, #1f1f2e 100%);
                                                  border: 3px solid #4ecca3;
                                                  border-radius: 24px;
                                                  padding: 30px;
                                                  max-width: 600px;
                                                  width: 90%;
                                                  max-height: 80vh;
                                                  overflow-y: auto;
                                                  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                                                  color: white;">
                </div>
            </div>

            <!-- Menu Modal -->
            <div id="menu-modal-2d" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                                           background: rgba(0,0,0,0.85); z-index: 1001;
                                           align-items: center; justify-content: center;">
                <div id="menu-content" style="background: linear-gradient(135deg, #2d2d44 0%, #1f1f2e 100%);
                                              border: 3px solid #4ecca3;
                                              border-radius: 24px;
                                              padding: 40px;
                                              max-width: 500px;
                                              width: 90%;
                                              box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                                              color: white;">
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

            if (e.key.toLowerCase() === 'e') {
                e.preventDefault();
                handleInteraction();
            }
        });

        document.addEventListener('keyup', (e) => {
            gameState.keys[e.key.toLowerCase()] = false;
        });
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

        // Add visual feedback
        gameState.lastZoneMessage = {
            text: `Вы вошли в ${zone.label}`,
            time: Date.now(),
            duration: 2000
        };
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
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('E', npc.x + npc.size/2, npc.y - 20);

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
            <div style="margin-bottom: 30px;">
                <h2 style="color: #4ecca3; margin-bottom: 20px; text-align: center;">
                    ${scenario.title}
                </h2>

                <div style="background: rgba(78, 204, 163, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="color: #4ecca3; font-weight: bold; margin-bottom: 10px;">📖 Ситуация:</div>
                    <div>${scenario.introduction.text}</div>
                </div>
        `;

        if (scenario.introduction.context) {
            html += `
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffd93d;">
                    <div style="color: #ffd93d; font-weight: bold; margin-bottom: 8px;">${scenario.introduction.context.title}</div>
                    <div>
                        ${scenario.introduction.context.items.map(item => `<div>• ${item}</div>`).join('')}
                    </div>
                </div>
            `;
        }

        html += `
            <div style="text-align: center;">
                <button onclick="GameLesson2D.showChoices('${scenario.id}')"
                        style="background: linear-gradient(135deg, #4ecca3 0%, #2ecc71 100%);
                               color: white; border: none; padding: 12px 30px;
                               border-radius: 12px; cursor: pointer; font-weight: bold;
                               margin-top: 20px;">
                    Что делать? →
                </button>
            </div>
            </div>
        `;

        content.innerHTML = html;
        modal.style.display = 'flex';
    }

    // ============================================
    // MENU SYSTEM
    // ============================================

    function showMenu() {
        const modal = document.getElementById('menu-modal-2d');
        const content = document.getElementById('menu-content');

        let html = `
            <h2 style="color: #4ecca3; margin-bottom: 20px; text-align: center;">МЕНЮ</h2>

            <div style="margin-bottom: 15px;">
                <button onclick="GameLesson2D.resumeGame()"
                        style="width: 100%; padding: 12px; background: #4ecca3; color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Продолжить игру (SPACE)
                </button>
            </div>

            <div style="margin-bottom: 15px;">
                <button onclick="GameLesson2D.showScenarioList()"
                        style="width: 100%; padding: 12px; background: rgba(78, 204, 163, 0.5); color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Выбрать сценарий
                </button>
            </div>

            <div style="margin-bottom: 15px;">
                <button onclick="GameLesson2D.startCrisis()"
                        style="width: 100%; padding: 12px; background: #ff6b6b; color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Финальный кризис (🚨)
                </button>
            </div>

            <div style="margin-bottom: 15px;">
                <button onclick="GameLesson2D.closeMenu()"
                        style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.2); color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Закрыть
                </button>
            </div>

            <div style="margin-top: 20px; color: rgba(255, 255, 255, 0.6); font-size: 12px; text-align: center;">
                <div>⌨️ Управление: WASD или стрелки</div>
                <div>💬 Взаимодействие: E</div>
                <div>📋 Меню: SPACE</div>
            </div>
        `;

        content.innerHTML = html;
        modal.style.display = 'flex';
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
            <div style="color: #4ecca3; font-weight: bold; margin-bottom: 16px;">👥 РЯДОМ</div>
            ${nearbyNPCs.length > 0
                ? nearbyNPCs.map(key => {
                    const npc = gameState.npcs[key];
                    return `
                        <div style="background: rgba(78, 204, 163, 0.2); padding: 12px;
                                   border-radius: 8px; border-left: 3px solid #4ecca3; margin-bottom: 12px;">
                            <div style="font-weight: bold;">${npc.emoji} ${npc.name}</div>
                            <div style="font-size: 11px; opacity: 0.8;">${npc.role}</div>
                            <div style="margin-top: 8px; color: #4ecca3; font-size: 12px;">
                                Нажми E для диалога
                            </div>
                        </div>
                    `;
                }).join('')
                : '<div style="color: rgba(255, 255, 255, 0.6);">Никого рядом</div>'
            }

            <div style="margin-top: 20px; color: #4ecca3; font-weight: bold; margin-bottom: 8px;">
                📊 СТАТИСТИКА
            </div>
            <div style="font-size: 12px;">
                <div>XP: <span id="xp-stat">${gameState.totalXP}</span></div>
                <div style="margin-top: 8px;">Сценариев пройдено: <span id="scenarios-stat">${gameState.completedScenarios.length}</span></div>
            </div>
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
                <h2 style="color: #4ecca3; margin-bottom: 20px; text-align: center;">Что выбираешь?</h2>
            `;

            scenario.choices.forEach((choice, index) => {
                html += `
                    <div style="background: rgba(78, 204, 163, 0.2); padding: 15px;
                               border-radius: 12px; margin-bottom: 12px; cursor: pointer;
                               border: 2px solid rgba(78, 204, 163, 0.5);
                               transition: all 0.3s ease;"
                         onclick="GameLesson2D.selectChoice('${scenarioId}', '${choice.id}')"
                         onmouseover="this.style.background='rgba(78, 204, 163, 0.3)';
                                     this.style.borderColor='#4ecca3';"
                         onmouseout="this.style.background='rgba(78, 204, 163, 0.2)';
                                    this.style.borderColor='rgba(78, 204, 163, 0.5)';">
                        <div style="font-weight: bold; margin-bottom: 4px;">
                            ${String.fromCharCode(65 + index)}. ${choice.title}
                        </div>
                        <div style="font-size: 12px; opacity: 0.8;">
                            ${choice.hint}
                        </div>
                        ${choice.recommended ? '<div style="color: #ffd93d; font-size: 11px; margin-top: 4px;">⭐ Рекомендуемый выбор</div>' : ''}
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
                <div style="margin-bottom: 20px;">
                    <h2 style="color: #4ecca3; margin-bottom: 20px; text-align: center;">
                        ${choice.recommended ? '✅ Отличный выбор!' : '⚠️ Результат'}
                    </h2>
            `;

            if (consequence.dialogue) {
                html += `
                    <div style="background: rgba(78, 204, 163, 0.1); padding: 15px;
                               border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #4ecca3;">
                        ${consequence.dialogue.map(line => `
                            <div style="margin-bottom: 8px;">
                                <strong style="color: #4ecca3;">${line.speaker}:</strong>
                                <span style="color: white;">${line.text}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            if (consequence.stats) {
                html += `
                    <div style="background: rgba(255, 217, 61, 0.1); padding: 15px;
                               border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #ffd93d;">
                        <div style="color: #ffd93d; font-weight: bold; margin-bottom: 10px;">📊 Изменения:</div>
                        ${Object.entries(consequence.stats).map(([key, value]) => {
                            const sign = value > 0 ? '+' : '';
                            const color = value > 0 ? '#4ecca3' : '#ff6b6b';
                            return `<div style="color: ${color}; font-size: 12px;">• ${key}: ${sign}${value}</div>`;
                        }).join('')}
                    </div>
                `;

                // Apply stats
                gameState.totalXP += (consequence.stats.xp || 0);
            }

            if (consequence.feedback) {
                html += `
                    <div style="background: rgba(78, 204, 163, 0.15); padding: 15px;
                               border-radius: 12px; margin-bottom: 15px;">
                        <div style="color: #4ecca3; font-weight: bold; margin-bottom: 10px;">
                            ${consequence.feedback.title}
                        </div>
                        ${(consequence.feedback.points || []).map(point =>
                            `<div style="font-size: 12px; margin-bottom: 6px; line-height: 1.5;">• ${point}</div>`
                        ).join('')}
                    </div>
                `;
            }

            html += `
                <button onclick="GameLesson2D.closeDialogue()"
                        style="width: 100%; padding: 12px; background: #4ecca3; color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;
                               margin-top: 15px;">
                    Продолжить
                </button>
                </div>
            `;

            content.innerHTML = html;
        },

        closeDialogue: function() {
            const modal = document.getElementById('dialogue-modal-2d');
            modal.style.display = 'none';
            document.getElementById('gameCanvas2D').style.display = 'block';
            gameState.currentScene = 'game';
            updateSidePanel();
        },

        resumeGame: function() {
            this.closeMenu();
            gameState.currentScene = 'game';
            document.getElementById('gameCanvas2D').style.display = 'block';
        },

        closeMenu: function() {
            const modal = document.getElementById('menu-modal-2d');
            modal.style.display = 'none';
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
                <h2 style="color: #ff6b6b; margin-bottom: 20px; text-align: center;">
                    🚨 КРИЗИС: ПЯТНИЦА В 17:00
                </h2>

                <div style="background: rgba(255, 107, 107, 0.2); padding: 20px; border-radius: 12px;
                           border-left: 4px solid #ff6b6b; margin-bottom: 20px;">
                    <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 10px;">
                        ⏰ На тебя одновременно свалилось 6 проблем
                    </div>
                    <div style="color: white; font-size: 13px; line-height: 1.6;">
                        Только 60 минут до твоей личной встречи.
                        Как ты будешь расставлять приоритеты?
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <button onclick="GameLesson2D.handleCrisisProblem(0)"
                            style="width: 100%; padding: 12px; background: rgba(255, 107, 107, 0.3);
                                   color: white; border: 2px solid #ff6b6b; border-radius: 8px;
                                   cursor: pointer; font-weight: bold; text-align: left;">
                        ① ДЕНИС ЗАСТРЯЛ - Помощь?
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button onclick="GameLesson2D.handleCrisisProblem(1)"
                            style="width: 100%; padding: 12px; background: rgba(255, 107, 107, 0.3);
                                   color: white; border: 2px solid #ff6b6b; border-radius: 8px;
                                   cursor: pointer; font-weight: bold; text-align: left;">
                        ② ИГОРЬ: БАГ В БОЕВОМ - Исправлять?
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button onclick="GameLesson2D.handleCrisisProblem(2)"
                            style="width: 100%; padding: 12px; background: rgba(255, 107, 107, 0.3);
                                   color: white; border: 2px solid #ff6b6b; border-radius: 8px;
                                   cursor: pointer; font-weight: bold; text-align: left;">
                        ③ CEO: ПРЕЗЕНТАЦИЯ - Делать сам?
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button onclick="GameLesson2D.handleCrisisProblem(3)"
                            style="width: 100%; padding: 12px; background: rgba(255, 107, 107, 0.3);
                                   color: white; border: 2px solid #ff6b6b; border-radius: 8px;
                                   cursor: pointer; font-weight: bold; text-align: left;">
                        ④ ПРОДАКТ: ПЕРЕДЕЛКА - Согласиться?
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button onclick="GameLesson2D.handleCrisisProblem(4)"
                            style="width: 100%; padding: 12px; background: rgba(255, 107, 107, 0.3);
                                   color: white; border: 2px solid #ff6b6b; border-radius: 8px;
                                   cursor: pointer; font-weight: bold; text-align: left;">
                        ⑤ МАРИЯ: УХОДИТ - Отпустить?
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button onclick="GameLesson2D.handleCrisisProblem(5)"
                            style="width: 100%; padding: 12px; background: rgba(255, 107, 107, 0.3);
                                   color: white; border: 2px solid #ff6b6b; border-radius: 8px;
                                   cursor: pointer; font-weight: bold; text-align: left;">
                        ⑥ ЛИЧНАЯ ВСТРЕЧА - Идти или остаться?
                    </button>
                </div>
            `;

            content.innerHTML = html;
            modal.style.display = 'flex';
            gameState.currentScene = 'crisis';
        },

        handleCrisisProblem: function(problemIndex) {
            const problems = GameData.crisisCase.problems;
            const problem = problems[problemIndex];

            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            let html = `
                <h2 style="color: #ff6b6b; margin-bottom: 20px;">${problem.title}</h2>

                <div style="background: rgba(255, 107, 107, 0.15); padding: 15px; border-radius: 12px;
                           border-left: 4px solid #ff6b6b; margin-bottom: 20px;">
                    <strong>${problem.from}</strong> (${problem.time})<br>
                    <div style="margin-top: 10px; font-size: 13px;">${problem.message}</div>
                </div>
            `;

            problem.choices.forEach((choice, index) => {
                html += `
                    <div style="background: rgba(78, 204, 163, 0.1); padding: 12px;
                               border-radius: 8px; margin-bottom: 10px; cursor: pointer;
                               border: 2px solid rgba(78, 204, 163, 0.3);"
                         onclick="GameLesson2D.selectCrisisChoice(${problemIndex}, '${choice.id}')"
                         onmouseover="this.style.borderColor='#4ecca3';"
                         onmouseout="this.style.borderColor='rgba(78, 204, 163, 0.3)';">
                        <div style="font-weight: bold; color: #4ecca3; margin-bottom: 4px;">
                            ${String.fromCharCode(65 + index)}. ${choice.label}
                        </div>
                        <div style="font-size: 11px; opacity: 0.8;">
                            ⏱️ ${choice.time_cost} мин
                            ${choice.recommended ? ' | ⭐ Рекомендуемо' : ''}
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
                <h2 style="color: #4ecca3; margin-bottom: 15px; text-align: center;">✓ Выбор сделан</h2>

                <div style="background: rgba(78, 204, 163, 0.15); padding: 15px; border-radius: 12px;
                           margin-bottom: 15px; border-left: 4px solid #4ecca3;">
                    <strong>${choice.label}</strong>
                </div>

                <div style="background: rgba(255, 217, 61, 0.1); padding: 12px; border-radius: 8px;
                           margin-bottom: 15px; border-left: 4px solid #ffd93d; font-size: 12px;">
                    <div style="color: #ffd93d; font-weight: bold; margin-bottom: 8px;">⏱️ Время:</div>
                    Потратил: ${choice.time_cost} мин | Осталось: ${gameState.crisisTime} мин
                </div>

                <button onclick="GameLesson2D.showCrisisScenario()"
                        style="width: 100%; padding: 12px; background: #4ecca3; color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
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
                <h2 style="color: ${path.outcome === 'optimal' ? '#4ecca3' : '#ff6b6b'};
                          margin-bottom: 20px; text-align: center;">
                    ${path.title}
                </h2>

                <div style="background: rgba(78, 204, 163, 0.15); padding: 15px; border-radius: 12px;
                           margin-bottom: 15px; border-left: 4px solid #4ecca3;">
                    <div style="color: #4ecca3; font-weight: bold; margin-bottom: 10px;">📊 Результаты:</div>
                    ${path.immediate.map(result => `<div style="margin-bottom: 6px;">✓ ${result}</div>`).join('')}
                </div>

                <div style="background: rgba(255, 217, 61, 0.1); padding: 15px; border-radius: 12px;
                           margin-bottom: 15px; border-left: 4px solid #ffd93d;">
                    <div style="color: #ffd93d; font-weight: bold; margin-bottom: 10px;">📈 Награды:</div>
                    <div>⭐ +${path.xp} XP</div>
                    ${path.achievements ? `<div>🏆 Достижения: ${path.achievements.join(', ')}</div>` : ''}
                </div>

                <button onclick="GameLesson2D.startQuiz()"
                        style="width: 100%; padding: 12px; background: #4ecca3; color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;
                               margin-top: 15px;">
                    Пройти финальный тест →
                </button>
            `;

            content.innerHTML = html;
            modal.style.display = 'flex';
        },

        startQuiz: function() {
            const modal = document.getElementById('dialogue-modal-2d');
            const content = document.getElementById('dialogue-content');

            const questions = GameData.quiz.questions;
            let currentQuestion = 0;

            const showQuestion = () => {
                const q = questions[currentQuestion];

                let html = `
                    <h2 style="color: #4ecca3; margin-bottom: 20px;">
                        Вопрос ${currentQuestion + 1}/${questions.length}
                    </h2>

                    <div style="background: rgba(78, 204, 163, 0.1); padding: 15px; border-radius: 12px;
                               margin-bottom: 20px; border-left: 4px solid #4ecca3;">
                        ${q.question}
                    </div>
                `;

                q.options.forEach((option, index) => {
                    html += `
                        <div style="background: rgba(78, 204, 163, 0.1); padding: 12px;
                                   border-radius: 8px; margin-bottom: 10px; cursor: pointer;
                                   border: 2px solid rgba(78, 204, 163, 0.3);"
                             onclick="GameLesson2D.selectQuizAnswer('${q.id}', '${option.id}', ${option.correct}, ${currentQuestion}, ${questions.length})"
                             onmouseover="this.style.borderColor='#4ecca3';"
                             onmouseout="this.style.borderColor='rgba(78, 204, 163, 0.3)';">
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
                <h2 style="color: #4ecca3; margin-bottom: 20px; text-align: center;">
                    🎉 ПОЗДРАВЛЯЕМ!
                </h2>

                <div style="background: rgba(78, 204, 163, 0.2); padding: 20px; border-radius: 12px;
                           margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 36px; color: #4ecca3; font-weight: bold;">
                        ${percentage}%
                    </div>
                    <div style="margin-top: 10px;">
                        Правильно: ${correctAnswers}/${totalAnswers}
                    </div>
                </div>

                <div style="background: rgba(255, 217, 61, 0.15); padding: 15px; border-radius: 12px;
                           border-left: 4px solid #ffd93d; margin-bottom: 20px;">
                    <div style="color: #ffd93d; font-weight: bold; margin-bottom: 10px;">🎁 ФИНАЛЬНЫЕ НАГРАДЫ:</div>
                    <div>⭐ +${quizBonus} XP (бонус за тест)</div>
                    <div>💫 Итого XP за урок: ${gameState.totalXP}</div>
                </div>

                <button onclick="GameLesson2D.finishLesson()"
                        style="width: 100%; padding: 12px; background: #4ecca3; color: white;
                               border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
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
            modal.style.display = 'none';
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
        }
    };
})();
