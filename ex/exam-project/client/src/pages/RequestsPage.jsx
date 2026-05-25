/**
 * =============================================================================
 * ФАЙЛ: client/src/pages/RequestsPage.jsx | URL: /requests | п.3
 * История: api.getMyRequests(). Кнопка на /requests/form. statusLabel с сервера.
 * =============================================================================
 */

/**
 * =============================================================================
 * п.3 ЗАДАНИЯ — «Страница создания заявки»  (/requests)
 * =============================================================================
 * История заявок + кнопка перехода на /requests/form (п.4)
 * БАНКЕТАМ.НЕТ (п.3): «Личный кабинет» — история бронирований + слайдер (HeroSlider).
 * БАНКЕТАМ.НЕТ: блок отзыва под заявкой, если status !== 'new' (после админа).
 * БАНКЕТАМ.НЕТ: statusColors — подписи «Банкет назначен» / «Банкет завершен».
 *
 * ДАННЫЕ: useEffect → api.getMyRequests() → GET /api/requests/mine
 * statusLabel приходит с сервера (requests.js STATUS_LABELS)
 * Кнопка «Новая заявка» → Link to="/requests/form" (п.4)
 *
 * БАНКЕТАМ.НЕТ (отзывы): под карточкой textarea + кнопка, если status !== 'new'
 *   → api.postReview + route на сервере + таблица reviews в schema.sql
 *
 * GUIDE_PAGES.md §2.3 | THEME_BANQUETAM_NET.md
 * =============================================================================
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import PageImage from '../components/PageImage.jsx';
import { api } from '../api.js';
// ОТЗЫВЫ: раскомментируйте → import { validateReviewForm } from '../utils/validation.js';

const statusColors = {
  new: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

// =============================================================================
// ОТЗЫВЫ (п.3): раскомментируйте компонент + вызов <RequestReviewBlock /> в списке ниже
// Порядок: schema.sql → npm run db:init → requests.js → api.js → этот файл
// =============================================================================
/*
function RequestReviewBlock({ request, onSaved }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (request.status === 'new') return null;

  if (request.review) {
    return (
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs font-semibold text-teal-800 mb-1">Ваш отзыв</p>
        {request.review.rating != null && (
          <p className="text-sm text-amber-600 mb-1">Оценка: {request.review.rating} / 5</p>
        )}
        <p className="text-sm text-slate-700">{request.review.text}</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateReviewForm({ text, rating });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      const updated = await api.postReview(request.id, {
        text,
        rating: rating === '' ? null : Number(rating),
      });
      onSaved(updated);
      setText('');
      setRating('');
    } catch (err) {
      setSubmitError(err.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-slate-200 space-y-2">
      <p className="text-xs font-semibold text-teal-800">Оставить отзыв</p>
      <textarea
        className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.text ? 'border-red-400' : 'border-slate-300'}`}
        rows={3}
        placeholder="Опишите впечатления от услуги"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {errors.text && <p className="text-xs text-red-600">{errors.text}</p>}
      <select
        className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.rating ? 'border-red-400' : 'border-slate-300'}`}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        <option value="">Оценка (необязательно)</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} звёзд
          </option>
        ))}
      </select>
      {errors.rating && <p className="text-xs text-red-600">{errors.rating}</p>}
      {submitError && <p className="text-xs text-red-600">{submitError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-teal-600 text-white text-sm px-4 py-2 hover:bg-teal-700 disabled:opacity-60"
      >
        {submitting ? 'Отправка…' : 'Отправить отзыв'}
      </button>
    </form>
  );
}
*/

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  function loadRequests() {
    setLoading(true);
    api
      .getMyRequests()
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  // ОТЗЫВЫ: раскомментируйте — обновление одной заявки после отзыва
  // function handleReviewSaved(updated) {
  //   setRequests((list) => list.map((r) => (r.id === updated.id ? updated : r)));
  // }

  return (
    <Layout variant="dashboard">
      <div className="animate-fade-up">
        <p className="text-white/70 text-xs mb-1">Пункт 3 задания</p>
        <PageImage imageKey="requestsBanner" className="w-full h-20 object-cover rounded-xl mb-4" />

        {/* БАНКЕТАМ.НЕТ: заголовок «Личный кабинет» */}
        <h1 className="text-xl font-bold text-white drop-shadow mb-1">Создание заявки</h1>
        <p className="text-white/80 text-sm mb-6">
          История ваших заявок и переход к оформлению новой
        </p>

        <Link
          to="/requests/form"
          className="block mb-8 rounded-2xl bg-white p-5 shadow-lg border-2 border-teal-400 hover:border-teal-500 transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="font-bold text-teal-800 text-lg">Оставить новую заявку</p>
              <p className="text-slate-600 text-sm mt-1">
                Страница формирования заявки: адрес, контакты, услуга, дата, оплата
              </p>
            </div>
            <span className="text-3xl text-teal-600 group-hover:translate-x-1 transition">→</span>
          </div>
        </Link>

        <h2 className="text-lg font-semibold text-white mb-3">История заявок</h2>

        {loading && <p className="text-white/80">Загрузка…</p>}
        {error && <p className="text-red-200">{error}</p>}

        {!loading && requests.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center text-slate-600 shadow">
            <PageImage imageKey="emptyRequests" className="w-32 h-auto mx-auto mb-3 opacity-80" />
            Заявок пока нет. Нажмите «Оставить новую заявку» выше.
          </div>
        )}

        <ul className="space-y-3">
          {requests.map((r, i) => (
            <li
              key={r.id}
              className="bg-white rounded-xl p-4 shadow animate-slide-in border-l-4 border-teal-500"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="font-medium text-slate-800">{r.serviceName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>
                  {r.statusLabel}
                </span>
              </div>
              <p className="text-sm text-slate-600">Адрес: {r.address}</p>
              <p className="text-sm text-slate-600">Контакты: {r.contactPhone}</p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(r.scheduledAt).toLocaleString('ru-RU')} · {r.paymentLabel}
              </p>
              {r.cancelReason && (
                <p className="text-xs text-red-600 mt-2">Причина отмены: {r.cancelReason}</p>
              )}
              {/* ОТЗЫВЫ: <RequestReviewBlock request={r} onSaved={handleReviewSaved} /> */}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
