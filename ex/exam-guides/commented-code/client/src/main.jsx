/**
 * =============================================================================
 * ФАЙЛ: client/src/main.jsx
 * ТОЧКА ВХОДА React. Обычно НЕ МЕНЯЮТ.
 * Цепочка: index.html #root → main.jsx → AuthProvider → App.jsx
 * =============================================================================
 */

/**
 * =============================================================================
 * main.jsx — ТОЧКА ВХОДА REACT (запуск приложения в браузере)
 * =============================================================================
 * Обычно НЕ МЕНЯЮТ при смене темы.
 *
 * Цепочка: index.html (#root) → main.jsx → AuthProvider → App.jsx (маршруты).
 *
 * Если добавили глобальный контекст (тема, язык) — оберните <App /> ещё одним Provider.
 * Подробнее: GUIDE_PAGES.md §6 (новая страница — маршрут всё равно в App.jsx).
 * =============================================================================
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
