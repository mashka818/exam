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

const statusColors = {
  new: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getMyRequests()
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
