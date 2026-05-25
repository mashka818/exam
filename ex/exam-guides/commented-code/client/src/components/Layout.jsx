/**
 * =============================================================================
 * ФАЙЛ: client/src/components/Layout.jsx
 * Шапка всех страниц кроме лендинга. Менять: brandName, brandTagline, headerStyles, logo в images.js
 * variant со страницы: register | login | dashboard | admin
 * =============================================================================
 */

/**
 * =============================================================================
 * LAYOUT — общая обёртка всех страниц (шапка + контент)
 * =============================================================================
 * ЗАМЕНИТЕ при другой теме:
 *   brandName    — название портала («Мой Не Сам» → «Автосервис», «Курсы»…)
 *   brandTagline — короткий слоган под логотипом
 *   headerStyles — цвета шапки по разделам (каждый раздел — своя «черта» по заданию)
 *   logo         — картинка в config/images.js → file: 'logo.png'
 *
 * АДАПТИВ (мобильный / ПК):
 *   Сейчас: max-w-lg — узкая колонка (~390–512px), как макет 390×844.
 *   Для ПК добавьте lg:max-w-5xl lg:px-8 к header и main (см. RESPONSIVE.md).
 * БАНКЕТАМ.НЕТ: brandName = 'Банкетам.Нет'; brandTagline = 'Бронирование банкетных залов'.
 *
 * variant со страницы: register | login | dashboard | admin | default
 *   → разный цвет шапки (отличительные черты по заданию)
 * UserNav — только user + variant dashboard (п.3/п.4 в шапке)
 * Link to="/" на логотипе — после входа возврат на лендинг
 *
 * GUIDE_PAGES.md §2 | RESPONSIVE.md (max-w-lg / lg:max-w-5xl)
 * =============================================================================
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageImage from './PageImage.jsx';
import UserNav from './UserNav.jsx';

// --- Тексты бренда (менять на экзамене в первую очередь) ---
const brandName = 'Мой Не Сам'; // БАНКЕТАМ.НЕТ: 'Банкетам.Нет'
const brandTagline = 'Клининг без хлопот'; // БАНКЕТАМ.НЕТ: 'Бронирование банкетных залов'

// --- Стили шапки: variant передаётся со страницы (register, login, dashboard, admin) ---
const headerStyles = {
  default: 'bg-white border-b border-slate-200 text-slate-800',
  register: 'bg-teal-700 text-white',
  login: 'bg-slate-800 text-white',
  dashboard: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white',
  admin: 'bg-violet-900 text-white',
};

export default function Layout({ children, variant = 'default' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* === ШАПКА: логотип-картинка + название === */}
      <header className={`${headerStyles[variant]} shadow-sm animate-fade-up`}>
        <div className="mx-auto w-full max-w-lg lg:max-w-5xl px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            {/* Картинка: client/public/images/ + ключ logo в config/images.js */}
            <PageImage imageKey="logo" className="h-9 lg:h-11 w-auto shrink-0" />
            <span className="font-semibold text-lg tracking-tight truncate">{brandName}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              {user.role === 'user' && variant === 'dashboard' && <UserNav />}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-sm opacity-90 hover:opacity-100"
              >
                Выйти
              </button>
            </div>
          ) : (
            <span className="text-xs opacity-80 shrink-0 hidden sm:inline">{brandTagline}</span>
          )}
        </div>
      </header>

      {/* max-w-lg — мобильный макет; lg:max-w-5xl — шире на ПК (см. RESPONSIVE.md) */}
      <main className="flex-1 mx-auto w-full max-w-lg lg:max-w-5xl px-4 lg:px-8 py-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
