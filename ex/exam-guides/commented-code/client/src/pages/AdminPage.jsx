/**
 * =============================================================================
 * ФАЙЛ: client/src/pages/AdminPage.jsx | URL: /admin | п.5
 * Фильтр filterStatus → api.adminGetRequests({ status }). Кнопки статусов → PATCH.
 * Сервер: server/routes/admin.js
 * =============================================================================
 */

/**
 * =============================================================================
 * АДМИН-ПАНЕЛЬ (/admin) — п.5 задания ДЭ
 * =============================================================================
 * ФИЛЬТР ПО СТАТУСУ:
 *   filterStatus — значение select (all / new / in_progress / completed / cancelled)
 *   load() → api.adminGetRequests({ status }) → GET /api/admin/requests?status=...
 *   На сервере: server/routes/admin.js — WHERE r.status = $1
 *
 * ЗАМЕНИТЕ: кнопки статусов, admin-banner, логин админа в server/db/init.js
 * БАНКЕТАМ.НЕТ: подписи опций фильтра и кнопок — «Банкет назначен» и т.д.
 * =============================================================================
 */
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import PageImage from '../components/PageImage.jsx';
import { api } from '../api.js';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Все заявки' },
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Выполнено' },
  { value: 'cancelled', label: 'Отменено' },
];

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancelReasons, setCancelReasons] = useState({});
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api
      .adminGetRequests({ status: filterStatus })
      .then(setRequests)
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    setMessage('');
    const cancelReason = cancelReasons[id];
    if (status === 'cancelled' && !cancelReason?.trim()) {
      setMessage('Для отмены укажите причину в поле под заявкой');
      return;
    }
    try {
      await api.adminUpdateStatus(id, { status, cancelReason });
      setMessage('Статус обновлён');
      load();
    } catch (e) {
      setMessage(e.data?.message || e.message);
    }
  };

  return (
    <Layout variant="admin">
      <div className="animate-fade-up">
        <PageImage imageKey="adminBanner" className="w-full h-20 object-cover rounded-xl mb-4" />

        <h2 className="text-xl font-bold text-white mb-4">Панель администратора</h2>

        {/* Фильтр: меняйте label в STATUS_FILTER_OPTIONS; value = status в БД */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label htmlFor="admin-filter-status" className="text-white/90 text-sm">
            Статус:
          </label>
          <select
            id="admin-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm text-slate-800 bg-white"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={load}
            className="text-xs px-2 py-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30"
          >
            Обновить
          </button>
        </div>

        {message && <p className="text-amber-200 text-sm mb-3">{message}</p>}
        {loading && <p className="text-white/70">Загрузка…</p>}
        {!loading && requests.length === 0 && (
          <p className="text-white/70 text-sm">Нет заявок с выбранным статусом</p>
        )}

        <div className="space-y-4">
          {requests.map((r) => (
            <article
              key={r.id}
              className="bg-white rounded-xl p-4 shadow text-sm animate-slide-in"
            >
              <div className="flex justify-between gap-2 mb-2">
                <strong className="text-violet-900">#{r.id}</strong>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{r.statusLabel}</span>
              </div>
              <p>
                <span className="text-slate-500">Заказчик:</span> {r.userFullName}
              </p>
              <p>
                <span className="text-slate-500">Контакты:</span> {r.contactPhone}, {r.userEmail}
              </p>
              <p>
                <span className="text-slate-500">Адрес:</span> {r.address}
              </p>
              <p>
                <span className="text-slate-500">Услуга:</span> {r.serviceName}
              </p>
              <p>
                <span className="text-slate-500">Когда:</span>{' '}
                {new Date(r.scheduledAt).toLocaleString('ru-RU')} · {r.paymentLabel}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {r.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(r.id, 'in_progress')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700"
                  >
                    В работе
                  </button>
                )}
                {r.status !== 'completed' && r.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(r.id, 'completed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                  >
                    Выполнено
                  </button>
                )}
                {r.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(r.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700"
                  >
                    Отменить
                  </button>
                )}
              </div>

              {r.status !== 'cancelled' && (
                <input
                  placeholder="Причина отмены (обязательно при отмене)"
                  className="mt-2 w-full text-xs border rounded px-2 py-1"
                  value={cancelReasons[r.id] || ''}
                  onChange={(e) =>
                    setCancelReasons((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                />
              )}
              {r.cancelReason && (
                <p className="text-red-600 text-xs mt-1">Отмена: {r.cancelReason}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
