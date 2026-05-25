/**
 * =============================================================================
 * ФАЙЛ: server/routes/admin.js
 * GET /requests?status= — фильтр. PATCH /requests/:id/status
 * =============================================================================
 */

/**
 * =============================================================================
 * ADMIN — /api/admin (только role=admin, логин adminka)
 * =============================================================================
 * GET   /requests           — все заявки всех пользователей
 * PATCH /requests/:id/status — in_progress | completed | cancelled + cancelReason
 * БАНКЕТАМ.НЕТ (п.5): Admin26 / Demo20; ALLOWED_STATUSES = ['in_progress','completed'] без cancelled.
 * БАНКЕТАМ.НЕТ: подписи «Банкет назначен» / «Банкет завершен»; изначально «Новая».
 * БАНКЕТАМ.НЕТ (М2): фильтр ?status=, сортировка ORDER BY, LIMIT/OFFSET пагинация — в GET /requests.
 *
 * adminRequired — только login с role=admin из init.js
 * PATCH body: { status, cancelReason? } — cancelReason только для cancelled
 * После UPDATE — фронт перезагружает список load()
 *
 * Пример фильтра в SQL:
 *   const status = req.query.status;
 *   WHERE ($1::text IS NULL OR r.status = $1)
 *
 * GUIDE_PAGES.md §8.4 | AdminPage.jsx
 * =============================================================================
 */
import { Router } from 'express';
import { pool } from '../db/pool.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

const ALLOWED_STATUSES = ['in_progress', 'completed', 'cancelled']; // БАНКЕТАМ.НЕТ: убрать 'cancelled'

// GET /api/admin/requests — все заявки; ?status=new|in_progress|completed|cancelled (без all)
const FILTER_STATUSES = ['new', 'in_progress', 'completed', 'cancelled'];

router.get('/requests', authRequired, adminRequired, async (req, res) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = 'WHERE 1=1';

    if (status && status !== 'all' && FILTER_STATUSES.includes(status)) {
      params.push(status);
      where += ` AND r.status = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT r.*, st.name AS service_name, u.full_name AS user_full_name,
              u.phone AS user_phone, u.email AS user_email
       FROM requests r
       LEFT JOIN service_types st ON st.id = r.service_type_id
       JOIN users u ON u.id = r.user_id
       ${where}
       ORDER BY r.created_at DESC`,
      params
    );
    res.json(
      rows.map((row) => ({
        id: row.id,
        userFullName: row.user_full_name,
        userPhone: row.user_phone,
        userEmail: row.user_email,
        address: row.address,
        contactPhone: row.contact_phone,
        serviceName: row.service_name || row.custom_service,
        scheduledAt: row.scheduled_at,
        paymentType: row.payment_type,
        paymentLabel: row.payment_type === 'cash' ? 'Наличные' : 'Банковская карта',
        status: row.status,
        statusLabel:
          { new: 'Новая', in_progress: 'В работе', completed: 'Выполнено', cancelled: 'Отменено' }[
            row.status
          ] || row.status,
        cancelReason: row.cancel_reason,
        createdAt: row.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PATCH /api/admin/requests/:id/status — смена статуса админом
router.patch('/requests/:id/status', authRequired, adminRequired, async (req, res) => {
  const { status, cancelReason } = req.body;
  const id = Number(req.params.id);

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Недопустимый статус' });
  }
  if (status === 'cancelled' && !cancelReason?.trim()) {
    return res.status(400).json({ message: 'Укажите причину отмены' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE requests
       SET status = $1, cancel_reason = $2
       WHERE id = $3
       RETURNING *`,
      [status, status === 'cancelled' ? cancelReason.trim() : null, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Заявка не найдена' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
