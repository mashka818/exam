/**
 * =============================================================================
 * ФАЙЛ: client/src/components/landing/SiteFooter.jsx
 * Подвал лендинга. footerPhoto1-3 в images.js. Тексты компании.
 * =============================================================================
 */

/**
 * =============================================================================
 * SiteFooter.jsx — ПОДВАЛ ЛЕНДИНГА
 * =============================================================================
 * Три круглых фото: imageKey footerPhoto1, footerPhoto2, footerPhoto3
 *   → PNG в client/public/images/ → записи в config/images.js
 *
 * footerLinks — якоря (сейчас все на /; можно сделать id секций на LandingPage)
 * ЗАМЕНИТЕ: название компании, описание, copyright год
 *
 * БАНКЕТАМ.НЕТ: «Банкетам.Нет», текст про банкетные залы
 * GUIDE_PAGES.md §5.3
 * =============================================================================
 */
import { Link } from 'react-router-dom';
import PageImage from '../PageImage.jsx';

const footerLinks = [
  { label: 'О компании', to: '/' },
  { label: 'Услуги', to: '/' },
  { label: 'Контакты', to: '/' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="mx-auto max-w-lg lg:max-w-5xl px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div>
            <p className="text-white font-semibold text-lg mb-2">Мой Не Сам</p>
            <p className="text-sm leading-relaxed max-w-sm">
              Портал заявок на клининговые услуги. Профессиональная уборка жилых и
              производственных помещений — вы отдыхаете, мы наводим порядок.
            </p>
          </div>

          {/* Фото в футере — замените PNG в public/images/footer-photo-*.png */}
          <div className="flex gap-4 justify-center lg:justify-end">
            <PageImage
              imageKey="footerPhoto1"
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-teal-600"
            />
            <PageImage
              imageKey="footerPhoto2"
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-teal-600"
            />
            <PageImage
              imageKey="footerPhoto3"
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-teal-600"
            />
          </div>
        </div>

        <nav className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8 text-sm">
          {footerLinks.map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-white transition">
              {l.label}
            </Link>
          ))}
          <Link to="/register" className="hover:text-teal-400 transition">
            Регистрация
          </Link>
          <Link to="/login" className="hover:text-teal-400 transition">
            Вход
          </Link>
        </nav>

        <p className="text-center lg:text-left text-xs text-slate-500 mt-8 border-t border-slate-700 pt-6">
          © {new Date().getFullYear()} Мой Не Сам · Шаблон для ДЭ
        </p>
      </div>
    </footer>
  );
}
