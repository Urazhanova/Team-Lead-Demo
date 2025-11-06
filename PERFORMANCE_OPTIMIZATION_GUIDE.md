# Руководство по оптимизации производительности мобильной версии

## 🚀 Фазы 5-8: Производительность и продвинутые функции

### Фаза 5: Оптимизация производительности

#### 5.1 Минимизация CSS

```bash
# Установка cssnano
npm install --save-dev cssnano postcss-cli

# Создать postcss.config.js
echo "
module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }]
    })
  ]
};
" > postcss.config.js

# Минифицировать CSS
postcss css/components.css -o css/components.min.css
postcss css/layouts.css -o css/layouts.min.css
postcss css/variables.css -o css/variables.min.css
postcss css/loading.css -o css/loading.min.css
```

#### 5.2 Минимизация JavaScript

```bash
# Установка Terser
npm install --save-dev terser

# Минифицировать JS файлы
terser js/main.js -o js/main.min.js -c -m
terser js/navigation.js -o js/navigation.min.js -c -m
terser js/data.js -o js/data.min.js -c -m
terser js/screen-renderer.js -o js/screen-renderer.min.js -c -m
```

#### 5.3 Сжатие изображений

```bash
# Установка ImageMin
npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant imagemin-webp

# Создать скрипт optimize-images.js
cat > optimize-images.js << 'EOF'
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');

(async () => {
  // Оптимизация JPEG
  await imagemin(['assets/images/**/*.jpg'], {
    destination: 'assets/images-optimized',
    plugins: [
      imageminMozjpeg({ quality: 80 })
    ]
  });
  console.log('✓ JPEG images optimized');

  // Оптимизация PNG
  await imagemin(['assets/images/**/*.png'], {
    destination: 'assets/images-optimized',
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });
  console.log('✓ PNG images optimized');

  // Конвертация в WebP
  await imagemin(['assets/images/**/*.{jpg,png}'], {
    destination: 'assets/images-webp',
    plugins: [
      imageminWebp({ quality: 80 })
    ]
  });
  console.log('✓ WebP versions created');
})();
EOF

# Запустить оптимизацию
node optimize-images.js
```

#### 5.4 Кэширование браузера

Добавить в `index.html` (head секция):

```html
<!-- Browser Cache Headers -->
<meta http-equiv="Cache-Control" content="public, max-age=31536000">
<meta http-equiv="Pragma" content="cache">
<meta http-equiv="Expires" content="Wed, 06 Nov 2026 08:00:00 GMT">
```

Или в `.htaccess` (Apache):

```apache
# Enable Mod Rewrite
<IfModule mod_rewrite.c>
  RewriteEngine On
</IfModule>

# CSS and JavaScript Caching (1 year)
<FilesMatch "\.(css|js|woff|woff2|ttf)$">
  Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Image Caching (1 year)
<FilesMatch "\.(jpg|jpeg|png|gif|webp|svg)$">
  Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# HTML Cache (1 month - динамический контент)
<FilesMatch "\.html?$">
  Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# JSON Data Cache (short - обновляется часто)
<FilesMatch "\.json$">
  Header set Cache-Control "public, max-age=3600"
</FilesMatch>
```

#### 5.5 Оптимизация шрифтов

