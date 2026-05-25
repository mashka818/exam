/**
 * =============================================================================
 * ФАЙЛ: client/src/components/UserNav.jsx
 * Вкладки в шапке заказчика: /requests и /requests/form. Менять подписи ссылок.
 * =============================================================================
 */

/**
 * =============================================================================
 * UserNav.jsx — ВКЛАДКИ В ШАПКЕ (только заказчик, variant="dashboard")
 * =============================================================================
 * Показывается в Layout.jsx когда user.role === 'user' и variant === 'dashboard'.
 * NavLink подсвечивает активный раздел (isActive → bg-white/30).
 *
 * ЗАМЕНИТЕ: текст ссылок и title (подсказка при наведении).
 * Пути /requests и /requests/form — по заданию ДЭ, обычно не меняют.
 *
 * БАНКЕТАМ.НЕТ: «Личный кабинет» → /requests; «Новое бронирование» → /requests/form
 * GUIDE_PAGES.md §2.3
 * =============================================================================
 */
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `text-xs px-2 py-1 rounded-md transition ${
    isActive ? 'bg-white/30 font-semibold' : 'opacity-80 hover:opacity-100'
  }`;

export default function UserNav() {
  return (
    <nav className="flex gap-1 shrink-0" aria-label="Разделы заявок">
      <NavLink to="/requests" className={linkClass} end title="п.3 Создание заявки">
        Мои заявки
      </NavLink>
      <NavLink to="/requests/form" className={linkClass} title="п.4 Формирование заявки">
        Новая заявка
      </NavLink>
    </nav>
  );
}
