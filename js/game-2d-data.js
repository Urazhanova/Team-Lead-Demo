/**
 * GAME LESSON 3 DATA
 * Все диалоги, кейсы, выборы и consequence из specification
 */

const GameData = {
    // ============================================
    // NPCS И ПОЗИЦИИ
    // ============================================
    npcs: {
        alex: {
            name: 'Алекс',
            emoji: '👤',
            image: 'assets/images/characters/alex/neutral.png',
            color: '#ff6b6b',
            role: 'Team Lead',
            description: 'Ты'
        },
        katya: {
            name: 'Катя',
            emoji: '👩‍💻',
            image: 'assets/images/characters/Katya/icon.svg',
            color: '#fd79a8',
            role: 'Junior Developer',
            x: 600,
            y: 150
        },
        denis: {
            name: 'Денис',
            emoji: '👨‍💻',
            image: 'assets/images/characters/Denis/icon.svg',
            color: '#4facfe',
            role: 'Middle Developer',
            x: 200,
            y: 400
        },
        maria: {
            name: 'Мария',
            emoji: '👩‍💻',
            image: 'assets/images/characters/Mariya/icon.svg',
            color: '#a29bfe',
            role: 'Senior Developer',
            x: 600,
            y: 450
        },
        lena: {
            name: 'Лена',
            emoji: '👩‍🎨',
            image: 'assets/images/characters/lena/icon.svg',
            color: '#4ecca3',
            role: 'Designer',
            x: 350,
            y: 250
        },
        igor: {
            name: 'Игорь',
            emoji: '👨‍💼',
            image: 'assets/images/characters/Igor/icon.svg',
            color: '#ffd93d',
            role: 'QA Engineer',
            x: 450,
            y: 500
        }
    },

    // ============================================
    // ZONES - ЗОНЫ ОФИСА
    // ============================================
    zones: {
        meeting_room: {
            id: 'meeting_room',
            label: '🚪 Переговорная',
            description: 'Место для планирования и встреч',
            x: 50,
            y: 50,
            width: 300,
            height: 250,
            color: 'rgba(78, 204, 163, 0.1)',
            borderColor: '#4ecca3',
            purpose: 'Проведение планирования, Planning Poker, собрания команды',
            interactive: false
        },

        task_board: {
            id: 'task_board',
            label: '📋 Доска задач',
            description: 'Визуализация бэклога',
            x: 400,
            y: 80,
            width: 150,
            height: 200,
            color: 'rgba(255, 217, 61, 0.1)',
            borderColor: '#ffd93d',
            purpose: 'Просмотр и приоритизация задач',
            interactive: true,
            interactionType: 'object'
        },

        work_area: {
            id: 'work_area',
            label: '💻 Рабочая зона',
            description: 'Рабочие места команды',
            x: 450,
            y: 350,
            width: 300,
            height: 200,
            color: 'rgba(79, 172, 254, 0.1)',
            borderColor: '#4facfe',
            purpose: 'Рабочие столы Марии, Дениса, Кати',
            interactive: false
        },

        theory_zone: {
            id: 'theory_zone',
            label: '💡 Зона обучения',
            description: 'Место для изучения теории',
            x: 100,
            y: 400,
            width: 200,
            height: 150,
            color: 'rgba(162, 155, 254, 0.1)',
            borderColor: '#a29bfe',
            purpose: 'Показ теоретических блоков',
            interactive: true,
            interactionType: 'trigger'
        },

        alex_office: {
            id: 'alex_office',
            label: '🏢 Кабинет Алекса',
            description: 'Место для принятия решений',
            x: 650,
            y: 50,
            width: 120,
            height: 120,
            color: 'rgba(255, 107, 107, 0.1)',
            borderColor: '#ff6b6b',
            purpose: 'Опциональное место для размышлений',
            interactive: true,
            interactionType: 'trigger'
        }
    },

    // ============================================
    // WALLS - ПРЕПЯТСТВИЯ И СТЕНЫ
    // ============================================
    walls: [
        // ВНЕШНИЕ СТЕНЫ
        { x: 0, y: 0, width: 800, height: 20, type: 'wall', name: 'top_wall' },
        { x: 0, y: 580, width: 800, height: 20, type: 'wall', name: 'bottom_wall' },
        { x: 0, y: 0, width: 20, height: 600, type: 'wall', name: 'left_wall' },
        { x: 780, y: 0, width: 20, height: 600, type: 'wall', name: 'right_wall' },

        // СТОЛЫ В ПЕРЕГОВОРНОЙ
        { x: 100, y: 150, width: 200, height: 15, type: 'desk', name: 'meeting_table' },

        // СТОЛЫ В РАБОЧЕЙ ЗОНЕ
        { x: 480, y: 400, width: 100, height: 15, type: 'desk', name: 'maria_desk' },
        { x: 600, y: 400, width: 100, height: 15, type: 'desk', name: 'denis_desk' },
        { x: 530, y: 480, width: 100, height: 15, type: 'desk', name: 'katya_desk' }
    ],

    // ============================================
    // NPC BEHAVIOR - ПОВЕДЕНИЕ ПЕРСОНАЖЕЙ
    // ============================================
    npcBehavior: {
        katya: {
            name: 'Катя',
            role: 'Junior Developer',
            defaultZone: 'meeting_room',
            startX: 150,
            startY: 150,
            canMove: false,
            canInteract: true,
            state: 'working',
            stats: {
                satisfaction: 0,
                motivation: 0,
                skills: 0,
                trust: 0
            }
        },

        denis: {
            name: 'Денис',
            role: 'Middle Developer',
            defaultZone: 'hallway',
            startX: 320,
            startY: 450,
            canMove: false,
            canInteract: true,
            state: 'working',
            stats: {
                satisfaction: 0,
                stress: 0,
                growth: 0
            }
        },

        maria: {
            name: 'Мария',
            role: 'Senior Developer',
            defaultZone: 'task_board',
            startX: 300,
            startY: 150,
            canMove: false,
            canInteract: true,
            state: 'working',
            stats: {
                satisfaction: 0,
                loyalty: 0,
                leadership_xp: 0
            }
        },

        lena: {
            name: 'Лена',
            role: 'Designer',
            defaultZone: 'work_area',
            startX: 550,
            startY: 450,
            canMove: false,
            canInteract: true,
            state: 'working',
            stats: {
                satisfaction: 0,
                confidence: 0
            }
        },

        igor: {
            name: 'Игорь',
            role: 'QA Engineer',
            defaultZone: 'hallway',
            startX: 600,
            startY: 120,
            canMove: false,
            canInteract: true,
            state: 'working',
            stats: {
                satisfaction: 0,
                morale: 0
            }
        }
    },

    // ============================================
    // СЦЕНАРИИ И ДИАЛОГИ
    // ============================================
    scenarios: {
        // ========== CASE 0: ПОМОЩЬ ДЕНИСУ ==========
        help_denis: {
            id: 'help_denis',
            title: 'Помощь Денису с архитектурой',
            npc: 'denis',
            objective: 'Подойди к Денису и помоги ему разобраться с архитектурным вопросом',

            introduction: {
                speaker: 'denis',
                role: 'Middle Developer',
                emotion: '😟',
                text: 'Алекс, у меня проблема. Я не могу выбрать между двумя подходами к архитектуре. Какой лучше?',

                context: {
                    title: '🏗️ Архитектурные варианты:',
                    items: [
                        '❌ Вариант 1: Быстрый, но нестабильный',
                        '✅ Вариант 2: Медленнее, но надежный',
                        '⏱️ У нас есть 2 часа на решение',
                        '🤔 От выбора зависит весь проект'
                    ]
                },

                thoughts: '💭 Твои мысли: Это важное решение. Как помочь Денису принять правильный выбор?'
            },

            theory: {
                id: 'architecture_decision',
                title: 'ПРИНЯТИЕ АРХИТЕКТУРНЫХ РЕШЕНИЙ',
                subtitle: 'Как выбрать правильный подход',

                content: [
                    {
                        heading: '🎯 Что такое хорошая архитектура?',
                        text: 'Это не просто "быстро" или "надежно". Это баланс между скоростью разработки, поддерживаемостью и производительностью.'
                    },
                    {
                        heading: '📊 Критерии выбора',
                        items: [
                            '1️⃣ Требования проекта (что важнее: скорость или надежность?)',
                            '2️⃣ Время на разработку (есть ли срыв спринта?)',
                            '3️⃣ Поддерживаемость (кто будет это поддерживать?)',
                            '4️⃣ Расширяемость (нужно ли развивать дальше?)',
                            '5️⃣ Опыт команды (она знает этот паттерн?)'
                        ]
                    },
                    {
                        heading: '✅ Процесс принятия решения',
                        text: '1. Четко определить требования\n2. Взвесить все варианты\n3. Обсудить с командой\n4. Выбрать с обоснованием\n5. Задокументировать'
                    }
                ]
            },

            choices: [
                {
                    id: 'quick_decision',
                    letter: 'A',
                    title: '"Денис, давай быстрый вариант, у нас дедлайн!"',
                    hint: '⚠️ Быстро, но рискованно',

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'У нас дедлайн. Быстрый вариант - это наше решение.' },
                            { speaker: 'denis', emotion: '😟', text: 'Хорошо... но я знаю что это создаст проблемы потом' },
                            { speaker: 'system', text: 'Денис согласился, но неуверен. Позже будут баги в продакшене.' }
                        ],

                        stats: {
                            time_left: -60,
                            sprint_quality: 'poor',
                            future_burnout_risk: 15,
                            xp: 30
                        },

                        feedback: {
                            title: '⚠️ Техдолг накоплен',
                            points: [
                                'Спринт закончился в срок',
                                'Но качество кода низкое',
                                'Будут проблемы в поддержке'
                            ]
                        }
                    }
                },

                {
                    id: 'proper_decision',
                    letter: 'B',
                    title: 'Разобраться вместе: требования → анализ → выбор',
                    hint: '⭐ Лучший вариант',
                    recommended: true,

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'Денис, давай разберёмся. Какие требования самые важные?' },
                            { speaker: 'denis', text: 'Надежность и поддерживаемость. Скорость разработки вторична.' },
                            { speaker: 'alex', text: 'Значит вариант 2. Медленнее, но правильно.' },
                            { speaker: 'alex', text: 'Остальной время сфокусимся на этом варианте.' },
                            { speaker: 'system', text: '[Денис реализует проект с надежной архитектурой]' }
                        ],

                        stats: {
                            denis_satisfaction: 15,
                            denis_growth: 10,
                            code_quality: 20,
                            sprint_quality: 'excellent',
                            xp: 100
                        },

                        feedback: {
                            title: '✅ Архитектура на уровне!',
                            points: [
                                'Правильный выбор основания',
                                'Код легко поддерживать',
                                'Команда довольна качеством'
                            ]
                        }
                    }
                },

                {
                    id: 'defer_decision',
                    letter: 'C',
                    title: '"Подумай сам, это твое решение"',
                    hint: '😕 Оставить одного',

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'Ты опытный разработчик, Денис. Решай сам.' },
                            { speaker: 'denis', emotion: '😞', text: 'Но я не уверен... мне нужна помощь' },
                            { speaker: 'system', text: 'Денис остался один. Выбрал неправильно из-за неуверенности.' }
                        ],

                        stats: {
                            denis_satisfaction: -10,
                            denis_stress: 10,
                            team_morale: -5,
                            xp: 20
                        },

                        feedback: {
                            title: '❌ Неправильный выбор',
                            points: [
                                'Денис чувствует себя брошенным',
                                'Выбрал неправильный вариант',
                                'Это повлияет на проект'
                            ]
                        }
                    }
                }
            ]
        },

        // ========== CASE 1: ОБРАТНАЯ СВЯЗЬ КАТЕ ==========
        feedback_katya: {
            id: 'feedback_katya',
            title: 'Дать обратную связь Кате',
            npc: 'katya',
            objective: 'Подойди к Кате и обсуди её код',

            introduction: {
                speaker: 'katya',
                role: 'Junior Developer',
                emotion: '😊',
                text: 'Алекс, привет! Я сдала задачу! Код работает и все тесты проходят. Можешь посмотреть?',

                context: {
                    title: '📄 Ты смотришь на код:',
                    items: [
                        '✅ Код работает, тесты проходят',
                        '❌ Нет комментариев',
                        '❌ Переменные: a, b, temp, data',
                        '❌ Сложная логика'
                    ]
                },

                thoughts: '💭 Твои мысли: Нужно дать фидбек... Но как сказать чтобы не демотивировать новичка?'
            },

            theory: {
                id: 'sbi_model',
                title: 'ОБРАТНАЯ СВЯЗЬ',
                subtitle: 'Модель SBI для конструктивной критики',

                content: [
                    {
                        heading: '🎯 Что такое обратная связь?',
                        text: 'Обратная связь - это не просто "плохо" или "хорошо". Это конкретная информация о том, как действия человека влияют на результат.'
                    },
                    {
                        heading: '📊 Модель SBI',
                        sections: [
                            {
                                letter: 'S',
                                title: 'Situation (Ситуация)',
                                text: 'Когда и где это произошло?',
                                example: 'Пример: "В задаче которую ты сдала..."'
                            },
                            {
                                letter: 'B',
                                title: 'Behavior (Поведение)',
                                text: 'Что конкретно человек сделал? Факты, не оценки.',
                                example: 'Пример: "...не было комментариев..."'
                            },
                            {
                                letter: 'I',
                                title: 'Impact (Влияние)',
                                text: 'Какой эффект это произвело?',
                                example: 'Пример: "...это усложнит поддержку"'
                            }
                        ]
                    },
                    {
                        heading: '❌ Плохо:',
                        text: '"Катя, код не очень. Переделай."',
                        isBad: true
                    },
                    {
                        heading: '✅ Хорошо (используя SBI):',
                        text: '"В задаче которую ты сдала (S), нет комментариев (B), это усложнит поддержку другим (I). Давай обсудим?"',
                        isGood: true
                    },
                    {
                        heading: '✅ Правила обратной связи',
                        text: '• Корректирующую ОС давай наедине, не публично\n• Будь конкретным, не общим\n• Фокусируйся на поведении, не на личности\n• Предложи решение'
                    }
                ]
            },

            choices: [
                {
                    id: 'harsh_feedback',
                    letter: 'A',
                    title: '"Катя, код не очень. Переделай."',
                    hint: '💡 Быстро, но жестко',
                    recommended: false,

                    consequence: {
                        dialogue: [
                            { speaker: 'katya', emotion: '😞', text: 'О... Хорошо... Я переделаю...' },
                            { speaker: 'system', text: 'Катя выглядит расстроенной и демотивированной' }
                        ],

                        stats: {
                            katya_satisfaction: -10,
                            katya_motivation: -15,
                            xp: 20,
                            skill_development: -1
                        },

                        feedback: {
                            title: '❌ Жесткая критика демотивирует',
                            points: [
                                'Ты ранил новичка',
                                'Она может потерять уверенность',
                                'Команда боится спрашивать совета',
                                'Развитие замораживается'
                            ]
                        }
                    }
                },

                {
                    id: 'no_feedback',
                    letter: 'B',
                    title: '"Все ок, утверждаю!" 👍',
                    hint: '💡 Мягко, но неправда',
                    recommended: false,

                    consequence: {
                        dialogue: [
                            { speaker: 'katya', emotion: '😊', text: 'Спасибо! Я рада!' },
                            { speaker: 'system', text: 'Катя уходит счастливая, но плохие привычки укрепляются' }
                        ],

                        stats: {
                            katya_satisfaction: 10,
                            katya_motivation: 5,
                            code_quality: -5,
                            xp: 10,
                            skill_development: -2
                        },

                        feedback: {
                            title: '❌ Отсутствие критики замораживает развитие',
                            points: [
                                'Катя не узнает о проблемах',
                                'Плохие привычки укрепляются',
                                'Качество кода не улучшается',
                                'Дикие навыки лидера: нужна честность'
                            ]
                        }
                    }
                },

                {
                    id: 'sbi_feedback',
                    letter: 'C',
                    title: '"Катя, давай созвонимся? Хочу обсудить код"',
                    hint: '⭐ Лучший вариант (требует теорию)',
                    recommended: true,
                    requiresTheory: true,

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'В задаче которую ты сдала (S), я вижу что код работает - это круто! Но нет комментариев и переменные не описательные (B)...' },
                            { speaker: 'alex', text: '...это усложнит поддержку. Если Денису придется чинить баг, ему будет сложно разобраться (I).' },
                            { speaker: 'katya', emotion: '😊', text: 'О, понятно! Я не знала что это так важно. Сейчас исправлю! Спасибо что объяснил, а не просто сказал переделать!' }
                        ],

                        stats: {
                            katya_satisfaction: 15,
                            katya_motivation: 10,
                            katya_skills: 10,
                            trust_level: 10,
                            xp: 50,
                            skill_feedback: 3,
                            skill_people_management: 2
                        },

                        achievement: 'sbi_master',

                        feedback: {
                            title: '✅ Отличная обратная связь!',
                            sections: [
                                {
                                    subtitle: '1️⃣ КОНСТРУКТИВНОСТЬ',
                                    points: [
                                        'Ты похвалил хорошее (код работает)',
                                        'Указал на конкретные проблемы',
                                        'Объяснил последствия'
                                    ]
                                },
                                {
                                    subtitle: '2️⃣ РАЗВИТИЕ',
                                    points: [
                                        'Катя поняла почему это важно',
                                        'Уверенность возросла',
                                        'Она будет писать лучше'
                                    ]
                                },
                                {
                                    subtitle: '3️⃣ ОТНОШЕНИЯ',
                                    points: [
                                        'Доверие между вами укрепилось',
                                        'Катя видит что ты вкладываешь в её рост',
                                        'Открытость к критике возросла'
                                    ]
                                }
                            ]
                        }
                    }
                }
            ]
        },

        // ========== CASE 2: ПЛАНИРОВАНИЕ С КОМАНДОЙ ==========
        team_planning: {
            id: 'team_planning',
            title: 'Планирование спринта с командой',
            npc: 'maria',
            objective: 'Проведи встречу планирования со своей командой',

            introduction: {
                speaker: 'maria',
                role: 'Senior Developer',
                emotion: '😊',
                text: 'Алекс, у нас встреча планирования. Команда ждет в переговорной. На доске 20 задач, нужно выбрать 8 на спринт. У нас есть только 40 story points capacity.',

                context: {
                    title: '📊 Информация:',
                    items: [
                        '📋 20 задач на выбор',
                        '💪 Capacity: 40 story points',
                        '⏱️ Спринт: 2 недели',
                        '🎯 Квартальные цели',
                        '⚠️ 3 critical issues'
                    ]
                },

                thoughts: '💭 Твои мысли: Как распределить приоритеты? Какие задачи в спринт? Как командой принять решение?'
            },

            theory: {
                id: 'prioritization_matrix',
                title: 'ПРИОРИТИЗАЦИЯ',
                subtitle: 'Матрица Эйзенхауэра для расставления приоритетов',

                content: [
                    {
                        heading: '🎯 Почему приоритизация важна?',
                        text: 'Без приоритизации команда делает всё подряд. Результат: ничего не доводится до конца, все спешат, качество падает.'
                    },
                    {
                        heading: '📊 Матрица Эйзенхауэра',
                        text: 'Разделяет задачи на 4 квадранта:',
                        matrix: [
                            {
                                quadrant: '1️⃣ СРОЧНО И ВАЖНО',
                                description: 'Кризисы, deadline, срочные ошибки',
                                color: '#ff6b6b',
                                action: 'Делай СЕЙЧАС'
                            },
                            {
                                quadrant: '2️⃣ НЕ СРОЧНО, НО ВАЖНО',
                                description: 'Стратегия, развитие, планирование',
                                color: '#4ecca3',
                                action: 'Планируй ХОРОШО (здесь вся ценность!)'
                            },
                            {
                                quadrant: '3️⃣ СРОЧНО, НО НЕ ВАЖНО',
                                description: 'Отвлечения, многие совещания',
                                color: '#ffd93d',
                                action: 'Делегируй или отклони'
                            },
                            {
                                quadrant: '4️⃣ НЕ СРОЧНО И НЕ ВАЖНО',
                                description: 'Прокрастинация, развлечения',
                                color: '#a29bfe',
                                action: 'Удали или игнорируй'
                            }
                        ]
                    },
                    {
                        heading: '✅ Как это работает в спринте?',
                        text: '1. Все задачи раскладываешь по квадрантам\n2. В спринт берешь: Квадрант 1 (100%) + Квадрант 2 (столько сколько поместится)\n3. Остальное на следующие спринты или в backlog\n4. Команда понимает стратегию, а не чувствует сумаву'
                    }
                ]
            },

            choices: [
                {
                    id: 'random_selection',
                    letter: 'A',
                    title: '"Давайте возьмем первые 8 задач по списку"',
                    hint: '💡 Быстро, но не стратегично',
                    recommended: false,

                    consequence: {
                        dialogue: [
                            { speaker: 'maria', emotion: '😕', text: 'Но это не приоритеты... Мы пропустим важные задачи' },
                            { speaker: 'system', text: 'Команда делает задачи без связи со стратегией' }
                        ],

                        stats: {
                            team_satisfaction: -5,
                            strategic_value: -10,
                            sprint_quality: 'poor',
                            xp: 15
                        },

                        feedback: {
                            title: '❌ Отсутствие стратегии',
                            points: [
                                'Команда не понимает почему эти задачи',
                                'Важное откладывается',
                                'Скорость работы не улучшается'
                            ]
                        }
                    }
                },

                {
                    id: 'matrix_planning',
                    letter: 'B',
                    title: 'Применить матрицу Эйзенхауэра с командой',
                    hint: '⭐ Лучший вариант',
                    recommended: true,
                    requiresTheory: true,

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'Ребята, давайте разберемся. Нужно приоритизировать эти 20 задач.' },
                            { speaker: 'alex', text: 'Что срочно И важно? Это в спринт в первую очередь.' },
                            { speaker: 'denis', text: 'Bug в боевом сервере - очень срочно!' },
                            { speaker: 'alex', text: 'Правильно. Что важно, но не срочно? Это стратегические фичи.' },
                            { speaker: 'maria', text: 'Я предлагаю разбить на квадранты вместе' },
                            { speaker: 'system', text: 'Команда активно участвует в планировании' }
                        ],

                        stats: {
                            team_satisfaction: 15,
                            team_engagement: 10,
                            strategic_value: 15,
                            sprint_quality: 'excellent',
                            maria_satisfaction: 10,
                            xp: 60,
                            skill_project_management: 3,
                            skill_communication: 2
                        },

                        achievement: 'prioritization_master',

                        feedback: {
                            title: '✅ Отличное планирование!',
                            sections: [
                                {
                                    subtitle: '1️⃣ СТРАТЕГИЯ',
                                    points: [
                                        'Квартальные цели учтены',
                                        'Приоритеты ясны',
                                        'Никакое важное не потеряется'
                                    ]
                                },
                                {
                                    subtitle: '2️⃣ ВОВЛЕЧЕНИЕ',
                                    points: [
                                        'Команда принимает решение',
                                        'Видит логику приоритизации',
                                        'Мотивирована на результат'
                                    ]
                                },
                                {
                                    subtitle: '3️⃣ РЕЗУЛЬТАТ',
                                    points: [
                                        'Спринт фокусирован',
                                        'Качество выше',
                                        'Риск снижен'
                                    ]
                                }
                            ]
                        }
                    }
                }
            ]
        },

        // ========== CASE 3: РАСПРЕДЕЛЕНИЕ ЗАДАЧ ==========
        task_distribution: {
            id: 'task_distribution',
            title: 'Распределение задач по навыкам',
            npc: 'igor',
            objective: 'Распредели 5 задач между членами команды оптимально',

            introduction: {
                speaker: 'igor',
                role: 'QA Engineer',
                emotion: '😊',
                text: 'Алекс, готов раздавать задачи? Ребята ждут. Но нужно учесть: Денис освещает backend, Катя учится, Лена занята дизайном...',

                context: {
                    title: '👥 Состояние команды:',
                    items: [
                        '👨‍💻 Денис: Backend, может сделать быстро',
                        '👩‍💻 Катя: Учится, нужен наставник',
                        '👩‍🎨 Лена: Дизайн, не кодит',
                        '👩‍💻 Мария: Может помочь новичкам',
                        '👨‍💼 Игорь: Testing, automation'
                    ]
                }
            },

            theory: {
                id: 'skill_based_distribution',
                title: 'РАСПРЕДЕЛЕНИЕ ЗАДАЧ',
                subtitle: 'Назначение по навыкам и развитию',

                content: [
                    {
                        heading: '🎯 Принцип распределения',
                        text: 'Хороший лидер знает не только навыки, но и потенциал каждого. Задача - развивать.'
                    },
                    {
                        heading: '📊 Матрица навыков',
                        skills: [
                            { name: 'Денис', level: 'Senior', tasks: 'Complex, independent' },
                            { name: 'Мария', level: 'Senior', tasks: 'Can mentor' },
                            { name: 'Катя', level: 'Junior', tasks: 'Learning, needs pair' },
                            { name: 'Лена', level: 'Designer', tasks: 'UI/UX only' },
                            { name: 'Игорь', level: 'Middle', tasks: 'Testing, automation' }
                        ]
                    },
                    {
                        heading: '✅ Правила распределения',
                        text: '1. Каждый получит задачу соответствующей сложности\n2. Новичков парят с опытными\n3. Challenge задачи ускоряют рост\n4. Никто не перегружен'
                    }
                ]
            },

            choices: [
                {
                    id: 'unbalanced_distribution',
                    letter: 'A',
                    title: '"Денис берет все 5 задач, остальные отдыхают"',
                    hint: '💡 Быстро, но несправедливо',
                    recommended: false,

                    consequence: {
                        dialogue: [
                            { speaker: 'denis', emotion: '😰', text: 'Стоп, это же слишком много...' },
                            { speaker: 'katya', emotion: '😕', text: 'А как я буду учиться если мне не дают задач?' },
                            { speaker: 'system', text: 'Денис перегружен, новички не растут' }
                        ],

                        stats: {
                            denis_stress: 20,
                            katya_development: -10,
                            team_morale: -10,
                            xp: 10
                        },

                        feedback: {
                            title: '❌ Дисбаланс демотивирует',
                            points: [
                                'Сильные перегружены',
                                'Слабые останавливаются в развитии',
                                'Команда видит: лидер не справляется с распределением',
                                'Текучесть растет'
                            ]
                        }
                    }
                },

                {
                    id: 'skilled_distribution',
                    letter: 'B',
                    title: 'Распредели по навыкам и парируй новичков с опытными',
                    hint: '⭐ Лучший вариант',
                    recommended: true,
                    requiresTheory: true,

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'Денис, сложная backend задача - твоя' },
                            { speaker: 'alex', text: 'Катя, frontend задача, но пара с Марией на code review' },
                            { speaker: 'alex', text: 'Мария, плюс наставничество Кати' },
                            { speaker: 'alex', text: 'Игорь, тесты для всех' },
                            { speaker: 'katya', emotion: '😊', text: 'Спасибо! Я буду учиться!' },
                            { speaker: 'denis', emotion: '😊', text: 'Отлично распределили' }
                        ],

                        stats: {
                            team_satisfaction: 15,
                            katya_development: 15,
                            denis_motivation: 10,
                            maria_leadership_xp: 5,
                            sprint_quality: 'excellent',
                            xp: 70,
                            skill_people_management: 4,
                            skill_project_management: 3
                        },

                        achievement: 'task_distribution_master',

                        feedback: {
                            title: '✅ Умное распределение!',
                            sections: [
                                {
                                    subtitle: '1️⃣ ЭФФЕКТИВНОСТЬ',
                                    points: [
                                        'Каждый работает на своём уровне',
                                        'Нет перегруза',
                                        'Все задачи покрыты'
                                    ]
                                },
                                {
                                    subtitle: '2️⃣ РАЗВИТИЕ',
                                    points: [
                                        'Новичков поднимаешь',
                                        'Опытных привлекаешь к наставничеству',
                                        'Команда растет'
                                    ]
                                },
                                {
                                    subtitle: '3️⃣ МОТИВАЦИЯ',
                                    points: [
                                        'Каждый понимает значение своей роли',
                                        'Справедливость очевидна',
                                        'Лидер вкладывает в их развитие'
                                    ]
                                }
                            ]
                        }
                    }
                }
            ]
        },

        // ========== CASE 4: PLANNING POKER ==========
        planning_poker: {
            id: 'planning_poker',
            title: 'Planning Poker: оценка объема работы',
            npc: 'lena',
            objective: 'Проведи сессию Planning Poker для одной из задач',

            introduction: {
                speaker: 'lena',
                role: 'Designer',
                emoji: '👩‍🎨',
                text: 'Алекс, нам нужно оценить первую задачу. "Переделать дизайн профиля пользователя". Денис говорит 5 points, я говорю 13...',

                context: {
                    title: '📊 Ситуация:',
                    items: [
                        '👨‍💻 Денис: 5 points (думает просто)',
                        '👩‍🎨 Лена: 13 points (видит сложность)',
                        '❓ Катя: молчит (не уверена)',
                        '🤔 Мария: надо обсудить',
                        '⏱️ Время ограничено'
                    ]
                },

                thoughts: '💭 Ты видишь разброс оценок. Как найти истину? Как не давить на команду?'
            },

            theory: {
                id: 'planning_poker_theory',
                title: 'PLANNING POKER',
                subtitle: 'Как правильно оценивать задачи в команде',

                content: [
                    {
                        heading: '🎯 Что такое Planning Poker?',
                        text: 'Метод оценки, где каждый голосует карточкой. Помогает выявить разное понимание задачи и прийти к консенсусу.'
                    },
                    {
                        heading: '📊 Шкала оценок',
                        scale: [
                            { points: '1-2', meaning: 'Очень просто' },
                            { points: '3-5', meaning: 'Простая задача' },
                            { points: '8-13', meaning: 'Средняя сложность' },
                            { points: '20-40', meaning: 'Сложная' },
                            { points: '?', meaning: 'Слишком неясно' }
                        ],
                        text: 'Используем числа Фибоначчи: 1, 2, 3, 5, 8, 13, 20, 40, ?'
                    },
                    {
                        heading: '✅ Процесс Planning Poker',
                        process: [
                            '1️⃣ Читаем задачу вместе',
                            '2️⃣ Задаём вопросы (уточняем требования)',
                            '3️⃣ Все голосуют одновременно',
                            '4️⃣ Если разброс > 5 - обсуждаем',
                            '5️⃣ Человек с мин и макс оценкой объясняет почему',
                            '6️⃣ Голосуем снова',
                            '7️⃣ Когда сходятся - записываем'
                        ]
                    },
                    {
                        heading: '⚠️ Частые ошибки',
                        text: '❌ Давление на команду (давить на Лену чтобы была 5?)\n❌ Поверхностное обсуждение\n❌ Тиранил голосование (один человек = один голос!)\n✅ Уважай мнение каждого'
                    }
                ]
            },

            choices: [
                {
                    id: 'force_consensus',
                    letter: 'A',
                    title: '"Лена, давай найдемся посередине - 8 points"',
                    hint: '💡 Компромисс, но поспешный',
                    recommended: false,

                    consequence: {
                        dialogue: [
                            { speaker: 'lena', emotion: '😕', text: 'Но я же сказала 13... Вы не вкусили сложность дизайна' },
                            { speaker: 'system', text: 'Лена согласилась, но недовольна. Позже задача спешит.' }
                        ],

                        stats: {
                            lena_satisfaction: -8,
                            estimation_accuracy: -10,
                            sprint_delay: true,
                            xp: 20
                        },

                        feedback: {
                            title: '❌ Поспешный консенсус',
                            points: [
                                'Лена чувствует что её не слушают',
                                'Оценка неточная',
                                'Спринт срывается'
                            ]
                        }
                    }
                },

                {
                    id: 'proper_poker',
                    letter: 'B',
                    title: 'Провести правильную сессию: вопросы, обсуждение, результат',
                    hint: '⭐ Лучший вариант',
                    recommended: true,
                    requiresTheory: true,

                    consequence: {
                        dialogue: [
                            { speaker: 'alex', text: 'Отлично видим разброс (Денис 5, Лена 13). Давайте разберемся.' },
                            { speaker: 'alex', text: 'Денис, что в задаче просто? Что тебе не видно?' },
                            { speaker: 'denis', text: 'Я думал это просто UI... но действительно, интеграция с бэком может быть сложнее' },
                            { speaker: 'alex', text: 'Лена, что ты видишь в дизайне?' },
                            { speaker: 'lena', text: 'Новая структура, animations, responsive... это сложно' },
                            { speaker: 'alex', text: 'Спасибо. Голосуем снова со всей информацией' },
                            { speaker: 'system', text: 'Все голосуют снова. Результат: 8-13 points. Итоговая оценка 13.' }
                        ],

                        stats: {
                            team_satisfaction: 15,
                            estimation_accuracy: 15,
                            lena_satisfaction: 12,
                            denis_understanding: 10,
                            sprint_quality: 'excellent',
                            xp: 80,
                            skill_communication: 3,
                            skill_project_management: 3
                        },

                        achievement: 'planning_poker_master',

                        feedback: {
                            title: '✅ Профессиональная оценка!',
                            sections: [
                                {
                                    subtitle: '1️⃣ ПОНИМАНИЕ',
                                    points: [
                                        'Все видят разброс оценок',
                                        'Разберались в причинах',
                                        'Лена объяснила сложность'
                                    ]
                                },
                                {
                                    subtitle: '2️⃣ УВАЖЕНИЕ',
                                    points: [
                                        'Каждое мнение услышано',
                                        'Нет давления',
                                        'Денис понял свой blindspot'
                                    ]
                                },
                                {
                                    subtitle: '3️⃣ ТОЧНОСТЬ',
                                    points: [
                                        'Оценка более точная',
                                        'Спринт реалистичный',
                                        'Разочарований меньше'
                                    ]
                                }
                            ]
                        }
                    }
                }
            ]
        }
    },

    // ========== ФИНАЛЬНЫЙ КРИЗИСНЫЙ КЕЙС ==========
    crisisCase: {
        id: 'friday_crisis',
        title: '🚨 КРИЗИС: ПЯТНИЦА В 17:00',
        time: '17:00 (осталось 1 час до встречи)',
        situation: 'На тебя одновременно свалилось 6 проблем. Только 60 минут. Что делать?',

        problems: [
            {
                id: 'denis_stuck',
                title: '① ДЕНИС ЗАСТРЯЛ',
                from: 'Денис',
                icon: '😱',
                time: '30 минут назад',

                message: 'Алекс, помощь! Я на одной задаче уже 4 часа. Архитектурный deadlock. Не могу найти решение. Ужас.',

                context: {
                    details: [
                        'Застрял на задаче (4 часа)',
                        'Архитектурный deadlock',
                        'Ищет помощь',
                        'Расстроен и вымотан',
                        'Это срыв спринта'
                    ]
                },

                choices: [
                    {
                        id: 'help_myself',
                        label: 'Помочь самому (30 минут)',
                        time_cost: 30,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Денис, давай вместе. Расскажи что прробовал.' },
                                { speaker: 'alex', text: '[Разбираешь проблему 30 минут]' },
                                { speaker: 'denis', emotion: '😊', text: 'О! Я вижу! Спасибо, теперь понимаю!' }
                            ],
                            stats: {
                                denis_satisfaction: 10,
                                denis_growth: 5,
                                maria_satisfaction: -10,
                                personal_meeting: 'at_risk',
                                time_left: -30
                            }
                        }
                    },
                    {
                        id: 'delegate_maria',
                        label: '👩‍💻 "Денис, поговори с Марией" (10 минут)',
                        time_cost: 10,
                        description: 'Мария может помочь, это их зона',
                        recommended: true,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Денис, это архитектурный вопрос. Мария разбирается лучше.' },
                                { speaker: 'alex', text: 'Мария! Денис на deadlock.' },
                                { speaker: 'maria', text: 'Ок, я помогу!' },
                                { speaker: 'system', text: '[Мария помогает Денису 10 минут]' },
                                { speaker: 'denis', emotion: '😊', text: 'Мария спасла ситуацию!' }
                            ],
                            stats: {
                                denis_satisfaction: 8,
                                maria_satisfaction: 10,
                                maria_leadership: 5,
                                time_left: -10
                            }
                        }
                    },
                    {
                        id: 'postpone',
                        label: '⏸️ "Разберемся в понедельник"',
                        time_cost: 2,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Денис, давай отложим на понедельник.' },
                                { speaker: 'denis', emotion: '😞', text: 'Ладно... я просто потратил весь день зря...' }
                            ],
                            stats: {
                                denis_satisfaction: -10,
                                denis_motivation: -5,
                                problem_managed: false,
                                time_left: -2
                            }
                        }
                    },
                    {
                        id: 'google_it',
                        label: '🔍 "Попробуй погуглить решение"',
                        time_cost: 5,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Денис, попробуй найти в интернете похожую архитектуру.' },
                                { speaker: 'system', text: '[Денис гугалит 5 минут]' },
                                { speaker: 'denis', emotion: '😕', text: 'Нашел несколько вариантов... но не уверен...' }
                            ],
                            stats: {
                                denis_growth: 3,
                                risk_of_failure: 50,
                                time_left: -5
                            }
                        }
                    }
                ]
            },

            {
                id: 'igor_bug',
                title: '② ИГОРЬ НАШЕЛ БАГ',
                from: 'Игорь',
                icon: '🐛',
                time: '10 минут назад',

                message: 'Критичный баг: при экспорте больших отчетов (>1000 строк) падает сервер. Воспроизводится стабильно. Клиенты жаловаются.',

                context: {
                    details: [
                        'Баг: падение сервера при экспорте >1000 строк',
                        'Воспроизводимость: 100%',
                        'Затронуто: ~5% пользователей (крупные клиенты)',
                        'Исправление: 3-5 часов работы',
                        'Риск: потеря крупных клиентов'
                    ]
                },

                choices: [
                    {
                        id: 'fix_myself_now',
                        label: '🔥 Чинить сейчас самому (3-5 часов)',
                        time_cost: 180,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', emotion: '😰', text: '[Начинаешь чинить баг вместо встречи]' }
                            ],
                            stats: {
                                personal_meeting: 'missed',
                                alex_stress: 30,
                                client_satisfaction: 10,
                                time_left: -180
                            }
                        }
                    },
                    {
                        id: 'workaround_plan',
                        label: '✅ Workaround сейчас + план на понедельник',
                        time_cost: 15,
                        recommended: true,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Игорь, спасибо за находку. Это важно, но есть workaround.' },
                                { speaker: 'alex', text: '1. Сейчас - напиши workaround в документацию\n2. Отправь email клиентам\n3. Заведи баг в систему\n4. В понедельник планируем исправление' },
                                { speaker: 'igor', text: 'Разумно. Сделаю прямо сейчас.' }
                            ],
                            stats: {
                                client_satisfaction: 7,
                                igor_satisfaction: 10,
                                problem_managed: true,
                                time_left: -15
                            }
                        }
                    },
                    {
                        id: 'ignore',
                        label: '😰 "Это может подождать"',
                        time_cost: 2,
                        consequence: {
                            dialogue: [
                                { speaker: 'igor', emotion: '😠', text: 'Серьезно? Клиенты теряют данные!' }
                            ],
                            stats: {
                                client_satisfaction: -15,
                                igor_satisfaction: -10,
                                risk_of_escalation: true,
                                time_left: -2
                            }
                        }
                    },
                    {
                        id: 'delegate_denis',
                        label: '👨‍💻 Делегировать Денису',
                        time_cost: 5,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Денис, можешь взять этот баг?' },
                                { speaker: 'denis', emotion: '😰', text: 'Но я же застрял на своей задаче...' }
                            ],
                            stats: {
                                denis_satisfaction: -10,
                                denis_stress: 20,
                                risk_of_failure: 70,
                                time_left: -5
                            }
                        }
                    }
                ]
            },

            {
                id: 'ceo_presentation',
                title: '③ CEO ПРОСИТ ПРЕЗЕНТАЦИЮ',
                from: 'CEO',
                icon: '📊',
                time: '30 минут назад',

                message: 'Алекс, в понедельник встреча с инвесторами. Нужна презентация: что команда сделала за месяц, планы на квартал. 10-15 слайдов. Можешь к воскресенью?',

                context: {
                    details: [
                        'Срок: до воскресенья',
                        'Объем: 10-15 слайдов',
                        'Важность: высокая (инвесторы)',
                        'Но: у CEO есть ассистент',
                        'Данные уже есть в папке'
                    ]
                },

                choices: [
                    {
                        id: 'do_myself_weekend',
                        label: '📊 Сделать самому в выходные (2-3 часа)',
                        time_cost: 5,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', emotion: '😔', text: '[Согласился работать в выходные]' }
                            ],
                            stats: {
                                weekend_work: true,
                                ceo_satisfaction: 10,
                                alex_stress: 15,
                                work_life_balance: -10,
                                time_left: -5
                            }
                        }
                    },
                    {
                        id: 'manage_expectations',
                        label: '✅ Управлять ожиданиями + предложить альтернативы',
                        time_cost: 10,
                        recommended: true,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Привет! Презентация - отличная идея. Все данные в общей папке [ссылка].' },
                                { speaker: 'alex', text: 'Варианты:\n1) Ассистент оформит слайды, я проверю\n2) Я сделаю простую версию в воскресенье' },
                                { speaker: 'ceo', text: 'О, забыл про ассистента! Давай так: ассистент оформит, ты проверишь.' }
                            ],
                            stats: {
                                weekend_work: false,
                                ceo_satisfaction: 8,
                                communication_skill: 5,
                                time_left: -10
                            }
                        }
                    },
                    {
                        id: 'refuse',
                        label: '❌ "Это не моя задача"',
                        time_cost: 2,
                        consequence: {
                            dialogue: [
                                { speaker: 'ceo', emotion: '😠', text: 'Хм... ладно, буду сам' }
                            ],
                            stats: {
                                ceo_satisfaction: -15,
                                political_capital: -10,
                                time_left: -2
                            }
                        }
                    },
                    {
                        id: 'say_yes_lie',
                        label: '😰 Согласиться, но не сделать',
                        time_cost: 2,
                        consequence: {
                            dialogue: [
                                { speaker: 'system', text: '[В понедельник CEO спрашивает про презентацию...]' }
                            ],
                            stats: {
                                trust: -10,
                                future_problem: true,
                                time_left: -2
                            }
                        }
                    }
                ]
            },

            {
                id: 'product_rework',
                title: '④ ПРОДАКТ ХОЧЕТ ПЕРЕДЕЛАТЬ',
                from: 'Ольга (Продакт)',
                icon: '🔄',
                time: 'сейчас (звонок)',

                message: 'Алекс, клиент недоволен новым фильтром. Говорит неудобно. Надо переделать логику. Это критично для продления контракта.',

                context: {
                    details: [
                        'Фича работает по требованиям',
                        'Клиент хочет изменить логику',
                        'Переделка = 8 SP (3-4 дня)',
                        'Контракт важный',
                        'Спринт уже распланирован',
                        'Неясно что именно не нравится'
                    ]
                },

                choices: [
                    {
                        id: 'immediate_yes',
                        label: '✅ "Да, сделаем срочно!"',
                        time_cost: 5,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: '[Согласился, спринт рушится]' }
                            ],
                            stats: {
                                olga_satisfaction: 10,
                                sprint_plan: 'disrupted',
                                team_stress: 15,
                                time_left: -5
                            }
                        }
                    },
                    {
                        id: 'schedule_meeting',
                        label: '✅ Запланировать обсуждение на понедельник',
                        time_cost: 10,
                        recommended: true,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Ольга, понял. Клиент важен. Но давай разберемся детально.' },
                                { speaker: 'alex', text: 'Переделка = 8 SP = 3 дня. Сначала:\n- Что именно неудобно?\n- Может есть быстрое решение?\n- Или это действительно переделка?' },
                                { speaker: 'alex', text: 'Встретимся в понедельник утром. Можем созвониться с клиентом?' },
                                { speaker: 'olga', text: 'Хорошая идея. Давай в понедельник в 10:00.' }
                            ],
                            stats: {
                                olga_satisfaction: 7,
                                sprint_plan: 'protected',
                                clarity: 10,
                                quality_of_decision: 10,
                                time_left: -10
                            }
                        }
                    },
                    {
                        id: 'refuse_rework',
                        label: '❌ "Мы сделали по требованиям"',
                        time_cost: 5,
                        consequence: {
                            dialogue: [
                                { speaker: 'olga', emotion: '😠', text: 'Серьезно? Клиент может уйти!' }
                            ],
                            stats: {
                                olga_satisfaction: -15,
                                client_satisfaction: -10,
                                political_capital: -15,
                                time_left: -5
                            }
                        }
                    },
                    {
                        id: 'quick_fix',
                        label: '🔧 "Давай найдемся в быстром решении"',
                        time_cost: 10,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Что конкретно неудобно? Может это UI? Тогда Лена подправит за день.' },
                                { speaker: 'olga', text: 'Клиент говорил что кнопка не там и много кликов...' },
                                { speaker: 'alex', text: 'Это не переделка логики, это UX правки! Лена сделает за 1-2 дня.' }
                            ],
                            stats: {
                                olga_satisfaction: 8,
                                client_satisfaction: 8,
                                sprint_impact: 'minimal',
                                time_left: -10
                            }
                        }
                    }
                ]
            },

            {
                id: 'maria_leave',
                title: '⑤ МАРИЯ ПРОСИТ УЙТИ',
                from: 'Мария',
                icon: '🚪',
                time: 'сейчас',

                message: 'Алекс, извини, но мне нужно срочно уйти. Семейные обстоятельства. Денис просил помощи, но я не успею. Могу завтра пару часов если очень надо.',

                context: {
                    details: [
                        'Мария обычно не просит',
                        'Самый надежный человек',
                        'Денис просил её помощи (проблема 1)',
                        'Предлагает работать в субботу',
                        'Завтра суббота - выходной'
                    ]
                },

                choices: [
                    {
                        id: 'allow_freely',
                        label: '✅ "Конечно, иди. Семья важнее"',
                        time_cost: 2,
                        recommended: true,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Мария, конечно, иди. Семья - это важно.' },
                                { speaker: 'alex', text: 'Не думай о работе в выходные. Отдыхай.' },
                                { speaker: 'maria', emotion: '😊', text: 'Спасибо за понимание, Алекс.' }
                            ],
                            stats: {
                                maria_satisfaction: 15,
                                maria_loyalty: 20,
                                team_morale: 10,
                                future_commitment: 10,
                                time_left: -2
                            }
                        }
                    },
                    {
                        id: 'ask_to_stay',
                        label: '😰 "Но Денису нужна помощь..."',
                        time_cost: 2,
                        consequence: {
                            dialogue: [
                                { speaker: 'maria', emotion: '😠', text: 'Серьезно?! Семейная срочность!' }
                            ],
                            stats: {
                                maria_satisfaction: -10,
                                maria_loyalty: -5,
                                guilt: 10,
                                time_left: -2
                            }
                        }
                    },
                    {
                        id: 'weekend_work',
                        label: '📅 "Окей, но давай завтра пару часов"',
                        time_cost: 2,
                        consequence: {
                            dialogue: [
                                { speaker: 'maria', emotion: '😕', text: 'Ладно, если очень надо...' }
                            ],
                            stats: {
                                maria_satisfaction: -5,
                                maria_weekend: 'lost',
                                future_burnout_risk: 5,
                                time_left: -2
                            }
                        }
                    },
                    {
                        id: 'refuse',
                        label: '❌ "Сейчас нельзя"',
                        time_cost: 5,
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: 'Мария, извини, но сейчас все горит.' },
                                { speaker: 'maria', emotion: '😠', text: 'Серьезно?!' },
                                { speaker: 'system', text: '[Мария остается, но очень зла]' }
                            ],
                            stats: {
                                maria_satisfaction: -25,
                                maria_loyalty: -30,
                                future_risk: 'may_quit',
                                time_left: -5
                            }
                        }
                    }
                ]
            },

            {
                id: 'personal_meeting',
                title: '⑥ ТВОЯ ЛИЧНАЯ ВСТРЕЧА',
                icon: '⏰',
                time: 'через 1 час (в 18:00)',

                message: 'У тебя важная личная встреча, которую нельзя перенести. Ты обещал быть там. (День рождения близкого / важный медосмотр / семейное событие)',

                context: {
                    details: [
                        'Осталось 60 минут',
                        'Ты давал обещание',
                        'Это важно лично для тебя',
                        'Отмена повредит личным отношениям'
                    ]
                },

                choices: [
                    {
                        id: 'go_relaxed',
                        label: '✅ Пойти на встречу спокойно',
                        time_cost: 0,
                        recommended: true,
                        available_if: 'critical_problems_managed',
                        consequence: {
                            dialogue: [
                                { speaker: 'alex', text: '[Смотрит на часы] Все критичное решено или под контролем.' },
                                { speaker: 'alex', text: '[Пишет в чат] Ребята, ухожу. Если что срочное - пишите. Хороших выходных!' },
                                { speaker: 'system', text: 'Алекс уходит спокойно.' }
                            ],
                            stats: {
                                personal_life: 'good',
                                alex_stress: -20,
                                work_life_balance: 10,
                                long_term_sustainability: 10
                            }
                        }
                    },
                    {
                        id: 'cancel',
                        label: '❌ Отменить встречу и работать',
                        time_cost: 0,
                        consequence: {
                            dialogue: [
                                { speaker: 'system', text: '[Звонишь] Извини, форс-мажор на работе. Не смогу...' },
                                { speaker: 'system', text: '[Ответ] Опять работа? Ты обещал... Ладно.' },
                                { speaker: 'alex', emotion: '😔', text: '[Остаешься до ночи]' }
                            ],
                            stats: {
                                personal_life: 'damaged',
                                alex_stress: 40,
                                work_life_balance: -20,
                                burnout_risk: 30,
                                relationship_damage: 15
                            }
                        }
                    },
                    {
                        id: 'go_stressed',
                        label: '😰 Пойти, но в стрессе',
                        time_cost: 0,
                        description: 'Уйти, но проблемы не решены',
                        consequence: {
                            dialogue: [
                                { speaker: 'system', text: 'На встрече ты рассеян, постоянно в телефоне' },
                                { speaker: 'system', text: 'Ни работа, ни личная жизнь не получают внимания' }
                            ],
                            stats: {
                                personal_life: 'unsatisfactory',
                                work_quality: 'poor',
                                alex_stress: 30,
                                team_issues: 'unresolved'
                            }
                        }
                    }
                ]
            }
        ],

        // ========== ФИНАЛЬНЫЕ ПУТИ ==========
        finalPaths: {
            burnout: {
                name: 'Путь к выгоранию',
                outcome: 'negative',
                trigger: [
                    'denis_stuck === help_myself',
                    'igor_bug === fix_myself_now',
                    'personal_meeting === cancel'
                ],
                title: '❌ ГЕРОИЗМ = ВЫГОРАНИЕ',

                timeline: [
                    '17:00 - Начинаешь помогать Денису',
                    '17:30 - Решил проблему Дениса',
                    '17:35 - Начинаешь чинить баг',
                    '20:30 - Баг исправлен, ты вымотан',
                    '20:35 - Начинаешь презентацию',
                    '23:00 - Презентация готова',
                    '23:00 - Осознаешь что пропустил встречу'
                ],

                immediate: [
                    '😫 Работал до полуночи',
                    '😢 Пропустил важное событие',
                    '😰 Полностью вымотан'
                ],

                longTerm: [
                    'Команда видит: тимлид решает всё сам',
                    'Никто не научился',
                    'Личная жизнь страдает',
                    'Через месяц - выгорание'
                ],

                skills: {
                    'Эмоциональный интеллект': -2,
                    'Управление людьми': -1
                },

                xp: 20,

                feedback: {
                    title: '💬 РАЗБОР: ЧТО ПОШЛО НЕ ТАК',
                    points: [
                        'Ты пытался быть героем, но герои выгорают.',
                        '',
                        'Лидер - не тот, кто делает всё сам.',
                        'Лидер - тот, кто помогает КОМАНДЕ справляться.',
                        '',
                        'Ты не делегировал.',
                        'Ты не расставил приоритеты.',
                        'Ты не защитил свои границы.',
                        '',
                        'Через месяц ты выгоришь,',
                        'и команда останется без руля.'
                    ]
                }
            },

            panic: {
                name: 'Бегство от проблем',
                outcome: 'negative',
                trigger: [
                    'most_problems === postpone || ignore'
                ],
                title: '😰 ПРОБЛЕМЫ НЕ РЕШЕНЫ',

                immediate: [
                    '👎 Денис застрял на выходные',
                    '🐛 Баг не исправлен - клиенты страдают',
                    '😠 CEO не получил помощь',
                    '😕 Продакт разочарован',
                    '😰 Команда брошена'
                ],

                longTerm: [
                    'Потеря доверия команды',
                    'Проблемы накапливаются',
                    'Репутация страдает'
                ],

                skills: {
                    'Управление проектами': -2,
                    'Коммуникация': -2
                },

                xp: 5,

                feedback: {
                    title: '💬 РАЗБОР: ЧТО ПОШЛО НЕ ТАК',
                    points: [
                        'Ты просто сбежал от проблем.',
                        '',
                        'Да, личное время важно.',
                        'Но лидер не может просто игнорировать кризисы.',
                        '',
                        'Нужно было хотя бы:',
                        '• Оценить что критично',
                        '• Делегировать',
                        '• Дать указания'
                    ]
                }
            },

            wise: {
                name: 'Мудрый лидер',
                outcome: 'optimal',
                trigger: [
                    'denis_stuck === delegate_maria || google_it',
                    'igor_bug === workaround_plan',
                    'ceo_presentation === manage_expectations',
                    'product_rework === schedule_meeting || quick_fix',
                    'maria_leave === allow_freely',
                    'personal_meeting === go_relaxed'
                ],
                title: '✅ МАСТЕРСКОЕ УПРАВЛЕНИЕ КРИЗИСОМ',

                timeline: [
                    '17:00 - Быстрая оценка (RAID)',
                    '17:02 - Соединил Дениса с Марией (10 мин)',
                    '17:05 - Workaround для бага',
                    '17:10 - Управление ожиданиями CEO',
                    '17:20 - Встреча с продактом запланирована',
                    '17:25 - Разрешил Марии уйти',
                    '17:30 - Всё под контролем, идёшь на встречу'
                ],

                immediate: [
                    '✅ Денис получил помощь (15 мин)',
                    '✅ Баг не блокирует',
                    '✅ CEO понимает ситуацию',
                    '✅ С продактом встреча в понедельник',
                    '✅ Мария ушла спокойно',
                    '✅ Личная встреча не пропущена'
                ],

                longTerm: [
                    'Команда видит: лидер принимает решения',
                    'Проблемы под контролем',
                    'Личные границы сохранены',
                    'Здоровый пример'
                ],

                skills: {
                    'Управление проектами': 3,
                    'Управление людьми': 3,
                    'Коммуникация': 2,
                    'Эмоциональный интеллект': 2
                },

                xp: 200,

                achievements: [
                    'wise_leader',
                    'delegation_master'
                ],

                level_up: {
                    from: 1,
                    to: 2,
                    message: '⬆️ LEVEL UP! Теперь ты Level 2!'
                },

                feedback: {
                    title: '💬 РАЗБОР: ЧТО ТЫ СДЕЛАЛ ПРАВИЛЬНО',
                    sections: [
                        {
                            subtitle: '1️⃣ ПРИОРИТИЗАЦИЯ',
                            points: [
                                'Баг важен, но не требует немедленного исправления',
                                'Workaround = быстрое решение',
                                'Полное исправление планируешь спокойно'
                            ]
                        },
                        {
                            subtitle: '2️⃣ ДЕЛЕГИРОВАНИЕ',
                            points: [
                                'Денису нужна помощь, а не твое решение',
                                'Мария могла помочь за 10 минут',
                                'Ты соединил проблему с решением'
                            ]
                        },
                        {
                            subtitle: '3️⃣ УПРАВЛЕНИЕ ОЖИДАНИЯМИ',
                            points: [
                                'CEO: предложил варианты',
                                'Продакт: не согласился сразу',
                                'Не обещал нереальное'
                            ]
                        },
                        {
                            subtitle: '4️⃣ ЗАБОТА О КОМАНДЕ',
                            points: [
                                'Мария: уйти без вины',
                                'Игорь: четкие инструкции',
                                'Денис: нашел решение'
                            ]
                        },
                        {
                            subtitle: '5️⃣ ЗАБОТА О СЕБЕ',
                            points: [
                                'Личное время важно',
                                'Границы нормальны',
                                'Sustainability - основа'
                            ]
                        }
                    ]
                }
            }
        }
    },

    // ========== THEORY BLOCKS ==========
    theoryBlocks: {
        theory1: {
            id: 'theory1',
            title: '💡 Основы планирования команды',
            icon: '💡',
            unlockedAt: 'start',
            reward: 10,
            content: `ОСНОВЫ ПЛАНИРОВАНИЯ КОМАНДЫ

🎯 ТРИ ВОПРОСА ПЛАНИРОВАНИЯ:

1. ЧТО делать? (приоритизация)
2. КТО будет делать? (распределение)
3. КОГДА будет готово? (оценка)

Звучит просто? На практике - самое сложное!

Каждый день, когда вы планируете спринт, вы отвечаете на эти три вопроса. От качества ответов зависит:
• Довольность команды
• Способность выполнить план
• Рост навыков команды
• Ваше спокойствие как тимлида`
        },

        theory2: {
            id: 'theory2',
            title: '📊 Eisenhower Matrix',
            icon: '📊',
            unlockedAt: 'start',
            reward: 15,
            content: `EISENHOWER MATRIX
Матрица важности-срочности

┌─────────────────┬─────────────────┐
│ СРОЧНО +        │ СРОЧНО +        │
│ ВАЖНО           │ НЕ ВАЖНО        │
│                 │                 │
│ 🔥 ДЕЛАТЬ       │ ⚡ ДЕЛЕГИРОВАТЬ │
│ СРАЗУ           │ ИЛИ БЫСТРО      │
│                 │                 │
│ Критичные баги  │ Мелкие правки   │
│ Блокеры         │ Простые таски   │
├─────────────────┼─────────────────┤
│ НЕ СРОЧНО +     │ НЕ СРОЧНО +     │
│ ВАЖНО           │ НЕ ВАЖНО        │
│                 │                 │
│ 📅 ПЛАНИРОВАТЬ  │ 🗑️ ОТМЕНИТЬ     │
│                 │                 │
│ Стратегия       │ "Было бы круто" │
│ Технический долг│ Nice-to-have    │
└─────────────────┴─────────────────┘

✅ ПРАВИЛО: Фокусируйся на "Важно", не на "Срочно"!

Большинство тимлидов тратят все время на срочное, теряя из виду важное. Это приводит к выгоранию команды и техническому долгу.`
        },

        theory3: {
            id: 'theory3',
            title: '👥 Распределение задач',
            icon: '👥',
            unlockedAt: 'start',
            reward: 15,
            content: `РАСПРЕДЕЛЕНИЕ ЗАДАЧ

При распределении задач учитывай:

1️⃣ НАВЫКИ
• Кто это умеет делать?
• У кого есть опыт?

2️⃣ ЗАГРУЗКА
• У кого есть время?
• Кто не перегружен?

3️⃣ РАЗВИТИЕ
• Кто хочет научиться?
• Кому это поможет вырасти?

4️⃣ ИНТЕРЕСЫ
• Кому это интересно?
• Кто "горит" этой темой?

⚖️ Баланс: 70% - делают то, что умеют
           30% - учатся новому

⚠️ НЕ ДЕЛАЙ:
❌ Всё самое сложное - одному человеку
❌ Новичку - только скучные задачи
❌ Себе - все срочные задачи

Помни: ты тимлид, а не супергерой! Твоя задача - развивать команду, а не делать всё самому.`
        },

        theory4: {
            id: 'theory4',
            title: '⏱️ Story Points и Planning Poker',
            icon: '⏱️',
            unlockedAt: 'start',
            reward: 20,
            content: `ОЦЕНКА ЗАДАЧ

📏 STORY POINTS
Относительная оценка сложности

Fibonacci: 1, 2, 3, 5, 8, 13, 21

• 1 SP = очень простая (1-2 часа)
• 5 SP = средняя (1 день)
• 13 SP = сложная (2-3 дня)
• 21+ SP = надо разбить на подзадачи!

🎯 VELOCITY (скорость команды):
Сколько SP команда делает за спринт?

Пример:
Прошлый спринт: 45 SP сделали
→ Можно планировать: ~40-50 SP

⚠️ ВАЖНО: Оценивает команда, не тимлид один!

─────────────────────────────────

🎴 PLANNING POKER
Как оценивать задачи вместе

Процесс:
1️⃣ Тимлид описывает задачу
2️⃣ Команда задает вопросы
3️⃣ Все показывают карты одновременно
4️⃣ Обсуждаем крайние значения
5️⃣ Переголосовываем до консенсуса

💡 ЗАЧЕМ: Разные люди видят разные сложности!`
        },

        theory5: {
            id: 'theory5',
            title: '⚡ RAID Framework',
            icon: '⚡',
            unlockedAt: 'start',
            reward: 20,
            content: `RAID FRAMEWORK
Для кризисных ситуаций

R - RECOGNIZE (Признать)
    Что происходит? Какие проблемы?

A - ASSESS (Оценить)
    Что критично? Что может подождать?

I - INFORM (Информировать)
    Кто должен знать? Кому сообщить?

D - DELEGATE/DECIDE (Делегировать/Решить)
    Кто это будет решать? Что делаем?

─────────────────────────────────

🚨 КРИТЕРИИ СРОЧНОСТИ:

КРИТИЧНО (решаем сейчас):
• Блокирует продакшн
• Блокирует всю команду
• Дедлайн < 24 часов
• Влияет на клиентов прямо сейчас

ВАЖНО (решаем сегодня):
• Блокирует одного человека
• Дедлайн < 3 дня
• Может стать критичным

НОРМАЛЬНО (решаем в рабочем порядке):
• Не блокирует никого
• Дедлайн > 3 дней
• Обычная рабочая задача

Используй этот фреймворк, чтобы не паниковать во время кризиса и принимать правильные решения.`
        }
    },

    // ========== QUIZ ==========
    quiz: {
        questions: [
            {
                id: 'q1',
                question: 'Модель SBI используется для:',
                options: [
                    { id: 'a', text: 'Быстрой критики без объяснений', correct: false },
                    { id: 'b', text: 'Конструктивной обратной связи (Situation-Behavior-Impact)', correct: true },
                    { id: 'c', text: 'Похвалы за хорошую работу', correct: false },
                    { id: 'd', text: 'Игнорирования проблем', correct: false }
                ]
            },
            {
                id: 'q2',
                question: 'Матрица Эйзенхауэра разделяет задачи по:',
                options: [
                    { id: 'a', text: 'Сложности кода', correct: false },
                    { id: 'b', text: 'Срочности и важности (4 квадранта)', correct: true },
                    { id: 'c', text: 'Размеру команды', correct: false },
                    { id: 'd', text: 'Цвету приоритета', correct: false }
                ]
            },
            {
                id: 'q3',
                question: 'Когда несколько человек дают разные оценки в Planning Poker:',
                options: [
                    { id: 'a', text: 'Берешь среднее значение и идешь дальше', correct: false },
                    { id: 'b', text: 'Обсуждаешь разброс, выясняешь причины, голосуешь снова', correct: true },
                    { id: 'c', text: 'Принимаешь точку зрения самого опытного', correct: false },
                    { id: 'd', text: 'Отменяешь оценку', correct: false }
                ]
            },
            {
                id: 'q4',
                question: 'Какой выбор в кризисе помогает избежать выгорания?',
                options: [
                    { id: 'a', text: 'Делать всё сам как можно быстрее', correct: false },
                    { id: 'b', text: 'Делегировать, расставить приоритеты, защитить границы', correct: true },
                    { id: 'c', text: 'Игнорировать все проблемы', correct: false },
                    { id: 'd', text: 'Паниковать и просить помощь', correct: false }
                ]
            },
            {
                id: 'q5',
                question: 'Правильное распределение задач учитывает:',
                options: [
                    { id: 'a', text: 'Только навыки людей', correct: false },
                    { id: 'b', text: 'Только сложность задач', correct: false },
                    { id: 'c', text: 'Навыки, уровень, потенциал развития, баланс нагрузки', correct: true },
                    { id: 'd', text: 'Кто первый поднял руку', correct: false }
                ]
            }
        ]
    }
};
