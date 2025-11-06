# 📱 Быстрый справочник мобильной адаптации

## Точка в одном экране

### CSS Breakpoints (медиа-запросы)
```css
/* мобильный (320-480px) */
@media (max-width: var(--breakpoint-mobile-lg)) { }

/* фаблет (481-768px) */
@media (max-width: var(--breakpoint-tablet)) { }

/* планшет (769-1024px) */
@media (max-width: var(--breakpoint-tablet-lg)) { }

/* десктоп (1025px+) */
@media (min-width: var(--breakpoint-desktop)) { }
```

### Размеры шрифтов по экранам
| Элемент | Десктоп | Мобиль |
|---------|---------|--------|
| H1 | 32px | 24px |
| H2 | 28px | 20px |
| H3 | 24px | 18px |
| H4 | 20px | 16px |
| Body | 16px | 14px |
| Small | 14px | 12px |

### Touch Target размеры
```css
/* Минимум для мобильной */
button, a {
  min-width: 44px;
  min-height: 44px;
}
```

### Размеры изображений
```
Мобиль (480px): персонаж 250px, карточка 100% width
Фаблет (768px): персонаж 300px, карточка 90% width
Планшет (1024px): персонаж 400px, карточка 80% width
Десктоп (1200px+): персонаж 400px, карточка 600px max
```

---

## Документация по проекту

### Основные документы

| Файл | Описание | Когда читать |
|------|---------|--------------|
| **MOBILE_ADAPTATION_PLAN.md** | Исходный план 8 фаз (553 строк) | Для понимания полного плана |
| **IMAGE_OPTIMIZATION_GUIDE.md** | Оптимизация изображений (250+ строк) | Перед работой с картинками |
| **PERFORMANCE_OPTIMIZATION_GUIDE.md** | Производительность Фазы 5-8 (500+ строк) | Для оптимизации и тестирования |
| **MOBILE_IMPLEMENTATION_SUMMARY.md** | Итоговый отчет (310 строк) | Для быстрого обзора что сделано |
| **TESTING_GUIDE.md** | Полное тестирование (400+ строк) | Перед запуском в продакшн |
| **MOBILE_QUICK_REFERENCE.md** | Этот файл | Для быстрых ссылок |

---

## Частые задачи и решения

### Добавить мобильный стиль для элемента

```css
@media (max-width: var(--breakpoint-mobile-lg)) {
  .my-element {
    font-size: 14px;
    padding: var(--space-md);
    width: 100%;
  }
}
```

### Сделать кнопку полной ширины на мобильной

```css
@media (max-width: var(--breakpoint-mobile-lg)) {
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
```

### Скрыть элемент на мобильной версии

```css
.hide-on-mobile {
  display: none;
}

@media (min-width: var(--breakpoint-tablet)) {
  .hide-on-mobile {
    display: block;
  }
}
```

### Адаптивное изображение

```html
<picture>
  <source media="(max-width: 480px)" srcset="image-small.webp">
  <source media="(max-width: 768px)" srcset="image-medium.webp">
  <img src="image-large.jpg" alt="Description" loading="lazy">
</picture>
```

### Обработать ориентацию экрана

```css
/* Только portrait */
@media (max-width: 768px) and (orientation: portrait) {
  body { /* стили */ }
}

/* Только landscape */
@media (max-width: 768px) and (orientation: landscape) {
  body { /* стили */ }
}
```

---

## Тестирование

### Быстрая проверка на DevTools
1. Нажмите `Cmd+Shift+M` (macOS) или `Ctrl+Shift+M` (Windows/Linux)
2. Выберите размер: 320px → 375px → 480px → 768px → 1024px
3. Проверьте portrait и landscape

### Lighthouse audit
1. Нажмите F12
2. Вкладка "Lighthouse"
3. Нажмите "Generate report"
4. Целевое значение: > 90

### На реальном телефоне
```bash
# Узнать IP компьютера
ifconfig | grep "inet "

# Запустить сервер
python3 -m http.server 8000 --bind 0.0.0.0

# На телефоне перейти
http://[YOUR_IP]:8000
```

---

## CSS Переменные (важные)

```css
:root {
  /* Breakpoints */
  --breakpoint-mobile: 320px;
  --breakpoint-mobile-lg: 480px;
  --breakpoint-tablet: 768px;
  --breakpoint-tablet-lg: 1024px;
  --breakpoint-desktop: 1280px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;      /* обычный padding на мобиль */
  --space-lg: 24px;      /* заголовки spacing */

  /* Font sizes */
  --h1-size: 32px;       /* десктоп, 24px на мобиль */
  --h2-size: 28px;       /* десктоп, 20px на мобиль */

  /* Colors */
  --brand-primary: #163F6F;
  --brand-secondary: #7C0004;
  --brand-accent: #7B68EE;

  /* Padding */
  --container-padding-desktop: 40px;
  --container-padding-mobile: 16px;
}
```

