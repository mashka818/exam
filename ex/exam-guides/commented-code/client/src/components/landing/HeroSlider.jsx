/**
 * =============================================================================
 * ФАЙЛ: client/src/components/landing/HeroSlider.jsx
 * Слайдер лендинга. SLIDE_KEYS + slideText + PNG slide-1… в images.js. Интервал setInterval (Банкетам: 3000, 4 слайда).
 * =============================================================================
 */

/**
 * =============================================================================
 * HeroSlider.jsx — СЛАЙДЕР НА ЛЕНДИНГЕ (модуль 2 / М2)
 * =============================================================================
 * 1) SLIDE_KEYS — ключи из config/images.js (slide1, slide2…)
 * 2) slideText — заголовок и подзаголовок на каждом слайде
 * 3) public/images/slide-1.png … — файлы картинок (имена в images.js → file)
 * 4) setInterval — автопрокрутка (БАНКЕТАМ.НЕТ: 3000 мс, 4 слайда)
 *
 * Кнопки ‹ › и точки внизу — переключение вручную (go, setIndex).
 * БАНКЕТАМ.НЕТ: скопировать <HeroSlider /> в RequestsPage для п.3
 *
 * GUIDE_PAGES.md §3.2 | config/images.js (slide1…slide4)
 * =============================================================================
 */
import { useEffect, useState } from 'react';
import { imageAlt, imageUrl } from '../../config/images.js';

const SLIDE_KEYS = ['slide1', 'slide2', 'slide3']; // БАНКЕТАМ.НЕТ: добавить 'slide4'

const slideText = {
  slide1: { title: 'Общий клининг', subtitle: 'Поддерживаем порядок регулярно' },
  slide2: { title: 'Генеральная уборка', subtitle: 'Глубокая очистка всех поверхностей' },
  slide3: { title: 'Химчистка', subtitle: 'Ковры, мебель, деликатные ткани' },
};

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_KEYS.length);
    }, 5000); // БАНКЕТАМ.НЕТ: 3000
    return () => clearInterval(timer);
  }, []);

  const key = SLIDE_KEYS[index];
  const text = slideText[key];

  const go = (dir) => {
    setIndex((i) => (i + dir + SLIDE_KEYS.length) % SLIDE_KEYS.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-teal-900" aria-label="Слайдер услуг">
      <div className="relative h-52 sm:h-64 lg:h-80">
        {SLIDE_KEYS.map((k, i) => (
          <div
            key={k}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={imageUrl(k)}
              alt={imageAlt(k)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 lg:p-10 max-w-5xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-white drop-shadow animate-fade-up">
            {text.title}
          </h2>
          <p className="text-teal-100 text-sm lg:text-base mt-1">{text.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur"
          aria-label="Предыдущий слайд"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur"
          aria-label="Следующий слайд"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-2">
        {SLIDE_KEYS.map((k, i) => (
          <button
            key={k}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
