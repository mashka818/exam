/**
 * =============================================================================
 * ФАЙЛ: client/src/context/AuthContext.jsx
 * login / register / logout / user. JWT в localStorage (api.js TOKEN_KEY).
 * После входа: user.role → 'user' | 'admin'
 * =============================================================================
 */

/**
 * =============================================================================
 * КОНТЕКСТ АВТОРИЗАЦИИ — user, login, register, logout
 * =============================================================================
 * Хранит JWT в localStorage (api.js setToken).
 * При смене темы логика не меняется; поля user приходят с сервера (fullName, role…).
 *
 * КАК РАБОТАЕТ:
 *   login/register → api.js → setToken в localStorage → setUser
 *   logout → очистка токена → редирект на /login (на странице)
 *   user.role: 'user' | 'admin' — после входа Admin26 попадёт в /admin (см. LoginPage navigate)
 *
 * useAuth() на страницах: const { user, login, register, logout } = useAuth();
 * БАНКЕТАМ.НЕТ: без изменений, если структура users та же.
 *
 * GUIDE_PAGES.md §7 | api.js
 * =============================================================================
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // При загрузке приложения — проверить сохранённый токен
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(({ user: u }) => setUser(u))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { user: u, token } = await api.login(credentials);
    setToken(token);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const { user: u, token } = await api.register(data);
    setToken(token);
    setUser(u);
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth вне AuthProvider');
  return ctx;
}