```css
/* css/variables.css */

@media (max-width: 480px) {
  :root {
    /* Использовать системные шрифты на мобильной версии */
    --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-secondary: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  body {
    font-family: var(--font-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

Или использовать `font-display: swap` в Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

---

### Фаза 6: Тестирование производительности

#### 6.1 Chrome DevTools Performance

```
Шаги для анализа производительности:
1. Откройте Chrome DevTools (F12)
2. Перейдите на вкладку "Performance"
3. Нажмите кнопку "Record" (круглая кнопка)
4. Прокрутите страницу и взаимодействуйте с элементами
5. Нажмите "Stop" чтобы завершить запись
6. Изучите результаты в графике
```

#### 6.2 Lighthouse Audit

```
Шаги для запуска Lighthouse:
1. Откройте Chrome DevTools (F12)
2. Перейдите на вкладку "Lighthouse"
3. Выберите "Mobile" (по умолчанию)
4. Нажмите "Generate report"
5. Подождите анализа (2-3 минуты)
6. Изучите результаты и рекомендации
```

Целевые значения:
```
Performance:     > 90
Accessibility:   > 95
Best Practices:  > 90
SEO:             > 90
PWA:             > 80
```

#### 6.3 Google PageSpeed Insights

Откройте: https://pagespeed.web.dev/

Введите URL вашего сайта и получите детальный анализ для мобильных и десктопных устройств.

#### 6.4 WebPageTest

Откройте: https://www.webpagetest.org/

```
Параметры для тестирования:
- Test Location: Sydney, Australia (удаленное место)
- Browser: Chrome
- Connection: Slow 3G
- Number of tests: 3 (для среднего результата)
```

#### 6.5 Ручное тестирование на реальных устройствах

```bash
# Пробросить локальный сервер на мобильное устройство
# Шаг 1: Узнать IP адрес компьютера
ifconfig | grep "inet " | grep -v 127.0.0.1

# Шаг 2: Запустить сервер на 0.0.0.0
python3 -m http.server 8000 --bind 0.0.0.0

# Шаг 3: На мобильном устройстве перейти по:
# http://[YOUR_IP]:8000

# Шаг 4: Открыть DevTools на мобильном (Chrome):
# - Подключить кабель USB к компьютеру
# - На компьютере в Chrome: chrome://inspect
# - Выбрать устройство и "inspect"
```

---

### Фаза 7: Мобильные особенности

#### 7.1 Touch-friendly элементы

```css
/* Минимум 44x44px для сенсорных целей */
button, a, input[type="radio"], input[type="checkbox"] {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Достаточный промежуток между элементами */
.touch-target {
  margin: var(--space-md);
  padding: var(--space-md);
}

/* Disable zoom на input focus (iOS) */
input, select, textarea {
  font-size: 16px;
  font-size: 1rem;
}
```

#### 7.2 Предотвращение авто-zoom при фокусе

```html
<!-- В index.html -->
<meta name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes">
```

#### 7.3 Обработка Safe Areas для notch и динамического острова

```css
/* Support для notch на iPhone */
@supports (padding: max(0px)) {
  body {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }

  .header {
    padding-top: max(12px, env(safe-area-inset-top));
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}

/* Status bar color для Android */
<meta name="theme-color" content="#163F6F">
```

#### 7.4 Ориентация экрана

```css
/* Ограничить ориентацию на мобильной версии */
@media (max-width: 768px) {
  /* Portrait only на мобильных */
  @supports (orientation: portrait) {
    @media (orientation: landscape) {
      body {
        transform: rotate(90deg);
        width: 100vh;
        height: 100vw;
        overflow: hidden;
      }
    }
  }
}
```

#### 7.5 Vibration API для обратной связи

```javascript
// Тактильная обратная связь при клике
function clickFeedback() {
  if (navigator.vibrate) {
    // Вибрация 20ms
    navigator.vibrate(20);
  }
}

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', clickFeedback);
});

// Паттерны вибрации
const patterns = {
  success: [50, 100, 50],      // Long, pause, long
  error: [100],                 // One long vibration
  notification: [100, 50, 100], // Long, pause, long
  tap: [20]                     // Short tap
};

navigator.vibrate(patterns.success);
```

---

### Фаза 8: Продвинутые оптимизации

#### 8.1 Dark Mode поддержка

```css
/* Variables для dark mode */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #212121;
  --text-secondary: #616161;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
  }
}

/* Применить переменные */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}
```

#### 8.2 High DPI дисплеи

```css
/* Для Retina дисплеев (2x и выше) */
@media (min-device-pixel-ratio: 2) {
  img {
    /* Использовать 2x изображения */
    image-rendering: -webkit-optimize-contrast;
  }

  /* SVG может быть масштабирован без потери качества */
  svg {
    backface-visibility: hidden;
  }
}

