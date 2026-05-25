/**
 * =============================================================================
 * ФАЙЛ: client/src/components/landing/LandingLayout.jsx
 * Шапка лендинга /. brandName, ссылки Вход/Регистрация.
 * =============================================================================
 */

/**
 * =============================================================================
 * LandingLayout.jsx — ШАПКА ЛЕНДИНГА (без Layout.jsx)
 * =============================================================================
 * Отдельная шапка для главной / — не путать с Layout на /register, /login…
 * Клик по логотипу → всегда / (даже если пользователь вошёл).
 *
 * Гость: кнопки «Вход» / «Регистрация»
 * user: ссылка в кабинет (/requests или /admin) + «Выйти»
 *
 * ЗАМЕНИТЕ: brandName, cabinetLabel («Мои заявки» → «Личный кабинет»)
 * БАНКЕТАМ.НЕТ: brandName = 'Банкетам.Нет'
 *
 * GUIDE_PAGES.md §5 (лендинг)
 * =============================================================================
 */
import { Link } from 'react-router-dom';
import PageImage from '../PageImage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const brandName = 'Мой Не Сам'; // БАНКЕТАМ.НЕТ: 'Банкетам.Нет'

export default function LandingLayout({ children }) {
  const { user, logout } = useAuth();

  const cabinetPath = user?.role === 'admin' ? '/admin' : '/requests';
  const cabinetLabel = user?.role === 'admin' ? 'Панель админа' : 'Мои заявки';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-lg lg:max-w-5xl px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <PageImage imageKey="logo" className="h-9 lg:h-11 w-auto shrink-0" />
            <span className="font-semibold text-lg text-teal-900 truncate">{brandName}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 shrink-0 text-sm">
              <Link
                to={cabinetPath}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                {cabinetLabel}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex gap-2 shrink-0 text-sm">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
