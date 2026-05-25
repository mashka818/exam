/**
 * =============================================================================
 * ФАЙЛ: client/src/components/ProtectedRoute.jsx
 * Защита маршрутов. role="user" | "admin". Без входа → /login
 * =============================================================================
 */

/**
 * =============================================================================
 * ЗАЩИТА МАРШРУТОВ — только для авторизованных
 * =============================================================================
 * role="user"  — обычный заказчик (/requests)
 * role="admin" — панель админа (/admin)
 * При другой теме роли те же: user | admin (server/db/schema.sql users.role)
 * БАНКЕТАМ.НЕТ: user → /requests (личный кабинет), admin → /admin
 *
 * loading — пока читается токен из localStorage и вызывается /api/auth/me
 * !user — гость → /login
 * user.role !== role — админ зашёл на /requests → редирект на /admin и наоборот
 *
 * Менять редко. Новый раздел «только для менеджера» — добавить role в БД + сюда.
 * =============================================================================
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Пока AuthContext проверяет токен — не редиректим преждевременно
  if (loading) {
    return <p className="text-center text-slate-500 animate-pulse py-12">Загрузка…</p>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/requests'} replace />;
  }

  return children;
}
