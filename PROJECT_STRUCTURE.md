# Team Lead Academy - Структура проекта

## 📂 Текущая структура

```
Desktop/team-lead-academy-scorm/     ← Корневая папка проекта
├── index.html                        ← Главный файл курса
├── .git/                             ← Git репозиторий
├── .gitignore                        ← Исключения для git
│
├── 📁 css/                           ← Стили
│   ├── variables.css                 ← CSS переменные (цвета, размеры)
│   ├── components.css                ← Компоненты (кнопки, карточки, меню)
│   ├── layouts.css                   ← Макеты и адаптивность
│   └── loading.css                   ← Стили loading экрана
│
├── 📁 js/                            ← JavaScript модули
│   ├── main.js                       ← Инициализация приложения
│   ├── data.js                       ← Загрузка данных из JSON
│   ├── screen-renderer.js            ← Отрисовка экранов
│   ├── navigation.js                 ← Навигация между экранами
│   ├── sidebar-menu.js               ← Гамбургер меню
│   ├── quiz.js                       ← Логика тестов
│   ├── modals.js                     ← Модальные окна
│   ├── timeline.js                   ← Временная шкала
│   ├── scorm-api.js                  ← SCORM API для LMS
│   ├── utilities.js                  ← Утилиты и вспомогательные функции
│   ├── debug-console.js              ← Консоль отладки на странице
│   ├── loading-manager.js            ← Управление экраном загрузки
│   ├── debug-loader.js               ← Загрузчик отладки
│   └── navigation-old.js             ← Старая версия (резервная копия)
│
├── 📁 data/                          ← Данные курса
│   └── lessons.json                  ← Структура всех уроков и экранов
│
├── 📁 assets/                        ← Медиа файлы
│   └── images/
│       ├── scenes/                   ← Сцены и иллюстрации
│       │   ├── heading.png
│       │   ├── office.svg
│       │   └── ...
│       └── characters/               ← Персонажи
│           ├── alex/
│           ├── lena/
│           ├── Denis/
│           ├── Igor/
│           ├── Katya/
│           └── Mariya/
│
├── 📁 fonts/                         ← Шрифты
│   ├── css/                          ← CSS для шрифтов
│   ├── js/                           ← JS для шрифтов
│   └── webfonts/                     ← Файлы шрифтов
│
└── 📄 Документация
    ├── DEBUG_CONSOLE_GUIDE.md        ← Как использовать debug консоль
    ├── SIDEBAR_IMPLEMENTATION.md     ← Документация меню
    ├── TESTING_HAMBURGER_MENU.md     ← Тестирование меню
    ├── PERFORMANCE_OPTIMIZATION.md   ← Оптимизация производительности
    └── PROJECT_STRUCTURE.md          ← Этот файл
```

## 🚀 Как запустить?

### Локально на компьютере:
```bash
# Перейти в папку
cd ~/Desktop/team-lead-academy-scorm

# Запустить локальный сервер (например, с Python)
python3 -m http.server 8001

# Открыть в браузере
http://localhost:8001
```

### По сети (с мобильного, например):
```
http://<ваш-ip>:8001
```

## 📦 Основные технологии

- **HTML5** - Структура страницы
- **CSS3** - Стили и анимации
- **JavaScript ES5** - Логика приложения (совместимо со SCORM)
- **JSON** - Структура данных курса
- **Font Awesome 6.4.0** - Иконки
- **Tailwind CSS** - Утилитарные стили
- **Google Fonts** - Шрифты

## 🔗 Важные ссылки

- **GitHub**: https://github.com/Urazhanova/Team-Lead-Demo
- **Локальный курс**: http://localhost:8001
- **Git репозиторий**: `.git/`

## 📊 Ключевые файлы

| Файл | Назначение |
|------|-----------|
| `index.html` | Главный файл (точка входа) |
| `data/lessons.json` | Содержимое всех уроков |
| `js/main.js` | Инициализация приложения |
| `js/navigation.js` | Навигация по экранам |
| `css/variables.css` | Глобальные CSS переменные |

## 🎨 CSS переменные

```css
--brand-primary: #163F6F      /* Основной цвет */
--brand-secondary: #1F5A9F   /* Вторичный цвет */
--brand-accent: #FF6B35      /* Акцентный цвет */
--text-primary: #2C3E50      /* Основной текст */
--text-secondary: #7F8C8D    /* Вспомогательный текст */
--space-xs: 4px              /* Расстояния */
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
```

## 🔍 Структура данных (lessons.json)

```json
{
  "course": {
    "title": "Team Lead Academy",
    "totalLessons": 12
  },
  "characters": {
    "alex": { "name": "Алекс", ... }
  },
  "lessons": [
    {
      "id": 1,
      "title": "Урок 1",
      "screens": [
        {
          "id": 1,
          "type": "intro",
          "content": { ... }
        }
      ]
    }
  ]
}
```

## 📱 Адаптивный дизайн

- **Desktop**: Полная версия с боковым меню
- **Планшет** (768px-1024px): Гамбургер меню
- **Мобильный** (<768px): Оптимизированный вид

## 🐛 Отладка

1. Откройте курс в браузере
2. Нажмите кнопку 🐛 в нижнем правом углу
3. Посмотрите логи в debug консоли
4. Все console.log() выводятся в зелёную панель

## 📈 Git коммиты

```
d07fb95 Add performance optimization documentation
7b99767 Optimize course loading performance
2f1ea3b Initial commit: Team Lead Academy course with hamburger navigation
```

## ✨ Последние улучшения

- ✅ Гамбургер меню навигации
- ✅ Debug консоль на странице
- ✅ Loading экран с спиннером
- ✅ Оптимизация производительности
- ✅ Полная SCORM совместимость
- ✅ ES5 синтаксис для старых браузеров

---

**Версия**: 1.0
**Дата обновления**: 2025-11-06
**Статус**: ✅ Готово к развитию