---

## Файлы CSS которые изменены

| Файл | Что добавлено | Строк |
|------|---------------|-------|
| `css/layouts.css` | Mobile padding и min-height | +7 |
| `css/components.css` | Мобильные типография, кнопки, формы, экраны | +170 |
| `css/variables.css` | Уже содержит все breakpoints | - |

---

## JavaScript важно знать

### Navigation между экранами
```javascript
// Переключиться на экран 0
Navigation.showScreen(0, false);  // false = без анимации

// Следующий экран
Navigation.nextScreen();

// Предыдущий экран
Navigation.prevScreen();
```

### Проверить загрузку экранов
```javascript
console.log('Current screens:', Navigation.screens.length);
console.log('Current screen index:', Navigation.currentScreenIndex);
```

---

## Метрики для отслеживания

### Core Web Vitals
```
LCP (Largest Contentful Paint):    < 2.5 сек
FID (First Input Delay):           < 100 мс
CLS (Cumulative Layout Shift):     < 0.1
```

### Дополнительные
```
FCP (First Contentful Paint):      < 1.8 сек
Page Load Time на 3G:              < 5 сек
Lighthouse Score:                  > 90
```

---

## Инструменты

| Инструмент | Ссылка | Для чего |
|-----------|--------|---------|
| Lighthouse | DevTools (F12) | Performance audit |
| PageSpeed Insights | https://pagespeed.web.dev/ | Быстрый анализ |
| WebPageTest | https://www.webpagetest.org/ | Детальный анализ |
| Chrome DevTools | F12 | Все инструменты |
| ImageMin | `npm install imagemin` | Оптимизация картинок |

---

## Команды (копипаста)

### Запустить локальный сервер
```bash
cd /Users/irinaurazanova/Desktop/team-lead-academy-scorm
python3 -m http.server 8000
# Откройте http://localhost:8000
```

### Запустить на всех IP
```bash
python3 -m http.server 8000 --bind 0.0.0.0
# На других устройствах: http://YOUR_IP:8000
```

### Git команды
```bash
# Посмотреть статус
git status

# Добавить изменения
git add .

# Создать commit
git commit -m "описание"

# Отправить на GitHub
git push origin main
```

---

## Чек-лист перед запуском

- [ ] Все экраны тестированы на 480px, 768px, 1024px
- [ ] Lighthouse > 90
- [ ] Нет горизонтальной прокрутки
- [ ] Все кнопки 44x44px минимум
- [ ] Изображения оптимизированы
- [ ] Нет ошибок в консоли (F12 → Console)
- [ ] Доступность проверена (Lighthouse → Accessibility)
- [ ] Тестирование на реальном телефоне

---

## FAQ (часто задаваемые вопросы)

**Q: Мой экран не выглядит хорошо на 320px**
A: Добавьте в конец `css/components.css`:
```css
@media (max-width: 320px) {
  .my-element { font-size: 12px; }
}
```

**Q: Кнопка на мобильной слишком маленькая**
A: Проверьте `min-width: 44px;` и `min-height: 44px;`

**Q: Изображение обрезано на мобильной**
A: Добавьте `max-width: 100%; height: auto;`

**Q: Page Load Time > 5 сек**
A: Смотрите PERFORMANCE_OPTIMIZATION_GUIDE.md фаза 5

**Q: Как тестировать на iPad?**
A: Chrome DevTools → 768px или 1024px размер

**Q: Нужно ли использовать WebP?**
A: Рекомендуется, смотрите IMAGE_OPTIMIZATION_GUIDE.md

---

## Полезные ссылки

- 📖 [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- 📖 [Google: Mobile Friendly Guide](https://developers.google.com/search/mobile-sites/mobile-friendly)
- 📖 [Web.dev: Core Web Vitals](https://web.dev/vitals/)
- 🎨 [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- 📱 [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

## Контрольная информация

**Проект:** Team Lead Academy SCORM
**Тип:** Интерактивный курс по лидерству
**Целевые платформы:** Мобильные (320px+), Планшеты, Десктоп
**Язык:** Русский
**Framework:** Vanilla JS (ES5) + CSS Variables
**Статус:** ✅ Полная мобильная адаптация

**Дата обновления:** 6 ноября 2025

---

**Нужна помощь?** Смотрите полные гайды:
- MOBILE_ADAPTATION_PLAN.md
- IMAGE_OPTIMIZATION_GUIDE.md
- PERFORMANCE_OPTIMIZATION_GUIDE.md
- TESTING_GUIDE.md
