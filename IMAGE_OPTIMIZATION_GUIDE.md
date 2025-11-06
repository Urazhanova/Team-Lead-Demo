# Руководство по оптимизации изображений для мобильной версии

## 📸 Фаза 4: Оптимизация изображений

### 1. Размеры изображений для разных экранов

| Экран | Размер ширины | Рекомендуемое качество | Формат |
|-------|--------------|----------------------|--------|
| **Мобильный** | 100% (макс 480px) | 70-80% | WebP / JPEG |
| **Фаблет** | 90% (макс 680px) | 75-85% | WebP / JPEG |
| **Планшет** | 80% (макс 800px) | 80-90% | WebP / JPEG |
| **Десктоп** | 50% (макс 1200px) | 90-100% | WebP / PNG |

### 2. Реактивные изображения с использованием `<picture>`

#### Пример для изображений персонажей:

```html
<!-- Character Image - Responsive -->
<picture>
  <source media="(max-width: 480px)" srcset="images/character-small.webp, images/character-small@2x.webp 2x">
  <source media="(max-width: 768px)" srcset="images/character-medium.webp, images/character-medium@2x.webp 2x">
  <source media="(min-width: 769px)" srcset="images/character-large.webp, images/character-large@2x.webp 2x">
  <img src="images/character-large.jpg" alt="Персонаж" class="character-image" loading="lazy">
</picture>
```

#### Пример для карточек:

```html
<!-- Card Image - Responsive -->
<picture>
  <source media="(max-width: 480px)" srcset="images/card-small.webp">
  <source media="(max-width: 768px)" srcset="images/card-medium.webp">
  <img src="images/card-large.jpg" alt="Описание карточки" class="card-image" loading="lazy">
</picture>
```

#### Пример для полноэкранных изображений:

```html
<!-- Hero Image - Responsive -->
<picture>
  <source media="(max-width: 480px)" srcset="images/hero-mobile.webp, images/hero-mobile@2x.webp 2x">
  <source media="(max-width: 1024px)" srcset="images/hero-tablet.webp, images/hero-tablet@2x.webp 2x">
  <img src="images/hero-desktop.jpg" alt="Главное изображение" class="hero-image" loading="lazy">
</picture>
```

### 3. Ленивая загрузка изображений

Все изображения уже содержат атрибут `loading="lazy"`, что обеспечивает:
- Отложенную загрузку изображений вне видимой области
- Ускорение первого рендеринга страницы
- Экономию трафика для пользователей

```html
<!-- Ленивая загрузка -->
<img src="image.jpg" alt="Description" loading="lazy" class="img-responsive">
```

### 4. CSS для изображений (мобильная оптимизация)

```css
/* Основные стили */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Адаптивные изображения персонажей */
.character-image {
  width: 100%;
  max-width: 250px;  /* мобильная версия */
  height: auto;
  margin: 0 auto;
}

/* Карточки */
.card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: var(--radius-md);
}

/* Скрыть большие изображения на мобильной */
.image-large-only {
  display: none;
}

@media (min-width: 769px) {
  .image-large-only {
    display: block;
  }
}
```

### 5. Инструменты и команды для оптимизации

#### 5.1 Установка инструментов

```bash
# ImageMin для сжатия изображений
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant imagemin-webp

# Или локально
npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant imagemin-webp
```

#### 5.2 Сжатие PNG и JPEG

```bash
# Сжатие в текущей директории и подпапках
imagemin assets/images/**/*.{jpg,png} --out-dir=assets/images-optimized

# С опцией качества (mozjpeg)
imagemin assets/images/**/*.jpg --plugin=mozjpeg --out-dir=assets/images-optimized
```

#### 5.3 Конвертация в WebP

```bash
# Конвертировать в WebP формат
imagemin assets/images/**/*.{jpg,png} --plugin=webp --out-dir=assets/images-webp

# С сохранением расширения
for file in assets/images/*.{jpg,png}; do
  convert "$file" -quality 80 "${file%.*}.webp"
done
```

### 6. Размеры по типам экранов

#### Мобильные (480px и ниже):
```
Персонаж: макс 250px × 300px
Карточка: макс 100% × auto
Иконка: 40-48px
Логотип: 24px × 24px
```

#### Фаблеты (481px - 768px):
```
Персонаж: макс 300px × 375px
Карточка: макс 90% × auto
Иконка: 48px × 48px
Логотип: 28px × 28px
```

#### Планшеты и десктоп (769px+):
```
Персонаж: макс 400px × 500px
Карточка: макс 300px × auto
Иконка: 48-56px
Логотип: 32px × 32px
```

### 7. Практические примеры в коде

#### Пример 1: Адаптивная карточка персонажа

```html
<div class="character-card">
  <picture>
    <source media="(max-width: 480px)" srcset="images/char1-small.webp">
    <source media="(max-width: 768px)" srcset="images/char1-medium.webp">
    <img src="images/char1-large.jpg"
         alt="Имя персонажа"
         class="character-image"
         loading="lazy">
  </picture>
  <h3 class="character-card-title">Имя персонажа</h3>
  <p class="character-card-description">Краткое описание</p>
</div>
```

#### Пример 2: Адаптивное изображение в карточке контента

```html
<div class="card-content">
  <div class="content-left">
    <h2>Заголовок</h2>
    <p>Описание контента...</p>
  </div>
  <div class="content-right">
    <picture>
      <source media="(max-width: 480px)"
              srcset="images/hero-mobile.webp, images/hero-mobile@2x.webp 2x">
      <source media="(max-width: 768px)"
              srcset="images/hero-tablet.webp, images/hero-tablet@2x.webp 2x">
      <img src="images/hero-desktop.jpg"
           alt="Описание изображения"
           class="content-image"
           loading="lazy">
    </picture>
  </div>
</div>
```

### 8. Чек-лист для изображений

- [ ] Все изображения содержат атрибут `loading="lazy"`
- [ ] Персонажи: созданы версии для 250px, 300px, 400px
- [ ] Карточки: созданы версии для мобильных и десктопа
- [ ] Все изображения оптимизированы (сжаты)
- [ ] Созданы WebP версии для современных браузеров
- [ ] Для Retina экранов созданы @2x версии
- [ ] Все изображения имеют alt-текст
- [ ] Размер каждого изображения < 100KB

### 9. Метрики производительности

После оптимизации проверить:

```
Метрика                    | До оптимизации | После | Цель
---------------------------|----------------|-------|------
First Contentful Paint (FCP)| < 1.8s        | < 1.5s
Largest Contentful Paint    | < 2.5s        | < 2s
Cumulative Layout Shift     | < 0.1         | < 0.05
Total Image Size (KB)       | TBD           | TBD   | < 500KB
```

### 10. Кэширование браузера

Добавить в `.htaccess` (если Apache):

```apache
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

Или в `index.html`:

```html
<meta http-equiv="Cache-Control" content="public, max-age=31536000">
```

---

## Рекомендации для будущих обновлений

1. **Использовать CDN** для распределения изображений
2. **Добавить srcset для High DPI**: `srcset="image.jpg, image@2x.jpg 2x"`
3. **AVIF формат**: Новый формат с лучшим сжатием (поддержка растет)
4. **Оптимизировать SVG**: Если используются векторные изображения
5. **Service Worker для кэширования**: Для offline поддержки

---

**Версия:** 1.0
**Дата:** 2025-11-06
**Статус:** Готово к внедрению
