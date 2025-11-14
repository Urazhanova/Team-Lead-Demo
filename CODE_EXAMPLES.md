# 💻 ПРИМЕРЫ КОДА ДЛЯ ИНТЕГРАЦИИ

---

## 🎯 КАК РАСШИРЯТЬ game-2d.js

### **Пример 1: Добавление функции для рисования зон**

```javascript
// Добавить в drawGame() функцию

function drawZones() {
    const zones = GameData.zones;
    const ctx = gameState.ctx;

    Object.values(zones).forEach(zone => {
        // Проверяем в ли мы в этой зоне
        const playerInZone = gameState.player.x >= zone.x &&
                            gameState.player.x <= zone.x + zone.width &&
                            gameState.player.y >= zone.y &&
                            gameState.player.y <= zone.y + zone.height;

        // Выбираем цвет
        if (playerInZone) {
            ctx.strokeStyle = zone.borderColor;
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
        }

        // Рисуем границу зоны
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        ctx.setLineDash([]);

        // Рисуем метку зоны
        ctx.fillStyle = playerInZone ? zone.borderColor : 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(zone.label, zone.x + 10, zone.y + 25);

        // Подсказка для интерактивных зон
        if (zone.interactive && playerInZone) {
            ctx.fillStyle = '#4ecca3';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('(нажми E)', zone.x + 10, zone.y + 45);
        }
    });
}

// В функции draw() добавить:
// drawZones(); // Рисует зоны

// В функции gameLoop() или updateGameState() добавить проверку входа в зону:
function checkZoneEntry() {
    const zones = GameData.zones;

    Object.entries(zones).forEach(([zoneId, zone]) => {
        const playerInZone = gameState.player.x >= zone.x &&
                            gameState.player.x <= zone.x + zone.width &&
                            gameState.player.y >= zone.y &&
                            gameState.player.y <= zone.y + zone.height;

        const wasInZone = gameState.currentZone === zoneId;

        if (playerInZone && !wasInZone) {
            // Вошли в зону
            gameState.currentZone = zoneId;

            // Выполняем действие при входе
            if (zone.onEnter) {
                handleZoneEnter(zoneId, zone);
            }

            // Обновляем статус
            document.getElementById('bottom-objective').textContent =
                `📍 Ты в ${zone.label}. ${zone.description}`;
        } else if (!playerInZone && wasInZone) {
            // Вышли из зоны
            gameState.currentZone = null;
        }
    });
}

// Обработчик входа в зону
function handleZoneEnter(zoneId, zone) {
    switch(zoneId) {
        case 'theory_zone':
            // Показать меню теории
            showTheoryMenu();
            break;
        case 'task_board':
            // Показать доску задач
            showTaskBoard();
            break;
        case 'alex_office':
            // Опциональное сообщение
            showThoughts();
            break;
        case 'meeting_room':
            // Сообщение о переговорной
            console.log('Ты в переговорной - здесь можно встречаться с командой');
            break;
        case 'work_area':
            // Ты в рабочей зоне
            console.log('Ты в рабочей зоне - здесь рабочие столы команды');
            break;
    }
}
```

---

### **Пример 2: Система теории блоков**

