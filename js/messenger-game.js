/**
 * MessengerGame - Lesson 4
 * Simulates a workplace messenger interface
 */
var MessengerGame = {
    config: null,
    contacts: [],
    scenarios: [],
    state: {
        currentTime: "09:00",
        energy: 100,
        stress: 0,
        activeContactId: null,
        messages: {}, // Map of contactId -> array of messages
        completedScenarios: [],
        choicesMade: [], // Track specific choices made
        unreadCount: 0
    },
    container: null,

    init: function (container, lessonData) {
        console.log("[MessengerGame] Initializing...", container);
        if (!container) {
            console.error("[MessengerGame] Container is null!");
            return;
        }
        this.container = container;
        this.loadScenarios();
    },

    loadScenarios: function () {
        var self = this;
        fetch('data/messenger-scenarios.json?v=' + new Date().getTime())
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
        this.state.currentTime = this.config.startTime;
        this.state.energy = this.config.initialEnergy;
        this.state.stress = this.config.initialStress;
        this.state.messages = {};
        this.state.completedScenarios = [];
        this.state.choicesMade = [];
        this.state.activeContactId = null;
        this.state.gameStarted = false;

        // Initialize message history for each contact
        this.contacts.forEach(function (contact) {
            this.state.messages[contact.id] = [];
        }, this);

        // No initial triggers check here, as game starts after briefing
    },

    startGame: function () {
        this.state.gameStarted = true;
        this.render();
        this.startGameLoop();
        this.checkTriggers();
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

    makeChoice: function (scenario, choice) {
        // Apply costs
        this.state.energy = Math.max(0, this.state.energy - choice.energyCost);
        this.state.stress = Math.min(100, this.state.stress + (choice.stressImpact || 0));
        this.advanceTime(choice.timeCost);

        // Add player message
        this.addMessage(scenario.contactId, {
            sender: 'player',
            text: choice.text,
            timestamp: this.state.currentTime
        });

        // Show typing indicator then add response
        this.showTyping(scenario.contactId, true);

        setTimeout(function () {
            this.showTyping(scenario.contactId, false);
            this.addMessage(scenario.contactId, {
                sender: scenario.contactId,
                text: choice.response,
                timestamp: this.state.currentTime
            });

            // Mark scenario as completed
            this.state.completedScenarios.push(scenario.id);
            if (!this.state.choicesMade) this.state.choicesMade = [];
            this.state.choicesMade.push(choice.id);

            // Check for next triggers
            this.checkTriggers();

            // Update UI
            this.updateStats();
            this.renderChatWindow(scenario.contactId);

        }.bind(this), 1500);

        // Update UI immediately (for energy/time changes)
        this.updateStats();
        this.renderChatWindow(scenario.contactId);
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

    isTimeTriggered: function (triggerTime) {
        return triggerTime <= this.state.currentTime;
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

    advanceTime: function (minutes) {
        var [hours, mins] = this.state.currentTime.split(':').map(Number);
        mins += minutes;
        while (mins >= 60) {
            mins -= 60;
            hours += 1;
        }
        this.state.currentTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        this.updateStats();
    },

    updateStats: function () {
        if (!this.container) return;
        var energyBar = this.container.querySelector('#energy-bar');
        var stressBar = this.container.querySelector('#stress-bar');
        var timeEl = this.container.querySelector('#time-val');

        if (energyBar) energyBar.style.width = this.state.energy + '%';
        if (stressBar) stressBar.style.width = this.state.stress + '%';
        if (timeEl) timeEl.textContent = this.state.currentTime;
    },

    startGameLoop: function () {
        if (this.timerInterval) clearInterval(this.timerInterval);

        // MVP: 1 real minute = 4 game minutes
        // 1 real second = 4 game seconds
        // Start time is 09:00:00
        var startHour = 9;
        var startMinute = 0;

        // Initialize game seconds if not already set (allows resuming)
        if (typeof this.state.gameSeconds === 'undefined') {
            this.state.gameSeconds = 0; // Seconds past 9:00
        }

        this.state.elapsedRealTime = 0; // Track real seconds

        this.timerInterval = setInterval(function () {
            this.state.gameSeconds += 4; // 4x speed
            this.state.elapsedRealTime += 1; // 1 real second

            // Calculate new time
            var totalMinutes = startMinute + Math.floor(this.state.gameSeconds / 60);
            var hours = startHour + Math.floor(totalMinutes / 60);
            var minutes = totalMinutes % 60;

            // Update state
            this.state.currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            this.updateStats();
            this.checkTriggers();
            this.checkGoodStartCondition();

            // Check end condition (09:20)
            if (hours === 9 && minutes >= 20) {
                this.finishGame();
            }

        }.bind(this), 1000); // Update every real second
    },

    checkGoodStartCondition: function () {
        if (this.state.goodStartShown) return;

        var timeLimitReached = this.state.elapsedRealTime >= 30; // Changed to 30s
        var allReadDelayReached = this.state.allMessagesReadTime !== null &&
            (this.state.elapsedRealTime >= this.state.allMessagesReadTime + 2);

        if (timeLimitReached || allReadDelayReached) {
            this.showGoodStartScreen();
        }
    },

    showGoodStartScreen: function () {
        this.state.goodStartShown = true;

        // Jump time to 09:10 (10 minutes * 60 seconds = 600 seconds)
        this.state.gameSeconds = 600;
        this.state.currentTime = '09:10';
        this.updateStats();

        // Create modal
        var modal = document.createElement('div');
        modal.className = 'good-start-modal';
        modal.innerHTML = `
            <div class="good-start-content">
                <h2>ХОРОШЕЕ НАЧАЛО!</h2>
                <p>Команда вышла на связь.</p>
                <p>Все начали работу.</p>
                <br>
                <p>Но день только начинается...</p>
                <p>Скоро придут первые вопросы.</p>
                <br>
                <p>Готов отвечать и принимать решения?</p>
                <button class="continue-btn" onclick="window.messengerGame.closeGoodStartScreen()">ПРОДОЛЖИТЬ</button>
            </div>
        `;
        this.container.appendChild(modal);
    },

    closeGoodStartScreen: function () {
        var modal = this.container.querySelector('.good-start-modal');
        if (modal) modal.remove();
    },

    checkTriggers: function () {
        // Check if any new scenarios should trigger based on time
        this.scenarios.forEach(function (scenario) {
            // Skip if already completed
            if (this.state.completedScenarios.includes(scenario.id)) return;

            var shouldTrigger = false;

            // Check real-time trigger if available
            if (scenario.triggerRealTime !== undefined) {
                if (this.state.elapsedRealTime >= scenario.triggerRealTime) {
                    shouldTrigger = true;
                }
            }
            // Fallback to game time trigger
            else if (this.isTimeTriggered(scenario.triggerTime)) {
                shouldTrigger = true;
            }

            if (!shouldTrigger) return;

            // Trigger the scenario
            if (!this.state.messages[scenario.contactId]) {
                this.state.messages[scenario.contactId] = [];
            }

            // Add messages
            scenario.messages.forEach(function (msg) {
                this.addMessage(scenario.contactId, {
                    sender: msg.sender,
                    text: msg.text,
                    timestamp: this.state.currentTime,
                    isUrgent: false
                });
            }, this);

            // Mark completed
            this.state.completedScenarios.push(scenario.id);

            // Play sound (optional, placeholder)
            // console.log("Ding! New message from " + scenario.contactId);

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
