/**
 * MessengerGame - Lesson 4
 * Simulates a workplace messenger interface
 *
 * TIME SYSTEM:
 * - T_Game: Game time (09:10 - 18:00) in HH:MM format
 * - T_Game changes only when player makes a choice (+timeCost minutes)
 * - R_Time: Real time elapsed (in seconds) - tracks actual time for conditions
 */
var MessengerGame = {
    config: null,
    contacts: [],
    scenarios: [],
    state: {
        gameTime: "09:10",           // T_Game: current game time (HH:MM)
        gameTimeMinutes: 550,         // T_Game in minutes (09:10 = 550 min from 00:00)
        energy: 100,                  // Current energy level
        stress: 0,                    // Current stress level
        activeContactId: null,        // Currently open chat
        messages: {},                 // Map of contactId -> array of messages
        completedScenarios: [],       // IDs of completed scenarios
        choicesMade: [],              // Track specific choices made
        unreadCount: 0,               // Count of unread messages
        realTimeElapsed: 0,           // R_Time: real seconds elapsed from game start
        allMessagesReadTime: null,    // R_Time when all messages were read
        goodStartShown: false,        // Whether good start screen was shown
        lastMessageAddedTime: null    // R_Time when last message was added
    },
    container: null,
    realTimeInterval: null,           // Interval for tracking real time

    init: function (container, lessonData) {
        console.log("[MessengerGame] Initializing...", container);
        if (!container) {
            console.error("[MessengerGame] Container is null!");
            return;
        }
        this.container = container;
        this.loadScenarios();
    },

    // ========== TIME UTILITIES ==========

    /**
     * Convert HH:MM format to minutes from 00:00
     * Example: "09:10" -> 550 minutes
     */
    timeToMinutes: function (timeStr) {
        var parts = timeStr.split(':');
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);
        return hours * 60 + minutes;
    },

    /**
     * Convert minutes from 00:00 to HH:MM format
     * Example: 550 -> "09:10"
     */
    minutesToTime: function (totalMinutes) {
        var hours = Math.floor(totalMinutes / 60);
        var mins = totalMinutes % 60;
        return String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0');
    },

    /**
     * Check if first time is >= second time (in HH:MM format)
     */
    isTimeReached: function (currentTime, triggerTime) {
        var currentMins = this.timeToMinutes(currentTime);
        var triggerMins = this.timeToMinutes(triggerTime);
        return currentMins >= triggerMins;
    },

    /**
     * Add minutes to game time
     * Example: addMinutesToTime("09:10", 30) -> "09:40"
     */
    addMinutesToTime: function (timeStr, minutes) {
        var totalMins = this.timeToMinutes(timeStr) + minutes;
        return this.minutesToTime(totalMins);
    },

    // ========== END TIME UTILITIES ==========

    loadScenarios: function () {
        var self = this;
        // First load messenger-scenarios.json for the initial demo
        fetch('data/messenger-scenarios.json?v=' + new Date().getTime())
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!data || !data.scenarios) {
                    throw new Error("Invalid messenger scenarios structure");
                }
                // Store messenger scenarios for demo
                self.messengerScenarios = data.scenarios;
                self.messengerContacts = data.contacts;
                // Store config for initial state
                self.config = data.config;
                self.initializeState();
                // Show initial demo messages
                self.showInitialMessages();
            })
            .catch(function (err) {
                console.error("[MessengerGame] Error loading messenger scenarios:", err);
                if (self.container) {
                    self.container.innerHTML = '<div class="error">Error loading game data: ' + err.message + '</div>';
                }
            });
    },

    /**
     * Load full game scenarios after Good Start is clicked
     */
    loadFullGameScenarios: function () {
        var self = this;
        // Save demo messages before replacing contacts
        var savedMessages = this.state.messages;

        fetch('data/full-game-scenarios.json?v=' + new Date().getTime())
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!data || !data.config || !data.contacts || !data.scenarios) {
                    throw new Error("Invalid full game data structure");
                }
                // Replace config/contacts/scenarios with full game data
                self.config = data.config;
                self.contacts = data.contacts;
                self.scenarios = data.scenarios;

                // Reset time to 09:10 for full game
                self.state.gameTime = self.config.startTime; // "09:10"
                self.state.gameTimeMinutes = self.timeToMinutes(self.config.startTime);

                // IMPORTANT: Keep saved demo messages!
                self.state.messages = savedMessages;

                // Initialize message history for full game contacts (that don't have demo messages)
                self.contacts.forEach(function (contact) {
                    if (!self.state.messages[contact.id]) {
                        self.state.messages[contact.id] = [];
                    }
                    // Initialize unread tracking for new contacts
                    if (typeof self.state.unread[contact.id] === 'undefined') {
                        self.state.unread[contact.id] = false;
                    }
                }, self);

                // Start the game
                self.startGame();
            })
            .catch(function (err) {
                console.error("[MessengerGame] Error loading full game scenarios:", err);
                if (self.container) {
                    self.container.innerHTML = '<div class="error">Error loading full game: ' + err.message + '</div>';
                }
            });
    },

    initializeState: function () {
        // Use messenger config for initial state, will be replaced with full game config later
        var configToUse = this.config || { startTime: "09:00", initialEnergy: 100, initialStress: 0 };

        // Initialize T_Game (game time in HH:MM format)
        this.state.gameTime = configToUse.startTime;
        this.state.gameTimeMinutes = this.timeToMinutes(configToUse.startTime);

        this.state.energy = configToUse.initialEnergy;      // 100%
        this.state.stress = configToUse.initialStress;      // 0%
        this.state.messages = {};
        this.state.completedScenarios = [];
        this.state.choicesMade = [];
        this.state.activeContactId = null;
        this.state.gameStarted = false;
        this.state.realTimeElapsed = 0;                     // R_Time starts at 0
        this.state.allMessagesReadTime = null;
        this.state.goodStartShown = false;
        this.state.lastMessageAddedTime = null;
        this.state.mealSkipped = false;                     // Track if meal was skipped for penalty
        this.state.pendingEscalations = [];                 // Track scenarios awaiting escalation
        this.state.gameEnded = false;                       // Flag to prevent multiple game over checks

        // Initialize message history for each contact
        this.contacts.forEach(function (contact) {
            this.state.messages[contact.id] = [];
        }, this);

        // Initialize unread tracking
        this.state.unread = {};
        this.contacts.forEach(function (contact) {
            this.state.unread[contact.id] = false;
        }, this);

        // No initial triggers check here, as game starts after Good Start screen
    },

    startGame: function () {
        this.state.gameStarted = true;
        console.log("[MessengerGame] Game started at T_Game=" + this.state.gameTime);

        this.render();

        // Load initial scenarios at starting T_Game (09:10)
        this.checkTriggers();

        this.startRealTimeTracking(); // Start R_Time counter (for lunch break tracking)
    },

    /**
     * Track real time (R_Time) for conditions and events
     * This runs independently from T_Game
     */
    startRealTimeTracking: function () {
        if (this.realTimeInterval) clearInterval(this.realTimeInterval);

        this.realTimeInterval = setInterval(function () {
            this.state.realTimeElapsed += 1; // 1 real second

            // Check for lunch break condition (10 real minutes elapsed OR all messages read + 2 sec)
            this.checkLunchCondition();

        }.bind(this), 1000); // Update every 1 real second

        // Note: Scenarios load based on T_Game triggers via processTimeGap() and checkTriggers()
        // R_Time is used only for lunch break tracking, not scenario loading
    },

    /**
     * Check if lunch break should trigger
     * Condition: 10 real minutes elapsed OR all messages read + 2 seconds
     */
    checkLunchCondition: function () {
        if (this.state.gameTime !== "12:00") return; // Lunch only at 12:00 game time

        var readyForLunch = false;

        // Condition 1: 10 real minutes elapsed
        if (this.state.realTimeElapsed >= 600) { // 600 seconds = 10 minutes
            readyForLunch = true;
        }

        // Condition 2: All messages read + 2 seconds
        if (this.state.allMessagesReadTime !== null &&
            this.state.realTimeElapsed >= this.state.allMessagesReadTime + 2) {
            readyForLunch = true;
        }

        if (readyForLunch && !this.state.lunchShown) {
            this.showLunchModal();
        }
    },

    /**
     * Show lunch break modal with choices
     */
    showLunchModal: function () {
        this.state.lunchShown = true;
        console.log("[MessengerGame] Lunch time! T_Game=" + this.state.gameTime);

        if (!this.container) return;

        // Create modal overlay
        var modalHtml = `
            <div class="lunch-modal">
                <div class="lunch-content">
                    <h2>🍽️ ВРЕМЯ ОБЕДА</h2>
                    <p>Наступил полдень. Пора позаботиться о себе.</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 25px;">Выбери, что хочешь сделать:</p>

                    <div class="lunch-choices">
                        <button class="lunch-btn lunch-full" onclick="window.messengerGame.makeLunchChoice('full')">
                            <div class="lunch-title">[A] ПОЛНЫЙ ОБЕД</div>
                            <div class="lunch-description">Хорошая еда, отдых на 30 минут</div>
                            <div class="lunch-impact">
                                <span class="lunch-time">⏱️ +30 мин</span>
                                <span class="lunch-energy positive">⚡ +25%</span>
                            </div>
                        </button>

                        <button class="lunch-btn lunch-quick" onclick="window.messengerGame.makeLunchChoice('quick')">
                            <div class="lunch-title">[B] БЫСТРЫЙ ПЕРЕКУС</div>
                            <div class="lunch-description">Кофе и бутерброд на 15 минут</div>
                            <div class="lunch-impact">
                                <span class="lunch-time">⏱️ +15 мин</span>
                                <span class="lunch-energy positive">⚡ +15%</span>
                            </div>
                        </button>

                        <button class="lunch-btn lunch-skip" onclick="window.messengerGame.makeLunchChoice('skip')">
                            <div class="lunch-title">[C] ПРОПУСТИТЬ</div>
                            <div class="lunch-description">Остаться в работе (штраф к эффективности)</div>
                            <div class="lunch-impact">
                                <span class="lunch-time">⏱️ +5 мин</span>
                                <span class="lunch-energy negative">⚡ -10%</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to container
        var modalEl = document.createElement('div');
        modalEl.innerHTML = modalHtml;
        this.container.appendChild(modalEl.firstElementChild);
    },

    /**
     * Handle lunch choice selection
     */
    makeLunchChoice: function (choice) {
        console.log("[MessengerGame] Lunch choice: " + choice);

        var timeBonus = 0;
        var energyBonus = 0;
        var willHavePenalty = false;

        switch (choice) {
            case 'full':
                timeBonus = 30;
                energyBonus = 25;
                break;
            case 'quick':
                timeBonus = 15;
                energyBonus = 15;
                break;
            case 'skip':
                timeBonus = 5;
                energyBonus = -10;
                willHavePenalty = true;
                break;
        }

        // Apply lunch effects
        this.advanceTime(timeBonus);
        this.state.energy = Math.min(100, this.state.energy + energyBonus);

        // Set penalty flag if meal was skipped
        if (willHavePenalty) {
            this.state.mealSkipped = true;
            console.log("[MessengerGame] Meal skipped - penalty applied to future choices (+50% time cost, +50% energy cost)");
        }

        // Update stats
        this.updateStats();

        // Check if game is over
        this.checkGameOver();

        // Remove modal
        var modal = this.container.querySelector('.lunch-modal');
        if (modal) {
            modal.remove();
        }

        // Resume game
        this.renderChatWindow(this.state.activeContactId);
        this.renderContactList();
    },

    /**
     * Handle escalation choice selection
     */
    makeEscalationChoice: function (escalationMessage, choice) {
        console.log("[MessengerGame] Escalation choice made: " + choice.id);

        // Remember old T_Game for time gap processing
        var oldGameTimeMinutes = this.state.gameTimeMinutes;

        // Apply resource costs (with meal skip penalty if applicable)
        var energyCost = choice.energyCost;
        var timeCost = choice.timeCost;

        if (this.state.mealSkipped) {
            // Meal skip penalty: +50% time and +50% energy cost
            timeCost = Math.ceil(timeCost * 1.5);
            energyCost = Math.ceil(energyCost * 1.5);
        }

        this.state.energy = Math.max(0, this.state.energy - energyCost);

        // Advance T_Game
        this.advanceTime(timeCost);

        var contactId = this.state.activeContactId;

        // Add player's confirmation message from Alex (the choice/decision)
        this.addMessage(contactId, {
            sender: 'alex',
            text: choice.description,
            timestamp: this.state.gameTime
        });

        // Add response message from the contact
        this.addMessage(contactId, {
            sender: contactId,
            text: choice.response,
            timestamp: this.state.gameTime
        });

        // Track the choice
        if (!this.state.choicesMade) this.state.choicesMade = [];
        this.state.choicesMade.push(choice.id);

        // IMPORTANT: Process time gap - load all events between oldGameTime and newGameTime
        this.processTimeGap(oldGameTimeMinutes, this.state.gameTimeMinutes);

        // Check triggers to load scenarios that should be active at new T_Game
        this.checkTriggers();

        // Update stats
        this.updateStats();

        // Check if game is over
        this.checkGameOver();

        // Re-render chat to show new choices or clear resolved escalation
        this.renderChatWindow(contactId);
        this.renderContactList();
    },

    /**
     * Check if game over conditions are met
     */
    checkGameOver: function () {
        // Don't check if game is already ended
        if (this.state.gameEnded) return;

        // Condition 1: Energy depleted - LOSS
        if (this.state.energy <= 0) {
            console.log("[MessengerGame] GAME OVER: Energy depleted!");
            this.state.gameEnded = true;
            this.showGameOver('loss', 'energy');
            return;
        }

        // Condition 2: Time reached 18:00 (end of workday) - determine WIN level
        if (this.isTimeReached(this.state.gameTime, "18:00")) {
            console.log("[MessengerGame] Game reached 18:00! Energy: " + this.state.energy);
            this.state.gameEnded = true;

            // Determine win level based on remaining energy
            if (this.state.energy > 50) {
                // Gold victory - great resource management
                console.log("[MessengerGame] GOLD VICTORY: Completed day with excellent energy management!");
                this.showGameOver('win', 'gold');
            } else if (this.state.energy >= 10) {
                // Silver victory - decent resource management
                console.log("[MessengerGame] SILVER VICTORY: Completed day with adequate energy management!");
                this.showGameOver('win', 'silver');
            } else if (this.state.energy > 0) {
                // Bronze victory - survived but barely
                console.log("[MessengerGame] BRONZE VICTORY: Barely survived the day!");
                this.showGameOver('win', 'bronze');
            }
            return;
        }
    },

    /**
     * Show game over screen (win or loss)
     */
    showGameOver: function (result, reason) {
        if (!this.container) return;

        var resultData = {
            loss: {
                energy: {
                    title: '⚠️ ДЕНЬ ЗАВЕРШЁН ВАС ИСЧЕРПАЛИ',
                    message: 'Ваша энергия полностью израсходована. Вы потеряли способность принимать решения.',
                    advice: 'Нужно было лучше управлять своими ресурсами. Делегировать больше, спать, не пренебрегать обедом.'
                }
            },
            win: {
                gold: {
                    title: '🏆 ЗОЛОТАЯ ПОБЕДА! ДЕНЬ ПРОЖИТ БЛЕСТЯЩЕ!',
                    message: 'Вы отлично управляли своей энергией и командой. К концу дня сохранили более 50% энергии.',
                    advice: 'Исключительное управление ресурсами! Вы мастер тайм-менеджмента и делегирования.'
                },
                silver: {
                    title: '🥈 СЕРЕБРЯНАЯ ПОБЕДА! ДЕНЬ ПРОЖИТ УСПЕШНО!',
                    message: 'Вы справились с днём, сохранив 10-50% энергии. День был напряженным, но вы выстояли.',
                    advice: 'Хороший результат! Работайте над поддержкой своей энергии и лучшим распределением задач.'
                },
                bronze: {
                    title: '🥉 БРОНЗОВАЯ ПОБЕДА! ВЫ ВЫЖИЛИ!',
                    message: 'Вы дотянули до конца дня, но энергия на исходе (менее 10%). Это было на пределе.',
                    advice: 'Вы выстояли, но нужно срочно улучшить управление ресурсами. Делегируйте больше, не переутомляйтесь.'
                }
            }
        };

        var data = result === 'loss' ? resultData.loss[reason] : resultData.win[reason];

        var screenHtml = `
            <div class="game-over-modal">
                <div class="game-over-content">
                    <h2>${data.title}</h2>
                    <p class="game-over-message">${data.message}</p>
                    <p class="game-over-advice">💡 ${data.advice}</p>

                    <div class="game-stats-summary">
                        <div class="stat-summary-item">
                            <span class="stat-label">⏱️ Финальное время:</span>
                            <span class="stat-value">${this.state.gameTime}</span>
                        </div>
                        <div class="stat-summary-item">
                            <span class="stat-label">⚡ Финальная энергия:</span>
                            <span class="stat-value">${this.state.energy}%</span>
                        </div>
                        <div class="stat-summary-item">
                            <span class="stat-label">📊 Решений принято:</span>
                            <span class="stat-value">${this.state.choicesMade.length}</span>
                        </div>
                    </div>

                    <div class="game-over-actions">
                        <button class="game-over-btn restart-btn" onclick="location.reload()">НАЧАТЬ ЗАНОВО</button>
                    </div>
                </div>
            </div>
        `;

        // Replace entire interface with game over screen
        this.container.innerHTML = screenHtml;
    },

    /**
     * Show initial demo messages (from messenger-scenarios.json)
     */
    showInitialMessages: function () {
        if (!this.container) return;

        // Set contacts and scenarios to messenger versions for demo phase
        this.contacts = this.messengerContacts || [];
        this.scenarios = []; // No game scenarios during demo (we'll load them after Good Start)

        this.render(); // Render main messenger layout
        this.state.activeContactId = null; // Start without a selected contact

        // Display initial messages with delays
        if (this.messengerScenarios && this.messengerScenarios.length > 0) {
            var self = this;
            var allMessagesDisplayed = false;

            // Sort by triggerRealTime
            var sortedScenarios = this.messengerScenarios.slice().sort(function (a, b) {
                return (a.triggerRealTime || 0) - (b.triggerRealTime || 0);
            });

            sortedScenarios.forEach(function (scenario, index) {
                setTimeout(function () {
                    // Add message to contact
                    var contactId = scenario.contactId;
                    if (!self.state.messages[contactId]) {
                        self.state.messages[contactId] = [];
                    }

                    // Add each message from scenario
                    if (scenario.messages && scenario.messages.length > 0) {
                        scenario.messages.forEach(function (msg) {
                            self.state.messages[contactId].push({
                                sender: msg.sender,
                                text: msg.text,
                                timestamp: scenario.triggerTime || "09:00"
                            });
                        });
                    }

                    // Mark contact as having unread messages
                    if (!self.state.unread) self.state.unread = {};
                    self.state.unread[contactId] = true;

                    // Update UI
                    self.renderContactList();

                    // After last message, show Good Start modal
                    if (index === sortedScenarios.length - 1 && !allMessagesDisplayed) {
                        allMessagesDisplayed = true;
                        setTimeout(function () {
                            self.showGoodStartModal();
                        }, 2000); // Wait 2 more seconds then show Good Start
                    }

                }, (scenario.triggerRealTime || 2) * 1000); // Convert to milliseconds
            });
        }
    },

    /**
     * Show Good Start modal with continue button
     */
    showGoodStartModal: function () {
        if (!this.container) return;

        var modalHtml = `
            <div class="good-start-modal">
                <div class="good-start-content">
                    <h2>✅ ХОРОШЕЕ НАЧАЛО!</h2>
                    <p>Команда онлайн и в курсе плана дня.</p>
                    <p>Отличное начало рабочего дня!</p>
                    <p style="font-size: 14px; color: #999; margin-top: 15px;">Теперь начинается реальная игра...</p>
                    <button class="continue-btn" onclick="window.messengerGame.continueFromGoodStart()">НАЧАТЬ ИГРУ</button>
                </div>
            </div>
        `;

        var modalEl = document.createElement('div');
        modalEl.innerHTML = modalHtml;
        this.container.appendChild(modalEl.firstElementChild);
    },

    /**
     * Continue from Good Start modal - load full game scenarios
     */
    continueFromGoodStart: function () {
        console.log("[MessengerGame] Continuing from Good Start...");

        // Remove Good Start modal
        var modal = this.container.querySelector('.good-start-modal');
        if (modal) {
            modal.remove();
        }

        // Load full game scenarios
        this.loadFullGameScenarios();
    },

    renderBriefing: function () {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="messenger-briefing">
                <div class="briefing-card">
                    <div class="briefing-header">
                        <h2>📅 ПЯТНИЦА, 9:00</h2>
                        <p>Демо-версия: Первое утро тимлида</p>
                    </div>
                    <div class="briefing-content">
                        <p class="briefing-intro">
                            Это твоё первое утро в роли тимлида.<br>
                            Команда начинает рабочий день.<br>
                            Посмотрим, как это выглядит изнутри.
                        </p>
                        <p class="briefing-mission">
                            Просто наблюдай за сообщениями.<br>
                            В следующей версии ты сможешь<br>
                            отвечать и принимать решения!
                        </p>
                        <button class="start-day-btn" onclick="MessengerGame.startGame()">НАЧАТЬ ДЕМО</button>
                    </div>
                </div>
            </div>
        `;
    },

    render: function () {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="messenger-layout">
                <div class="messenger-sidebar">
                    <div class="messenger-header">
                        <div class="user-profile">
                            <img src="assets/images/characters/alex/alex_avatar.svg" alt="Alex" class="user-avatar">
                            <div class="user-info">
                                <span class="user-name">Alex (Team Lead)</span>
                                <span class="user-status">online</span>
                            </div>
                        </div>
                        <div class="game-stats">
                            <div class="stat-item" title="Energy">
                                ⚡ 
                                <div class="stat-bar-container">
                                    <div class="stat-bar-fill energy-fill" id="energy-bar" style="width: ${this.state.energy}%"></div>
                                </div>
                            </div>
                            <div class="stat-item" title="Stress">
                                🤯 
                                <div class="stat-bar-container">
                                    <div class="stat-bar-fill stress-fill" id="stress-bar" style="width: ${this.state.stress}%"></div>
                                </div>
                            </div>
                            <div class="stat-item" title="Time">
                                🕒 <span id="time-val">${this.state.currentTime}</span>
                            </div>
                        </div>
                    </div>
                    <div class="contact-list" id="contact-list">
                        <!-- Contacts will be rendered here -->
                    </div>
                </div>
                <div class="messenger-main">
                    <div class="chat-area" id="chat-area">
                        <div class="empty-state">
                            <div class="empty-icon">💬</div>
                            <p>Select a chat to start messaging</p>
                        </div>
                    </div>
                    <div class="input-area" id="input-area">
                        <div class="input-placeholder">Select a colleague from the sidebar to start chatting</div>
                    </div>
                </div>
            </div>
        `;
        this.renderContactList();
    },

    renderContactList: function () {
        if (!this.container) return;
        var list = this.container.querySelector('#contact-list');
        if (!list) return;

        // Sort contacts: 
        // 1. Unread messages first (optional, but good for Slack-like)
        // 2. Most recent message timestamp
        // 3. Alphabetical fallback
        var sortedContacts = this.contacts.slice().sort(function (a, b) {
            var msgA = this.getLastMessage(a.id);
            var msgB = this.getLastMessage(b.id);
            var timeA = msgA ? msgA.timestamp : "00:00";
            var timeB = msgB ? msgB.timestamp : "00:00";

            // Compare times (descending)
            if (timeA > timeB) return -1;
            if (timeA < timeB) return 1;
            return 0;
        }.bind(this));

        list.innerHTML = '';
        sortedContacts.forEach(function (contact) {
            var el = document.createElement('div');
            el.className = 'contact-item ' + (this.state.activeContactId === contact.id ? 'active' : '');

            // Check unread status
            var isUnread = this.state.unread && this.state.unread[contact.id];
            if (isUnread) el.className += ' unread';

            el.onclick = function () { this.openChat(contact.id); }.bind(this);

            // Slack sidebar with avatars
            var prefix = contact.isChannel ? '# ' : '';

            el.innerHTML = `
                <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
                <span class="contact-name">${prefix}${contact.name}</span>
                ${isUnread ? '<div class="unread-dot"></div>' : ''}
            `;
            list.appendChild(el);
        }, this);
    },

    openChat: function (contactId) {
        // Only check for blocked scenarios during actual game (not during demo)
        if (this.state.gameStarted && this.isBlocked() && !this.isContactUrgent(contactId)) {
            alert("⚠️ You must respond to the urgent message first!");
            return;
        }

        this.state.activeContactId = contactId;

        // Clear unread status
        if (!this.state.unread) this.state.unread = {};
        this.state.unread[contactId] = false;

        // Check if all contacts with messages are now viewed
        if (this.state.allMessagesReadTime === null && this.getAllContactsWithMessagesViewed()) {
            this.state.allMessagesReadTime = this.state.realTimeElapsed;
        }

        // Mobile: Show chat view
        var layout = this.container.querySelector('.messenger-layout');
        if (layout) layout.classList.add('show-chat');

        this.renderContactList();
        this.renderChatWindow(contactId);

        // Schedule choice reveal for messages that have a scenario (after 1 second of opening)
        this.scheduleChoicesReveal(contactId);
    },

    /**
     * Schedule reveal of choices 1 second after chat is opened
     */
    scheduleChoicesReveal: function (contactId) {
        var self = this;
        var messages = this.state.messages[contactId] || [];

        // Find scenario messages that haven't revealed choices yet
        messages.forEach(function (msg, index) {
            // Skip if already revealed or no scenario
            if (msg.choicesRevealed || !msg.scenarioId) return;

            // Schedule reveal for 1 second after this message is viewed
            setTimeout(function () {
                // Only reveal if still viewing same contact
                if (self.state.activeContactId === contactId) {
                    msg.choicesRevealed = true;
                    // Re-render to show choices
                    self.renderChatWindow(contactId);
                }
            }, 1000);
        });
    },

    /**
     * Toggle context visibility (expand/collapse)
     */
    toggleContext: function (contextId) {
        var contextEl = document.getElementById(contextId);
        if (!contextEl) return;

        var textEl = contextEl.querySelector('.context-text');
        var labelEl = contextEl.querySelector('.context-label');

        if (!textEl || !labelEl) return;

        // Toggle display
        var isVisible = textEl.style.display !== 'none';
        textEl.style.display = isVisible ? 'none' : 'block';
        labelEl.textContent = isVisible ? '💡 КОНТЕКСТ (нажми чтобы открыть)' : '💡 КОНТЕКСТ (нажми чтобы закрыть)';
    },

    backToContacts: function () {
        var layout = this.container.querySelector('.messenger-layout');
        if (layout) layout.classList.remove('show-chat');
        this.state.activeContactId = null; // Optional: clear active selection
        this.renderContactList(); // Re-render to show unread status updates if any
    },

    renderChatWindow: function (contactId) {
        if (!this.container) return;
        var chatArea = this.container.querySelector('#chat-area');
        var inputArea = this.container.querySelector('#input-area');
        if (!chatArea || !inputArea) return;

        var contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;

        var messages = this.state.messages[contactId] || [];

        // Render Header with Back Button
        var headerHtml = `
            <div class="chat-header">
                <button class="back-button" onclick="window.messengerGame.backToContacts()">‹</button>
                <img src="${contact.avatar}" alt="${contact.name}" class="header-avatar">
                <div class="header-info">
                    <span class="header-name">${contact.isChannel ? '#' : ''}${contact.name}</span>
                    <span class="header-role">${contact.role}</span>
                </div>
            </div>
        `;

        // Render Messages (Slack style: Avatar left, content right)
        var messagesHtml = messages.map((msg) => {
            // Determine avatar and name
            var isPlayerMessage = msg.sender === 'player' || msg.sender === 'alex';
            var avatar = isPlayerMessage ? 'assets/images/characters/alex/alex_avatar.svg' : contact.avatar;
            var name = isPlayerMessage ? 'Alex' : (msg.sender === 'System' ? 'System' : contact.name);

            // If it's a channel, resolve the specific sender
            if (contact.isChannel && !isPlayerMessage) {
                if (msg.sender === 'System') {
                    name = 'System';
                    avatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><circle cx='20' cy='20' r='20' fill='%23616061'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' fill='white' font-size='20'>S</text></svg>";
                } else {
                    // Try to find sender in contacts
                    var senderContact = this.contacts.find(c => c.id === msg.sender);
                    if (senderContact) {
                        avatar = senderContact.avatar;
                        name = senderContact.name;
                    }
                }
            }

            return `
                <div class="message">
                    <img src="${avatar}" alt="${name}" class="message-avatar">
                    <div class="message-content-block">
                        <div class="message-header">
                            <span class="message-sender">${name}</span>
                            <span class="message-time">${msg.timestamp}</span>
                        </div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </div>
            `;
        }, this).join('');

        chatArea.innerHTML = headerHtml + '<div class="messages-list">' + messagesHtml + '</div>';
        chatArea.scrollTop = chatArea.scrollHeight;

        // Render Choices/Actions for Request scenarios
        inputArea.innerHTML = '';

        // Check for escalation messages with choices first
        var escalationMessage = null;
        var escalationChoices = null;
        var messagesForContact = this.state.messages[contactId] || [];
        for (var i = messagesForContact.length - 1; i >= 0; i--) {
            var msg = messagesForContact[i];
            if (msg.isEscalation && msg.newChoices && msg.newChoices.length > 0) {
                escalationMessage = msg;
                escalationChoices = msg.newChoices;
                break;
            }
        }

        // Find the message with a scenario in this contact (most recent)
        var scenarioMessage = null;
        var activeScenario = null;
        var messages = this.state.messages[contactId] || [];
        for (var i = messages.length - 1; i >= 0; i--) {
            if (messages[i].scenarioId && messages[i].choicesRevealed === true) {
                scenarioMessage = messages[i];
                activeScenario = this.scenarios.find(s => s.id === messages[i].scenarioId);
                break;
            }
        }

        // If there's an escalation with new choices, show those instead
        if (escalationChoices && escalationChoices.length > 0 && this.state.gameStarted) {
            var choicesHtml = '<div class="choice-context"><div class="context-label">⚠️ СРОЧНО:</div><div class="context-text">Ситуация развивалась дальше. Вот новые варианты.</div></div>';
            choicesHtml += '<div class="choices-container">';

            var optionLabels = ['[A]', '[B]', '[C]'];
            escalationChoices.slice(0, 3).forEach(function (choice, index) {
                var energyColor = choice.energyCost < 0 ? 'negative' : 'positive';
                var choiceHtml = `
                    <button class="choice-btn" onclick="window.messengerGame.makeEscalationChoice(window.escalationMessage, window.escalationChoice${index})">
                        <div class="choice-label">${optionLabels[index]} ${choice.text}</div>
                        <div class="choice-description">${choice.description || ''}</div>
                        <div class="choice-cost">
                            <span class="cost-time">⏱️ +${choice.timeCost} мин</span>
                            <span class="cost-energy ${energyColor}">⚡ ${choice.energyCost > 0 ? '+' : ''}${choice.energyCost}%</span>
                        </div>
                    </button>
                `;
                choicesHtml += choiceHtml;

                // Store choice globally for onclick handler
                window['escalationChoice' + index] = choice;
            }, this);

            choicesHtml += '</div>';

            // Store escalation message globally
            window.escalationMessage = escalationMessage;

            inputArea.innerHTML = choicesHtml;
        } else if (activeScenario && this.state.gameStarted) {
            // Show context if available (clickable to expand/collapse)
            var contextHtml = '';
            if (activeScenario.context) {
                var contextId = 'context-' + activeScenario.id;
                contextHtml = `
                    <div class="choice-context" id="${contextId}" onclick="window.messengerGame.toggleContext('${contextId}')">
                        <div class="context-label">💡 КОНТЕКСТ (нажми чтобы открыть)</div>
                        <div class="context-text" style="display: none;">${activeScenario.context}</div>
                    </div>
                `;
            }

            // Show title/description if available
            var titleHtml = '';
            if (activeScenario.title) {
                titleHtml = `<div class="choice-title">❓ ${activeScenario.title}</div>`;
            }

            // Build choices container with up to 3 options (A, B, C)
            var choicesHtml = `${contextHtml}${titleHtml}<div class="choices-container">`;

            var optionLabels = ['[A]', '[B]', '[C]'];
            activeScenario.choices.slice(0, 3).forEach(function (choice, index) {
                var energyColor = choice.energyCost < 0 ? 'negative' : 'positive';
                var choiceHtml = `
                    <button class="choice-btn" onclick="window.messengerGame.makeChoice(window.activeScenario, window.activeChoice${index})">
                        <div class="choice-label">${optionLabels[index]} ${choice.text}</div>
                        <div class="choice-description">${choice.description || ''}</div>
                        <div class="choice-cost">
                            <span class="cost-time">⏱️ +${choice.timeCost} мин</span>
                            <span class="cost-energy ${energyColor}">⚡ ${choice.energyCost > 0 ? '+' : ''}${choice.energyCost}%</span>
                        </div>
                    </button>
                `;
                choicesHtml += choiceHtml;

                // Store choice globally for onclick handler
                window['activeChoice' + index] = choice;
            }, this);

            choicesHtml += '</div>';

            // Store scenario globally for onclick handler
            window.activeScenario = activeScenario;

            inputArea.innerHTML = choicesHtml;
        } else {
            // No active scenario
            inputArea.innerHTML = '';
        }
    },

    /**
     * Player makes a choice - update game state and process time jump
     */
    makeChoice: function (scenario, choice) {
        console.log("[MessengerGame] Choice made: " + choice.id);

        // Remember old T_Game for time gap processing
        var oldGameTime = this.state.gameTime;
        var oldGameTimeMinutes = this.state.gameTimeMinutes;

        // Apply resource costs (with meal skip penalty if applicable)
        var energyCost = choice.energyCost;
        var timeCost = choice.timeCost;

        if (this.state.mealSkipped) {
            // Meal skip penalty: +50% time and +50% energy cost
            timeCost = Math.ceil(timeCost * 1.5);
            energyCost = Math.ceil(energyCost * 1.5);
            console.log("[MessengerGame] Meal skip penalty applied: " + choice.timeCost + " -> " + timeCost + " min, " + choice.energyCost + " -> " + energyCost + "%");
        }

        this.state.energy = Math.max(0, this.state.energy - energyCost);
        this.state.stress = Math.min(100, this.state.stress + (choice.stressImpact || 0));

        // Advance T_Game by timeCost (with penalty applied if mealSkipped)
        this.advanceTime(timeCost);

        // Add player's confirmation message from Alex (the choice/decision)
        this.addMessage(scenario.contactId, {
            sender: 'alex',
            text: choice.description,
            timestamp: this.state.gameTime
        });

        // Add response message from the contact
        this.addMessage(scenario.contactId, {
            sender: scenario.contactId,
            text: choice.response,
            timestamp: this.state.gameTime // Use new T_Game
        });

        // Track the choice
        if (!this.state.choicesMade) this.state.choicesMade = [];
        this.state.choicesMade.push(choice.id);

        // Track escalation if this choice has one
        if (choice.escalation) {
            console.log("[MessengerGame] Escalation tracked for: " + choice.escalation.id + " at " + choice.escalation.triggerTime);
            if (!this.state.pendingEscalations) this.state.pendingEscalations = [];
            this.state.pendingEscalations.push({
                id: choice.escalation.id,
                originalChoiceId: choice.id,
                originalScenarioId: scenario.id,
                triggerTime: choice.escalation.triggerTime,
                escalationData: choice.escalation
            });
        }

        // IMPORTANT: Process time gap - load all events between oldGameTime and newGameTime
        this.processTimeGap(oldGameTimeMinutes, this.state.gameTimeMinutes);

        // Check triggers to load scenarios that should be active at new T_Game
        // (this includes scenarios beyond the gap that are now triggered)
        this.checkTriggers();

        // Update UI
        this.updateStats();

        // Check if game is over
        this.checkGameOver();

        // Re-render chat
        this.renderChatWindow(scenario.contactId);
    },

    /**
     * Process time gap: when T_Game jumps, load all events that should have happened in between
     * @param oldTimeMinutes - old T_Game in minutes from 00:00
     * @param newTimeMinutes - new T_Game in minutes from 00:00
     */
    processTimeGap: function (oldTimeMinutes, newTimeMinutes) {
        console.log("[MessengerGame] Processing time gap: " +
                    this.minutesToTime(oldTimeMinutes) + " -> " + this.minutesToTime(newTimeMinutes));

        // Find all scenarios that should trigger between old and new game time
        var eventsToProcess = this.scenarios.filter(function (scenario) {
            // Skip if already completed
            if (this.state.completedScenarios.includes(scenario.id)) return false;

            // Skip lunch time scenarios
            if (scenario.isLunchTime) return false;

            // Check if trigger time falls in the gap
            var triggerMins = this.timeToMinutes(scenario.triggerTime);
            return triggerMins > oldTimeMinutes && triggerMins <= newTimeMinutes;
        }, this);

        // Sort events by time
        eventsToProcess.sort(function (a, b) {
            return this.timeToMinutes(a.triggerTime) - this.timeToMinutes(b.triggerTime);
        }.bind(this));

        console.log("[MessengerGame] Found " + eventsToProcess.length + " events in time gap");

        // Load and display events immediately (no delays)
        eventsToProcess.forEach(function (scenario, index) {
            // Initialize message history if needed
            if (!this.state.messages[scenario.contactId]) {
                this.state.messages[scenario.contactId] = [];
            }

            // Check if message already exists (avoid duplicates)
            var messageExists = this.state.messages[scenario.contactId].some(msg =>
                msg.sender === scenario.contactId && msg.text === scenario.text
            );

            if (!messageExists) {
                // Add scenario initial message
                this.addMessage(scenario.contactId, {
                    sender: scenario.contactId,
                    text: scenario.text,
                    timestamp: scenario.triggerTime,
                    isUrgent: scenario.type === 'ALERT',
                    scenarioId: scenario.id,  // Mark this message as having a scenario/choices
                    choicesRevealed: false    // Choices not revealed yet (will appear after 1 sec)
                });

                // Schedule choices reveal for 1 second after message
                this.scheduleChoicesReveal(scenario.contactId);
            }

            // Update UI to show new messages
            if (this.state.activeContactId === scenario.contactId) {
                this.renderChatWindow(scenario.contactId);
            }
        }, this);

        // After all events are loaded, check for escalations
        this.checkTriggers();
    },

    showTyping: function (contactId, show) {
        if (this.state.activeContactId !== contactId || !this.container) return;

        var indicator = this.container.querySelector('#typing-' + contactId);
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
            var chatArea = this.container.querySelector('#chat-area');
            if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
        }
    },

    addMessage: function (contactId, message) {
        if (!this.state.messages[contactId]) {
            this.state.messages[contactId] = [];
        }
        this.state.messages[contactId].push(message);

        // Track when last message was added (R_Time)
        this.state.lastMessageAddedTime = this.state.realTimeElapsed;

        // Set unread if not active
        if (this.state.activeContactId !== contactId) {
            if (!this.state.unread) this.state.unread = {};
            this.state.unread[contactId] = true;
        }

        if (this.state.activeContactId === contactId) {
            this.renderChatWindow(contactId);
        }

        // Always re-render contact list to update sorting and unread status
        this.renderContactList();
    },

    getUnreadCount: function (contactId) {
        // Simplified logic: if scenario active but not completed
        var activeScenario = this.scenarios.find(s =>
            s.contactId === contactId &&
            !this.state.completedScenarios.includes(s.id) &&
            this.isTimeTriggered(s.triggerTime)
        );
        return activeScenario ? 1 : 0;
    },

    getLastMessage: function (contactId) {
        var msgs = this.state.messages[contactId];
        return msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
    },

    getTotalUnreadCount: function () {
        var total = 0;
        if (!this.state.unread) return total;
        for (var contactId in this.state.unread) {
            if (this.state.unread[contactId]) {
                total++;
            }
        }
        return total;
    },

    getAllContactsWithMessagesViewed: function () {
        // Get all contacts that have received messages
        var contactsWithMessages = {};
        for (var contactId in this.state.messages) {
            if (this.state.messages[contactId] && this.state.messages[contactId].length > 0) {
                contactsWithMessages[contactId] = true;
            }
        }

        // Need at least one contact with messages
        if (Object.keys(contactsWithMessages).length === 0) {
            return false;
        }

        // Require at least 2 seconds have passed since the last message was added
        // This ensures all messages have arrived before checking if they're all viewed
        if (this.state.lastMessageAddedTime === null ||
            this.state.lastMessageAddedTime === undefined ||
            (this.state.realTimeElapsed - this.state.lastMessageAddedTime) < 2) {
            return false;
        }

        // Check if all of them have been opened (not unread)
        for (var contactId in contactsWithMessages) {
            if (!this.state.unread) this.state.unread = {};
            if (this.state.unread[contactId]) {
                // Still unread - not all viewed yet
                return false;
            }
        }

        // All contacts with messages have been opened AND 2+ seconds passed since last message
        return true;
    },

    /**
     * Check if trigger time has been reached in game time
     * Uses new T_Game system (gameTime as HH:MM)
     */
    isTimeTriggered: function (triggerTime) {
        return this.isTimeReached(this.state.gameTime, triggerTime);
    },

    isBlocked: function () {
        // Check if there is any urgent scenario active
        return this.scenarios.some(s =>
            !this.state.completedScenarios.includes(s.id) &&
            this.isTimeTriggered(s.triggerTime) &&
            s.isUrgent
        );
    },

    isContactUrgent: function (contactId) {
        return this.scenarios.some(s =>
            s.contactId === contactId &&
            !this.state.completedScenarios.includes(s.id) &&
            this.isTimeTriggered(s.triggerTime) &&
            s.isUrgent
        );
    },

    /**
     * Advance game time (T_Game) by minutes
     * This is called when player makes a choice
     */
    advanceTime: function (minutes) {
        var newTime = this.addMinutesToTime(this.state.gameTime, minutes);
        this.state.gameTime = newTime;
        this.state.gameTimeMinutes = this.timeToMinutes(newTime);
        console.log("[MessengerGame] Time advanced: " + this.state.gameTime);
        this.updateStats();
    },

    updateStats: function () {
        if (!this.container) return;
        var energyBar = this.container.querySelector('#energy-bar');
        var stressBar = this.container.querySelector('#stress-bar');
        var timeEl = this.container.querySelector('#time-val');

        if (energyBar) energyBar.style.width = this.state.energy + '%';
        if (stressBar) stressBar.style.width = this.state.stress + '%';
        if (timeEl) timeEl.textContent = this.state.gameTime; // Use gameTime (T_Game)
    },

    // OLD startGameLoop removed - replaced with startRealTimeTracking
    // T_Game now only changes when player makes choices, not with a timer

    /**
     * Check which scenarios should trigger based on current T_Game
     * Load all messages for scenarios that match trigger conditions
     */
    checkTriggers: function () {
        console.log("[MessengerGame] checkTriggers() called. Current T_Game: " + this.state.gameTime);

        this.scenarios.forEach(function (scenario) {
            // Skip if choice was already made (scenario is answered)
            if (this.state.choicesMade.some(choiceId => {
                // Check if this choice belongs to this scenario
                var choiceScenario = this.scenarios.find(s => s.choices && s.choices.find(c => c.id === choiceId));
                return choiceScenario && choiceScenario.id === scenario.id;
            })) {
                console.log("[MessengerGame] Skipping " + scenario.id + " - already completed");
                return;
            }

            // Check if T_Game has reached the trigger time
            if (!this.isTimeTriggered(scenario.triggerTime)) {
                console.log("[MessengerGame] Skipping " + scenario.id + " - trigger time " + scenario.triggerTime + " not reached (current: " + this.state.gameTime + ")");
                return;
            }

            // Skip lunch time scenarios (they're handled separately)
            if (scenario.isLunchTime) return;

            // Initialize message history for this contact
            if (!this.state.messages[scenario.contactId]) {
                this.state.messages[scenario.contactId] = [];
            }

            // Check if this scenario's message already exists (avoid duplicates)
            var messageExists = this.state.messages[scenario.contactId].some(msg =>
                msg.sender === scenario.contactId && msg.text === scenario.text
            );

            if (!messageExists) {
                // Add initial message from the scenario
                console.log("[MessengerGame] Loading scenario: " + scenario.id + " from " + scenario.contactId + " at " + scenario.triggerTime);
                this.addMessage(scenario.contactId, {
                    sender: scenario.contactId,
                    text: scenario.text,
                    timestamp: scenario.triggerTime,
                    isUrgent: scenario.type === 'ALERT',
                    scenarioId: scenario.id,  // Mark this message as having a scenario/choices
                    choicesRevealed: false    // Choices not revealed yet (will appear after 1 sec)
                });

                // Schedule choices reveal for 1 second after message
                this.scheduleChoicesReveal(scenario.contactId);
            } else {
                console.log("[MessengerGame] Skipping " + scenario.id + " - message already exists");
            }

        }, this);

        // Check for escalations that should trigger
        if (this.state.pendingEscalations && this.state.pendingEscalations.length > 0) {
            this.state.pendingEscalations.forEach(function (escalation, index) {
                // Only trigger if time has been reached
                if (!this.isTimeTriggered(escalation.triggerTime)) return;

                // Check if the original choice's response was already given (not cancelled)
                var originalChoiceMade = this.state.choicesMade.includes(escalation.originalChoiceId);
                if (!originalChoiceMade) return;

                // Check if another choice from the same scenario was already made (escalation shouldn't trigger)
                var scenarioResolved = this.state.choicesMade.some(choiceId => {
                    var choiceScenario = this.scenarios.find(s => s.choices && s.choices.find(c => c.id === choiceId));
                    return choiceScenario && choiceScenario.id === escalation.originalScenarioId && choiceId !== escalation.originalChoiceId;
                });
                if (scenarioResolved) {
                    // Remove this escalation - scenario was already resolved differently
                    this.state.pendingEscalations.splice(index, 1);
                    return;
                }

                console.log("[MessengerGame] Triggering escalation: " + escalation.id);

                var originalScenario = this.scenarios.find(s => s.id === escalation.originalScenarioId);
                if (!originalScenario) return;

                // Initialize message history for this contact
                if (!this.state.messages[originalScenario.contactId]) {
                    this.state.messages[originalScenario.contactId] = [];
                }

                // Add escalation message
                this.addMessage(originalScenario.contactId, {
                    sender: originalScenario.contactId,
                    text: escalation.escalationData.text,
                    timestamp: escalation.triggerTime,
                    isUrgent: true,
                    isEscalation: true,
                    escalationId: escalation.id,
                    newChoices: escalation.escalationData.newChoices
                });

                // Remove from pending escalations
                this.state.pendingEscalations.splice(index, 1);

            }, this);
        }

        this.renderContactList();
    },

    finishGame: function () {
        if (this.timerInterval) clearInterval(this.timerInterval);

        var resultsHtml = `
            <div class="messenger-results">
                <h2>✅ ДЕМО ЗАВЕРШЕНО</h2>
                <div class="results-content">
                    <p>Ты увидел, как выглядит начало рабочего дня тимлида.</p>
                    
                    <div class="results-summary">
                        <h3>📊 ЧТО ПРОИЗОШЛО:</h3>
                        <ul>
                            <li>Денис начал работу над API</li>
                            <li>Игорь запустил тестирование</li>
                            <li>Мария работает из дома</li>
                            <li>Виктор проверил статус</li>
                            <li>В #general было отвлечение</li>
                        </ul>
                    </div>

                    <div class="results-preview">
                        <h3>💡 В ПОЛНОЙ ВЕРСИИ:</h3>
                        <ul>
                            <li>Ты сможешь отвечать на сообщения</li>
                            <li>Принимать решения и делегировать</li>
                            <li>Управлять своей энергией</li>
                            <li>Справляться с кризисами</li>
                        </ul>
                    </div>
                </div>
                <div class="results-actions">
                    <button onclick="location.reload()" class="restart-btn">ПРОЙТИ ЕЩЁ РАЗ</button>
                    <!-- <button class="continue-btn">ПРОДОЛЖИТЬ</button> -->
                </div>
            </div>
        `;

        this.container.innerHTML = resultsHtml;
    }
};

// Expose globally for inline event handlers
window.messengerGame = MessengerGame;

// Export for global use
// Export for global use
window.MessengerGame = MessengerGame;