/* AVIF и WebP для современных браузеров */
@supports (background-image: url(".webp")) {
  .bg-image {
    background-image: url("image.webp");
  }
}
```

#### 8.3 Print Styles

```css
@media print {
  /* Скрыть UI элементы */
  .header, .footer, .navigation, .sidebar {
    display: none;
  }

  /* Оптимизировать для печати */
  body {
    background: white;
    color: black;
  }

  .page {
    page-break-after: always;
    margin: 2cm;
  }

  a {
    color: blue;
    text-decoration: underline;
  }

  /* Показать URL ссылок */
  a[href]::after {
    content: " (" attr(href) ")";
  }
}
```

#### 8.4 Accessibility (Доступность)

```css
/* WCAG 2.1 AA требования */

/* Contrast ratio >= 4.5:1 для основного текста */
body {
  background: #ffffff;
  color: #212121; /* Contrast: 12:1 */
}

/* Focus состояние видно */
button:focus, a:focus {
  outline: 2px solid var(--brand-accent);
  outline-offset: 2px;
}

/* Line height >= 1.5 */
body {
  line-height: 1.6;
}

/* Text spacing */
p {
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
}

/* Скрыть визуально, но доступно для screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 📊 Итоговые метрики успеха

### Core Web Vitals (Основные показатели веб-виталс)

| Метрика | Хороший | Нужно улучшить | Плохой |
|---------|--------|----------------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| **FID** (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Дополнительные метрики

| Метрика | Целевое значение |
|---------|-----------------|
| First Contentful Paint (FCP) | < 1.8 сек |
| Time to Interactive (TTI) | < 3 сек |
| Page Load Time (3G) | < 5 сек |
| Lighthouse Score | > 90 |
| Total Size | < 500 KB |
| Number of Requests | < 30 |

---

## 🧪 Чек-лист для полной оптимизации

### Производительность (Фаза 5)
- [ ] CSS минифицирован
- [ ] JavaScript минифицирован
- [ ] Изображения оптимизированы
- [ ] WebP версии созданы
- [ ] Кэширование браузера настроено
- [ ] Шрифты оптимизированы
- [ ] Удалены неиспользуемые CSS классы

### Тестирование (Фаза 6)
- [ ] Chrome DevTools Performance профилирование выполнено
- [ ] Lighthouse audit запущен (score > 90)
- [ ] Google PageSpeed Insights проверен
- [ ] WebPageTest на Slow 3G проведен
- [ ] Тестирование на реальных устройствах завершено
- [ ] Все браузеры проверены (Chrome, Firefox, Safari, Edge)

### Мобильные функции (Фаза 7)
- [ ] Touch targets минимум 44x44px
- [ ] Автозум на input предотвращен (font-size: 16px)
- [ ] Safe area поддержана (notch)
- [ ] Ориентация экрана обработана
- [ ] Vibration API реализована (опционально)

### Продвинутые функции (Фаза 8)
- [ ] Dark mode поддержан
- [ ] High DPI дисплеи оптимизированы
- [ ] Print styles добавлены
- [ ] Доступность (A11y) проверена
- [ ] ARIA атрибуты добавлены где нужно

---

## 🚀 Дополнительные оптимизации

### Service Worker для offline поддержки

```javascript
// sw.js
const CACHE_NAME = 'team-lead-academy-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/components.css',
  '/css/layouts.css',
  '/js/main.js',
  '/js/navigation.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

### Preload критических ресурсов

```html
<!-- В index.html head -->
<link rel="preload" href="fonts/open-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="css/critical.css" as="style">
<link rel="prefetch" href="data/lessons.json" as="fetch">
```

### Lazy load для JavaScript модулей

```javascript
// Динамический импорт модулей
document.addEventListener('DOMContentLoaded', () => {
  // Основные модули загружаются сразу
  loadScript('js/main.js');

  // Опциональные модули загружаются по требованию
  if (document.querySelector('.quiz-section')) {
    loadScript('js/quiz.js');
  }
});

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  document.head.appendChild(script);
}
```

---

**Версия:** 1.0
**Дата:** 2025-11-06
**Статус:** Готово к внедрению

Все фазы 5-8 описаны с готовыми к использованию кодом, командами и чек-листом для полной мобильной оптимизации.