```javascript
// В GameLesson2D добавить метод:

GameLesson2D.showTheory = function(theoryId) {
    const theory = GameData.theoryBlocks[theoryId];
    if (!theory) {
        console.error('Theory block not found:', theoryId);
        return;
    }

    // Проверяем условия разблокировки
    if (theory.requiredXP && gameState.totalXP < theory.requiredXP) {
        alert(`Нужно набрать ${theory.requiredXP} XP для этого блока. У тебя: ${gameState.totalXP}`);
        return;
    }

    if (theory.requiredScenarios && gameState.completedScenarios.length < theory.requiredScenarios) {
        alert(`Нужно пройти ${theory.requiredScenarios} сценариев для этого блока.`);
        return;
    }

    // Показываем модальное окно
    const modal = document.getElementById('dialogue-modal-2d');
    const content = document.getElementById('dialogue-content');

    let html = `
        <h2 style="color: #4ecca3; margin-bottom: 10px;">${theory.icon} ${theory.title}</h2>
        <div style="color: #ffd93d; margin-bottom: 20px; font-size: 14px;">${theory.subtitle}</div>
    `;

    // Генерируем контент в зависимости от типа
    theory.content.forEach(section => {
        switch(section.type) {
            case 'heading':
                html += `<h3 style="color: #4ecca3; margin-top: 15px; margin-bottom: 10px;">${section.text}</h3>`;
                break;

            case 'paragraph':
                html += `<div style="margin-bottom: 12px; line-height: 1.6;">${section.text}</div>`;
                break;

            case 'list':
                html += '<div style="margin-bottom: 15px;">';
                section.items.forEach(item => {
                    html += `
                        <div style="background: rgba(78, 204, 163, 0.1); padding: 10px;
                                   border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #4ecca3;">
                            <strong style="color: #4ecca3;">${item.title}</strong><br>
                            <div style="font-size: 13px; color: rgba(255, 255, 255, 0.9); margin-top: 5px;">
                                ${item.text}
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                break;

            case 'example_good':
                html += `
                    <div style="background: rgba(78, 204, 163, 0.2); padding: 15px;
                               border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #4ecca3;">
                        <strong style="color: #4ecca3;">${section.title}</strong><br>
                        <div style="margin-top: 8px; color: white;">"${section.text}"</div>
                    </div>
                `;
                break;

            case 'example_bad':
                html += `
                    <div style="background: rgba(255, 107, 107, 0.2); padding: 15px;
                               border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #ff6b6b;">
                        <strong style="color: #ff6b6b;">${section.title}</strong><br>
                        <div style="margin-top: 8px; color: white;">"${section.text}"</div>
                    </div>
                `;
                break;

            case 'tip':
                html += `
                    <div style="background: rgba(255, 217, 61, 0.2); padding: 15px;
                               border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #ffd93d;">
                        <strong style="color: #ffd93d;">${section.title}</strong><br>
                        <div style="margin-top: 8px; color: white;">${section.text}</div>
                    </div>
                `;
                break;
        }
    });

    // Key takeaways
    if (theory.keyTakeaways) {
        html += `
            <div style="background: rgba(162, 155, 254, 0.15); padding: 15px;
                       border-radius: 12px; margin-bottom: 20px;">
                <strong style="color: #a29bfe;">🎯 Ключевые моменты:</strong>
                <ul style="margin-left: 20px; margin-top: 10px;">
        `;
        theory.keyTakeaways.forEach(takeaway => {
            html += `<li style="margin-bottom: 6px; color: white;">${takeaway}</li>`;
        });
        html += `
                </ul>
            </div>
        `;
    }

    // Кнопка закрытия
    html += `
        <button onclick="GameLesson2D.closeTheory('${theoryId}')"
                style="width: 100%; padding: 12px; background: #4ecca3; color: white;
                       border: none; border-radius: 8px; cursor: pointer; font-weight: bold;
                       margin-top: 15px;">
            ✅ Я ПОНИМАЮ
        </button>
    `;

    content.innerHTML = html;
    modal.style.display = 'flex';
    gameState.currentScene = 'theory';

    // Отметить как прочитанную
    if (!gameState.completedTheory) {
        gameState.completedTheory = [];
    }
    if (!gameState.completedTheory.includes(theoryId)) {
        gameState.completedTheory.push(theoryId);
        gameState.totalXP += 10;  // Бонус за изучение теории
    }
};

GameLesson2D.closeTheory = function(theoryId) {
    const modal = document.getElementById('dialogue-modal-2d');
    modal.style.display = 'none';
    document.getElementById('gameCanvas2D').style.display = 'block';
    gameState.currentScene = 'game';
};

