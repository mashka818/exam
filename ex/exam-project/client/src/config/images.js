/**
 * =============================================================================
 * ФАЙЛ: client/src/config/images.js
 * КАРТИНКИ: только менять file и alt. Файлы PNG лежат в client/public/images/
 * На экзамене: экспорт Figma → тот же файл (logo.png, slide-1.png…). Пути в коде не пишем — PageImage imageKey
 * =============================================================================
 */

/**
 * =============================================================================
 * КОНФИГУРАЦИЯ ИЗОБРАЖЕНИЙ
 * =============================================================================
 * Все картинки лежат в: client/public/images/
 * В коде подключаются через URL: /images/имя-файла
 *
 * НА ЭКЗАМЕНЕ:
 * 1) Экспорт из Figma → PNG в public/images/ (только PNG, не SVG)
 * 2) Имя файла как ниже (logo.png, slide-1.png…) — замените файл, config не трогайте
 * 3) alt — для доступности; замените текст под новую тему
 * БАНКЕТАМ.НЕТ: slide4; alt про банкеты/залы; logo «Банкетам.Нет»
 *
 * Ключ (logo, slide1…) — НЕ переименовывайте без правки PageImage imageKey на страницах
 * file — имя файла в public/images/
 * imageUrl('logo') / imageAlt('logo') — если нужен прямой доступ без PageImage
 *
 * Слайды: slide-1.png … slide-4.png | Футер: footer-photo-1.png …
 *
 * GUIDE_PAGES.md §3 | PageImage.jsx
 * =============================================================================
 */

/** Базовый путь. Менять не нужно, если папка называется images */
export const IMAGES_BASE = '/images';

/**
 * Карта картинок по страницам.
 * Ключ (logo, homeHero…) — не трогать, менять только file и alt.
 */
export const IMAGES = {
  // Шапка на всех страницах → логотип компании / портала
  logo: {
    file: 'logo.png',
    alt: 'Логотип «Мой Не Сам»',
  },

  homeHero: {
    file: 'home-hero.png',
    alt: 'Клининговые услуги на дому',
  },

  registerBanner: {
    file: 'register-banner.png',
    alt: 'Регистрация нового заказчика',
  },

  loginBanner: {
    file: 'login-banner.png',
    alt: 'Вход в личный кабинет',
  },

  requestsBanner: {
    file: 'requests-banner.png',
    alt: 'История заявок на уборку',
  },

  newRequestBanner: {
    file: 'new-request-banner.png',
    alt: 'Оформление заявки на услугу',
  },

  adminBanner: {
    file: 'admin-banner.png',
    alt: 'Панель администратора',
  },

  emptyRequests: {
    file: 'empty-requests.png',
    alt: 'Заявок пока нет',
  },

  slide1: { file: 'slide-1.png', alt: 'Общий клининг' },
  slide2: { file: 'slide-2.png', alt: 'Генеральная уборка' },
  slide3: { file: 'slide-3.png', alt: 'Химчистка ковров и мебели' },

  aboutCleaning: { file: 'about-cleaning.png', alt: 'Профессиональный клининг' },

  footerPhoto1: { file: 'footer-photo-1.png', alt: 'Сотрудник 1' },
  footerPhoto2: { file: 'footer-photo-2.png', alt: 'Сотрудник 2' },
  footerPhoto3: { file: 'footer-photo-3.png', alt: 'Сотрудник 3' },
};

/** Собрать полный URL для тега <img src="..."> */
export function imageUrl(imageKey) {
  const item = IMAGES[imageKey];
  if (!item) return '';
  return `${IMAGES_BASE}/${item.file}`;
}

/** Текст alt по ключу */
export function imageAlt(imageKey) {
  return IMAGES[imageKey]?.alt ?? '';
}
