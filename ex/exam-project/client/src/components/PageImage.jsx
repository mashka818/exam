/**
 * =============================================================================
 * ФАЙЛ: client/src/components/PageImage.jsx
 * Картинки: <PageImage imageKey="logo" />. Ключи в config/images.js
 * =============================================================================
 */

/**
 * =============================================================================
 * PageImage.jsx — КАРТИНКА НА СТРАНИЦЕ (единый способ)
 * =============================================================================
 * КАК МЕНЯТЬ КАРТИНКУ:
 *   1) Файл в client/public/images/ (например banner.png)
 *   2) Запись в client/src/config/images.js: myKey: { file: 'banner.png', alt: '...' }
 *   3) На странице: <PageImage imageKey="myKey" className="w-full h-40 object-cover" />
 *
 * НЕ пишите <img src="/images/..."> напрямую в pages — иначе на экзамене запутаетесь.
 *
 * className — размер: h-9 (логотип), h-40 (баннер), rounded-full (аватар в футере).
 * onError — скрывает битую картинку; при отладке временно закомментируйте.
 *
 * GUIDE_PAGES.md §3 | БАНКЕТАМ.НЕТ: slide-1…4, footer-photo-1…3
 * =============================================================================
 */
import { imageAlt, imageUrl } from '../config/images.js';

export default function PageImage({ imageKey, className = 'w-full h-auto rounded-xl object-cover' }) {
  const src = imageUrl(imageKey);
  const alt = imageAlt(imageKey);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      /* при ошибке загрузки (забыли положить PNG) — скрываем, чтобы не ломать вёрстку */
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