GameLesson2D.showTheoryMenu = function() {
    const modal = document.getElementById('dialogue-modal-2d');
    const content = document.getElementById('dialogue-content');

    let html = `
        <h2 style="color: #4ecca3; margin-bottom: 20px;">💡 ВЫБЕРИ ТЕМУ ДЛЯ ИЗУЧЕНИЯ</h2>
    `;

    Object.values(GameData.theoryBlocks).forEach(theory => {
        // Проверяем разблокирована ли теория
        let isUnlocked = true;
        if (theory.requiredXP && gameState.totalXP < theory.requiredXP) {
            isUnlocked = false;
        }

        const opacity = isUnlocked ? 1 : 0.5;
        const cursor = isUnlocked ? 'pointer' : 'not-allowed';

        html += `
            <div style="background: rgba(78, 204, 163, ${isUnlocked ? '0.15' : '0.05'});
                       padding: 15px; border-radius: 12px; margin-bottom: 12px;
                       cursor: ${cursor}; opacity: ${opacity};
                       border: 2px solid ${isUnlocked ? '#4ecca3' : '#666'};"
                 onclick="${isUnlocked ? `GameLesson2D.showTheory('${theory.id}')` : 'alert(\"Заблокировано\")'}"
                 onmouseover="this.style.background='rgba(78, 204, 163, 0.25)'"
                 onmouseout="this.style.background='rgba(78, 204, 163, ${isUnlocked ? '0.15' : '0.05'})'">
                <div style="font-weight: bold; color: #4ecca3; margin-bottom: 5px;">
                    ${theory.icon} ${theory.title}
                </div>
                <div style="font-size: 13px; color: rgba(255, 255, 255, 0.7);">
                    ${theory.subtitle}
                </div>
                ${!isUnlocked ? `<div style="color: #ff6b6b; font-size: 11px; margin-top: 5px;">🔒 Требуется ${theory.requiredXP} XP</div>` : ''}
            </div>
        `;
    });

    html += `
        <button onclick="GameLesson2D.closeDialogue()"
                style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.2);
                       color: white; border: none; border-radius: 8px; cursor: pointer;
                       font-weight: bold; margin-top: 15px;">
            Закрыть
        </button>
    `;

    content.innerHTML = html;
    modal.style.display = 'flex';
};
```

---

### **Пример 3: Обработка consequences в сценариях**

```javascript
// Функция для применения consequences выбора

GameLesson2D.applyConsequence = function(consequence) {
    if (!consequence) return;

    // Применяем изменения статистики
    if (consequence.stats) {
        Object.entries(consequence.stats).forEach(([stat, value]) => {
            // Применяем к общей статистике
            gameState.totalXP += (stat === 'xp' ? value : 0);

            // Применяем к статистике NPC
            Object.keys(gameState.npcs).forEach(npcKey => {
                if (stat.toLowerCase().includes(npcKey.toLowerCase())) {
                    if (!gameState.npcs[npcKey].stats) {
                        gameState.npcs[npcKey].stats = {};
                    }
                    const statName = stat.replace(npcKey + '_', '').replace(npcKey, '');
                    gameState.npcs[npcKey].stats[statName] =
                        (gameState.npcs[npcKey].stats[statName] || 0) + value;
                }
            });

            // Специальные статистики
            if (stat === 'personal_meeting' && value === 'at_risk') {
                gameState.personalMeetingAtRisk = true;
            }
            if (stat === 'sprint_plan' && value === 'disrupted') {
                gameState.sprintDisrupted = true;
            }
        });
    }

    // Добавляем достижение если указано
    if (consequence.achievement) {
        if (!gameState.achievements.includes(consequence.achievement)) {
            gameState.achievements.push(consequence.achievement);
            // Показываем уведомление о достижении
            showAchievementNotification(consequence.achievement);
        }
    }
};

