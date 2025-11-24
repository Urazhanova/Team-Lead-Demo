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
        // Load full game scenarios (NOT messenger-scenarios.json)
        fetch('data/full-game-scenarios.json?v=' + new Date().getTime())
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!data || !data.config || !data.contacts || !data.scenarios) {
                    throw new Error("Invalid game data structure");
                }
                self.config = data.config;
                self.contacts = data.contacts;
                self.scenarios = data.scenarios;
                self.initializeState();
                self.renderBriefing(); // Show briefing first
            })
            .catch(function (err) {
                console.error("[MessengerGame] Error loading scenarios:", err);
                if (self.container) {
                    self.container.innerHTML = '<div class="error">Error loading game data: ' + err.message + '</div>';
                }
            });
    },

    initializeState: function () {
        // Initialize T_Game (game time in HH:MM format)
        this.state.gameTime = this.config.startTime; // "09:10"
        this.state.gameTimeMinutes = this.timeToMinutes(this.config.startTime); // 550

        this.state.energy = this.config.initialEnergy;      // 100%
        this.state.stress = this.config.initialStress;      // 0%
        this.state.messages = {};
        this.state.completedScenarios = [];
        this.state.choicesMade = [];
        this.state.activeContactId = null;
        this.state.gameStarted = false;
        this.state.realTimeElapsed = 0;                     // R_Time starts at 0
        this.state.allMessagesReadTime = null;
        this.state.goodStartShown = false;
        this.state.lastMessageAddedTime = null;

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
        this.checkTriggers(); // Load initial events at 09:10
        this.startRealTimeTracking(); // Start R_Time counter
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

        // TODO: Implement lunch modal with choices A/B/C
        // For now, just log it
        console.log("[MessengerGame] TODO: Show lunch break modal with energy/time tradeoffs");
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
        // Prevent switching if blocked by urgent scenario elsewhere
        if (this.isBlocked() && !this.isContactUrgent(contactId)) {
            alert("⚠️ You must respond to the urgent message first!");
            return;
        }

        this.state.activeContactId = contactId;

        // Clear unread status
        if (!this.state.unread) this.state.unread = {};
        this.state.unread[contactId] = false;

        // Check if all contacts with messages are now viewed
        if (this.state.allMessagesReadTime === null && this.getAllContactsWithMessagesViewed()) {
            this.state.allMessagesReadTime = this.state.elapsedRealTime;
        }

        // Mobile: Show chat view
        var layout = this.container.querySelector('.messenger-layout');
        if (layout) layout.classList.add('show-chat');

        this.renderContactList();
        this.renderChatWindow(contactId);
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
            // Determine avatar: if player, use player avatar, else contact avatar
            // For channels, we might need specific sender avatars, but for MVP we use contact avatar or generic
            var avatar = msg.sender === 'player' ? 'assets/images/characters/alex/alex_avatar.svg' : contact.avatar;
            var name = msg.sender === 'player' ? 'Alex' : (msg.sender === 'System' ? 'System' : contact.name);

            // If it's a channel, resolve the specific sender
            if (contact.isChannel && msg.sender !== 'player') {
                if (msg.sender === 'System') {
                    name = 'System';
                    avatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><circle cx='20' cy='20' r='20' fill='%23616061'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' fill='white' font-size='20'>S</text></svg>";
                } else if (msg.sender === 'lena') {
                    name = 'Лена';
                    avatar = 'assets/images/characters/lena/icon.svg';
                } else {
                    // Try to find sender in contacts to get their name/avatar
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

        // Add typing indicator
        messagesHtml += `
            <div class="typing-indicator" id="typing-${contactId}" style="display: none;">
                <span></span><span></span><span></span>
            </div>
        `;

        chatArea.innerHTML = headerHtml + '<div class="messages-list">' + messagesHtml + '</div>';
        chatArea.scrollTop = chatArea.scrollHeight;

        // Render Choices
        inputArea.innerHTML = '';

        // Find active scenario for this contact
        var activeScenario = this.scenarios.find(s =>
            s.contactId === contactId &&
            !this.state.completedScenarios.includes(s.id) &&
            this.isTimeTriggered(s.triggerTime)
        );

        if (activeScenario && activeScenario.choices && this.state.gameStarted) {
            var choicesContainer = document.createElement('div');
            choicesContainer.className = 'choices-container';

            activeScenario.choices.forEach(function (choice) {
                var btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.innerHTML = `
                    <span class="choice-text">${choice.text}</span>
                    <span class="choice-cost">⚡ -${choice.energyCost} | 🕒 ${choice.timeCost}m</span>
                `;
                btn.onclick = function () { this.makeChoice(activeScenario, choice); }.bind(this);
                choicesContainer.appendChild(btn);
            }, this);

            inputArea.appendChild(choicesContainer);
        } else {
            // inputArea.innerHTML = '<div class="input-placeholder">Message...</div>';
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

        // Apply resource costs
        this.state.energy = Math.max(0, this.state.energy - choice.energyCost);
        this.state.stress = Math.min(100, this.state.stress + (choice.stressImpact || 0));

        // Advance T_Game by timeCost
        this.advanceTime(choice.timeCost);

        // Add player's choice message
        this.addMessage(scenario.contactId, {
            sender: 'player',
            text: choice.text,
            timestamp: this.state.gameTime // Use new T_Game
        });

        // Mark scenario as completed
        this.state.completedScenarios.push(scenario.id);
        if (!this.state.choicesMade) this.state.choicesMade = [];
        this.state.choicesMade.push(choice.id);

        // Add choice response message
        this.addMessage(scenario.contactId, {
            sender: scenario.contactId,
            text: choice.response,
            timestamp: this.state.gameTime // Use new T_Game
        });

        // IMPORTANT: Process time gap - load all events between oldGameTime and newGameTime
        this.processTimeGap(oldGameTimeMinutes, this.state.gameTimeMinutes);

        // Update UI
        this.updateStats();
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

            // Check if trigger time falls in the gap
            var triggerMins = this.timeToMinutes(scenario.triggerTime);
            return triggerMins > oldTimeMinutes && triggerMins <= newTimeMinutes;
        }, this);

        // Sort events by time
        eventsToProcess.sort(function (a, b) {
            return this.timeToMinutes(a.triggerTime) - this.timeToMinutes(b.triggerTime);
        }.bind(this));

        console.log("[MessengerGame] Found " + eventsToProcess.length + " events in time gap");

        // Load and display events with 5 second intervals
        eventsToProcess.forEach(function (scenario, index) {
            setTimeout(function () {
                // Initialize message history if needed
                if (!this.state.messages[scenario.contactId]) {
                    this.state.messages[scenario.contactId] = [];
                }

                // Add scenario messages
                scenario.messages.forEach(function (msg) {
                    this.addMessage(scenario.contactId, {
                        sender: msg.sender,
                        text: msg.text,
                        timestamp: scenario.triggerTime
                    });
                }, this);

                // Mark as completed
                this.state.completedScenarios.push(scenario.id);

            }.bind(this), index * 5000); // 5 second intervals
        }, this);
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
        this.scenarios.forEach(function (scenario) {
            // Skip if already completed
            if (this.state.completedScenarios.includes(scenario.id)) return;

            // Check if T_Game has reached the trigger time
            if (!this.isTimeTriggered(scenario.triggerTime)) return;

            // Trigger the scenario: add all its messages
            if (!this.state.messages[scenario.contactId]) {
                this.state.messages[scenario.contactId] = [];
            }

            // Add scenario messages with current T_Game timestamp
            scenario.messages.forEach(function (msg) {
                this.addMessage(scenario.contactId, {
                    sender: msg.sender,
                    text: msg.text,
                    timestamp: this.state.gameTime, // Use T_Game
                    isUrgent: false
                });
            }, this);

            // Mark scenario as completed
            this.state.completedScenarios.push(scenario.id);

        }, this);

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
