/**
 * =============================================================================
 * ФАЙЛ: client/src/pages/LoginPage.jsx | URL: /login | п.2
 * login + password → AuthContext.login → admin: /admin, user: /requests
 * Админ: server/db/init.js (adminka или Admin26)
 * =============================================================================
 */

/**
 * =============================================================================
 * АВТОРИЗАЦИЯ (/login) — п.2 задания ДЭ
 * =============================================================================
 * ЗАМЕНИТЕ:
 *   сообщения об ошибке — уже есть «Неверный логин или пароль»
 *   adminka/password — заданы в server/db/init.js (не на этой странице)
 *   картинку — login-banner в public/images/
 * Отличительная черта: тёмная шапка (variant="login")
 * БАНКЕТАМ.НЕТ (п.2): ссылка «Еще не зарегистрированы? Регистрация» (сейчас «Создать аккаунт»).
 * БАНКЕТАМ.НЕТ: подсказка админа Admin26 / Demo20 внизу формы.
 *
 * ПОТОК: login({ login, password }) → JWT в localStorage
 *        user.role === 'admin' → /admin, иначе → /requests
 * Админ создаётся в server/db/init.js (не на этой странице)
 *
 * GUIDE_PAGES.md §2.2 | server/db/init.js (adminka / Admin26)
 * =============================================================================
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import FormField from '../components/FormField.jsx';
import PageImage from '../components/PageImage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginVal, setLoginVal] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginVal.trim() || !password) {
      setError('Введите логин и пароль');
      return;
    }
    try {
      const user = await login({ login: loginVal, password });
      navigate(user.role === 'admin' ? '/admin' : '/requests');
    } catch (err) {
      setError(err.data?.message || 'Неверный логин или пароль');
    }
  };

  return (
    <Layout variant="login">
      <PageImage imageKey="loginBanner" className="w-full h-24 object-cover rounded-xl mb-4" />

      <div className="bg-slate-100 rounded-2xl p-6 shadow animate-slide-in">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Вход в систему</h2>
        <form onSubmit={submit}>
          <FormField label="Логин">
            <input className={inputClass} value={loginVal} onChange={(e) => setLoginVal(e.target.value)} autoComplete="username" />
          </FormField>
          <FormField label="Пароль">
            <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </FormField>
          {error && <p className="field-error mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-slate-800 text-white py-3 font-semibold hover:bg-slate-900 transition">
            Войти
          </button>
        </form>
        {/* БАНКЕТАМ.НЕТ: текст ссылки → «Еще не зарегистрированы? Регистрация» */}
        <p className="text-center text-sm mt-4">
          <Link to="/register" className="text-teal-700 underline">Создать аккаунт</Link>
        </p>
        {/* БАНКЕТАМ.НЕТ: Admin26 / Demo20 */}
        <p className="text-xs text-slate-500 mt-6 text-center">
          Админ: логин <code>adminka</code>, пароль <code>password</code>
        </p>
      </div>
    </Layout>
  );
}
