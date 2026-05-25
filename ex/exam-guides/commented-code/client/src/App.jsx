/**
 * =============================================================================
 * ФАЙЛ: client/src/App.jsx
 * МАРШРУТЫ (react-router). Пункты ДЭ = пути ниже.
 *   /           → pages/LandingPage.jsx
 *   /register   → RegisterPage.jsx (п.1)
 *   /login      → LoginPage.jsx (п.2)
 *   /requests   → RequestsPage.jsx (п.3)
 *   /requests/form → RequestFormPage.jsx (п.4)
 *   /admin      → AdminPage.jsx (п.5)
 * Новая страница: import + <Route path="..." element={...} />
 * =============================================================================
 */

/**
 * =============================================================================
 * App.jsx — МАРШРУТЫ REACT (react-router-dom)
 * =============================================================================
 * Каждый пункт задания ДЭ = отдельный path + страница в pages/
 *
 *   п.1  /register         → RegisterPage.jsx
 *   п.2  /login            → LoginPage.jsx
 *   п.3  /requests         → RequestsPage.jsx (история + кнопка на форму)
 *   п.4  /requests/form    → RequestFormPage.jsx (форма заявки)
 *   п.5  /admin            → AdminPage.jsx (только role=admin)
 *   /    LandingPage.jsx   — лендинг для всех (гость и после входа по логотипу)
 *
 * ProtectedRoute role="user"|"admin" — без токена редирект на /login
 * /requests/new → редирект на /requests/form (старый путь, можно не трогать)
 * path="*" → на главную /
 *
 * НОВАЯ СТРАНИЦА: import + <Route path="/about" element={...} /> — см. GUIDE_PAGES.md §6
 * БАНКЕТАМ.НЕТ: пути те же; тексты и логика — в pages/, не здесь
 * =============================================================================
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RequestsPage from './pages/RequestsPage.jsx';
import RequestFormPage from './pages/RequestFormPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
export default function App() {
  return (
    <Routes>
      {/* Лендинг для всех; по клику «Мой Не Сам» — сюда же */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* п.3 — страница создания заявки */}
      <Route
        path="/requests"
        element={
          <ProtectedRoute role="user">
            <RequestsPage />
          </ProtectedRoute>
        }
      />

      {/* п.4 — страница формирования заявки */}
      <Route
        path="/requests/form"
        element={
          <ProtectedRoute role="user">
            <RequestFormPage />
          </ProtectedRoute>
        }
      />

      {/* старый путь — редирект на п.4 */}
      <Route path="/requests/new" element={<Navigate to="/requests/form" replace />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
