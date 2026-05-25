/**
 * =============================================================================
 * ФАЙЛ: client/src/pages/RegisterPage.jsx | URL: /register | п.1
 * Поля: login, password, fullName, phone, email → POST /api/auth/register
 * Менять: label, banner imageKey registerBanner, validation.js
 * =============================================================================
 */

/**
 * =============================================================================
 * РЕГИСТРАЦИЯ (/register) — п.1 задания ДЭ
 * =============================================================================
 * ЗАМЕНИТЕ:
 *   label полей — если в теме другие данные пользователя (не ФИО, а «Название фирмы»)
 *   валидацию — utils/validation.js (сервер + клиент)
 *   API-тело — те же поля уходят в POST /api/auth/register
 *   картинку — register-banner в public/images/
 * Отличительная черта: бирюзовая шапка (variant="register")
 * БАНКЕТАМ.НЕТ (п.1): логин латиница+цифры ≥6, пароль ≥8; ссылка «Уже есть аккаунт? Вход».
 * БАНКЕТАМ.НЕТ: brand в Layout → «Банкетам.Нет».
 *
 * ПОТОК: form state → validateRegistration → register() из AuthContext
 *        → POST /api/auth/register → navigate('/requests')
 * Ошибки: errors.xxx под полями; serverError — общая строка сверху
 * inputClass — стиль полей; при ошибке добавьте className input-error
 *
 * GUIDE_PAGES.md §2.1 | server/routes/auth.js
 * =============================================================================
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import FormField from '../components/FormField.jsx';
import PageImage from '../components/PageImage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPhoneInput, validateRegistration } from '../utils/validation.js';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // --- Состояние формы: имена полей = ключи для API (login, fullName…) ---
  const [form, setForm] = useState({
    login: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) => {
    let value = e.target.value;
    if (field === 'phone') value = formatPhoneInput(value);
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const localErrors = validateRegistration(form);
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }
    try {
      const user = await register({
        login: form.login,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
      });
      navigate(user.role === 'admin' ? '/admin' : '/requests');
    } catch (err) {
      if (err.data?.errors) setErrors(err.data.errors);
      else setServerError(err.data?.message || err.message);
    }
  };

  return (
    <Layout variant="register">
      <PageImage imageKey="registerBanner" className="w-full h-24 object-cover rounded-xl mb-4" />

      <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-up border border-teal-100">
        <h2 className="text-xl font-bold text-teal-900 mb-1">Регистрация</h2>
        <p className="text-sm text-slate-500 mb-6">Все поля обязательны</p>

        <form onSubmit={submit} noValidate>
          <FormField label="Логин" error={errors.login}>
            <input className={`${inputClass} ${errors.login ? 'input-error' : ''}`} value={form.login} onChange={set('login')} />
          </FormField>
          <FormField label="Пароль (от 6 символов)" error={errors.password}>
            <input type="password" className={`${inputClass} ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={set('password')} />
          </FormField>
          <FormField label="ФИО" error={errors.fullName}>
            <input className={`${inputClass} ${errors.fullName ? 'input-error' : ''}`} value={form.fullName} onChange={set('fullName')} />
          </FormField>
          <FormField label="Телефон" error={errors.phone}>
            <input placeholder="+7(999)-123-45-67" className={`${inputClass} ${errors.phone ? 'input-error' : ''}`} value={form.phone} onChange={set('phone')} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input type="email" className={`${inputClass} ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={set('email')} />
          </FormField>

          {serverError && <p className="field-error mb-3">{serverError}</p>}

          <button type="submit" className="w-full rounded-xl bg-teal-600 text-white py-3 font-semibold hover:bg-teal-700 transition">
            Зарегистрироваться
          </button>
        </form>

        {/* БАНКЕТАМ.НЕТ: на странице регистрации — ссылка «Уже зарегистрированы? Вход» (сейчас «Уже есть аккаунт?») */}
        <p className="text-center text-sm mt-4 text-slate-600">
          Уже есть аккаунт? <Link to="/login" className="text-teal-700 underline">Войти</Link>
        </p>
      </div>
    </Layout>
  );
}