function showAchievementNotification(achievementId) {
    const achievement = GameData.achievements[achievementId];
    if (!achievement) return;

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4ecca3 0%, #2ecc71 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideIn 0.5s ease;
    `;

    notification.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 5px;">
            🏆 ${achievement.name}
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
            +${achievement.xpReward} XP
        </div>
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
```

---

### **Пример 4: Расчет финального пути в финальном кейсе**

```javascript
// Функция для определения какой путь выбран

GameLesson2D.calculateCrisisPath = function() {
    const choices = gameState.crisisChoices;
    const paths = GameData.crisisCase.finalPaths;

    // Проверяем каждый путь
    for (let pathName in paths) {
        const path = paths[pathName];

        // Проверяем все условия пути
        let conditionsMet = true;
        for (let condition of path.trigger) {
            // Парсим условие типа "denis_stuck === delegate_maria"
            const [key, value] = condition.split(' === ');
            const trimmedKey = key.trim();
            const trimmedValue = value.replaceAll("'", "").trim();

            if (choices[trimmedKey] !== trimmedValue) {
                conditionsMet = false;
                break;
            }
        }

        if (conditionsMet) {
            return path;  // Нашли подходящий путь
        }
    }

    // Если ничего не совпало - возвращаем panic path (по умолчанию)
    return paths.panic;
};

// Использование:
GameLesson2D.showCrisisResults = function() {
    const path = this.calculateCrisisPath();

    // Применяем consequences пути
    gameState.totalXP += path.xp;
    if (path.skills) {
        Object.entries(path.skills).forEach(([skill, value]) => {
            gameState.totalSkills[skill] = (gameState.totalSkills[skill] || 0) + value;
        });
    }
    if (path.achievements) {
        gameState.achievements.push(...path.achievements);
    }

    // Показываем результаты
    this.displayCrisisPath(path);
};
```

---

## 📊 ПРИМЕРЫ ДАННЫХ ДЛЯ game-2d-data.js

### **Пример: Полный сценарий с consequences**

```javascript
// Как должна выглядеть структура сценария в game-2d-data.js

scenarios: {
    example_scenario: {
        id: 'example',
        title: 'Пример сценария',
        npc: 'katya',

        introduction: {
            speaker: 'katya',
            text: 'Привет Алекс!',
            context: {
                title: '📊 Информация:',
                items: ['Пункт 1', 'Пункт 2']
            }
        },

        choices: [
            {
                id: 'choice1',
                title: 'Первый выбор',
                recommended: true,
                consequence: {
                    dialogue: [
                        { speaker: 'katya', text: 'Отлично!' }
                    ],
                    stats: {
                        katya_satisfaction: 10,
                        xp: 50
                    },
                    achievement: 'achievement_id',
                    feedback: {
                        title: '✅ Отлично!',
                        points: ['Пункт 1', 'Пункт 2']
                    }
                }
            }
        ]
    }
}
```

---

## ✅ ЧЕКЛИСТ ДЛЯ КАЖДОГО ДНЯ

### **День 1 - Зоны:**
- [ ] Скопировать структуру zones из примера
- [ ] Добавить функцию drawZones()
- [ ] Добавить функцию checkZoneEntry()
- [ ] Протестировать: может ходить по зонам
- [ ] Зоны видны на canvas

### **День 2 - Теория:**
- [ ] Скопировать структуру theoryBlocks
- [ ] Реализовать showTheory()
- [ ] Реализовать showTheoryMenu()
- [ ] Протестировать: все блоки открываются
- [ ] Проверить unlock conditions

### **День 2-3 - Кейсы:**
- [ ] Расширить scenarios в game-2d-data.js
- [ ] Для каждого кейса: добавить все выборы из спеки
- [ ] Для каждого выбора: добавить полные consequences
- [ ] Протестировать: все диалоги показываются

### **День 3-4 - Кризис:**
- [ ] Заполнить все 6 проблем в crisisCase.problems
- [ ] Для каждой проблемы: все 3-4 варианта выборов
- [ ] Все consequences
- [ ] Реализовать calculateCrisisPath()
- [ ] Реализовать все три финальных пути

### **День 5 - Тестирование:**
- [ ] Полное прохождение wise path
- [ ] Полное прохождение burnout path
- [ ] Полное прохождение panic path
- [ ] Проверка XP и достижений
- [ ] Финальное тестирование на ошибки

---

Эти примеры покрывают основные паттерны для расширения! 🚀
