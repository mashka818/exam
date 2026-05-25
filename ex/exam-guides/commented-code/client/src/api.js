/**
 * =============================================================================
 * ФАЙЛ: client/src/api.js
 * ВСЕ запросы к бэкенду. Прокси: client/vite.config.js → localhost:3001
 * Добавить метод: 1) server/routes/... 2) строка в export const api 3) вызов на странице
 * Ошибки формы: catch (e) → e.data.errors
 * =============================================================================
 */

/**
 * =============================================================================
 * HTTP-ЗАПРОСЫ К API (все вызовы бэкенда в одном файле)
 * =============================================================================
 * Пути /api/... проксируются Vite на localhost:3001 (vite.config.js).
 * При смене темы endpoints чаще всего те же; меняют тела запросов в routes на сервере.
 *
 * TOKEN_KEY — ключ в localStorage; можно не менять.
 * БАНКЕТАМ.НЕТ: добавить postReview(requestId, { text }) → POST /api/requests/:id/review
 *
 * КАК ДОБАВИТЬ НОВЫЙ ЗАПРОС:
 *   1) Метод в server/routes/...
 *   2) Строка в export const api = { ... }
 *   3) Вызов на странице: await api.myMethod(...)
 *
 * Ошибки с сервера: catch (err) { err.data?.errors } — объект полей для формы
 *                     err.data?.message — одна строка (логин неверный)
 *
 * GUIDE_PAGES.md §8 | THEME_BANQUETAM_NET.md
 * =============================================================================
 */

const TOKEN_KEY = 'exam_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || 'Ошибка запроса');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // --- Авторизация → server/routes/auth.js (п.1 register, п.2 login) ---
  // body register: { login, password, fullName, phone, email }
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'), // проверка токена при F5

  // --- Справочник → server/routes/services.js + db/seed.sql (помещения/услуги) ---
  getServices: () => request('/services'),

  // --- Заявки пользователя → server/routes/requests.js (п.3 mine, п.4 POST) ---
  getMyRequests: () => request('/requests/mine'),
  createRequest: (body) => request('/requests', { method: 'POST', body: JSON.stringify(body) }),
  // БАНКЕТАМ.НЕТ: postReview: (id, body) => request(`/requests/${id}/review`, { method: 'POST', body: JSON.stringify(body) }),

  // --- Админ → server/routes/admin.js (п.5) ---
  // params.status: 'all' | 'new' | 'in_progress' | 'completed' | 'cancelled'
  adminGetRequests: (params = {}) => {
    const q = new URLSearchParams();
    if (params.status && params.status !== 'all') q.set('status', params.status);
    const qs = q.toString();
    return request(`/admin/requests${qs ? `?${qs}` : ''}`);
  },
  adminUpdateStatus: (id, body) =>
    request(`/admin/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
};
