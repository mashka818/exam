/**
 * =============================================================================
 * ФАЙЛ: server/routes/requests.js
 * GET /mine, POST / — заявки пользователя. STATUS_LABELS — подписи статусов
 * =============================================================================
 */

/**
 * =============================================================================
 * REQUESTS — /api/requests (только role=user)
 * =============================================================================
 * GET  /mine  — история заявок текущего пользователя
 * POST /      — новая заявка
 * STATUS_LABELS — подписи статусов на русском для фронта
 * БАНКЕТАМ.НЕТ: in_progress → «Банкет назначен», completed → «Банкет завершен».
 * БАНКЕТАМ.НЕТ: POST /api/requests/reviews/:id — отзыв (только если status !== 'new').
 *
 * mapRequest — snake_case из PG → camelCase для React (scheduledAt, serviceName…)
 * POST /: body как на RequestFormPage; validateRequest в utils/validation.js
 * user_id берётся из JWT (req.user.id), клиент не передаёт userId
 *
 * GUIDE_PAGES.md §8.2 | schema.sql таблица requests
 * =============================================================================
 */
import { Router } from 'express';
import { pool } from '../db/pool.js';
import { authRequired } from '../middleware/auth.js';
import { validateRequest } from '../utils/validation.js';
// ОТЗЫВЫ: раскомментируйте → import { validateRequest, validateReview } from '../utils/validation.js';

const router = Router();

const STATUS_LABELS = {
  new: 'Новая', // БАНКЕТАМ.НЕТ: без изменений
  in_progress: 'В работе', // БАНКЕТАМ.НЕТ: 'Банкет назначен'
  completed: 'Выполнено', // БАНКЕТАМ.НЕТ: 'Банкет завершен'
  cancelled: 'Отменено', // БАНКЕТАМ.НЕТ: можно убрать
};

// GET /api/requests/mine — история заявок текущего пользователя
router.get('/mine', authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, st.name AS service_name, u.full_name AS user_full_name
       FROM requests r
       LEFT JOIN service_types st ON st.id = r.service_type_id
       JOIN users u ON u.id = r.user_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    // ОТЗЫВЫ: замените запрос выше на вариант с JOIN (раскомментируйте):
    // const { rows } = await pool.query(
    //   `SELECT r.*, st.name AS service_name, u.full_name AS user_full_name,
    //           rev.text AS review_text, rev.rating AS review_rating, rev.created_at AS review_created_at
    //    FROM requests r
    //    LEFT JOIN service_types st ON st.id = r.service_type_id
    //    JOIN users u ON u.id = r.user_id
    //    LEFT JOIN reviews rev ON rev.request_id = r.id
    //    WHERE r.user_id = $1
    //    ORDER BY r.created_at DESC`,
    //   [req.user.id]
    // );
    res.json(rows.map(mapRequest));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/requests — новая заявка
router.post('/', authRequired, async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Администратор не создаёт заявки через этот endpoint' });
  }

  const body = {
    address: req.body.address,
    contactPhone: req.body.contactPhone,
    scheduledAt: req.body.scheduledAt,
    paymentType: req.body.paymentType,
    serviceTypeId: req.body.serviceTypeId,
    isCustomService: req.body.isCustomService,
    customService: req.body.customService,
  };

  const errors = validateRequest(body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO requests (
         user_id, address, contact_phone, service_type_id, custom_service,
         scheduled_at, payment_type, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
       RETURNING *`,
      [
        req.user.id,
        body.address.trim(),
        body.contactPhone.trim(),
        body.isCustomService ? null : Number(body.serviceTypeId),
        body.isCustomService ? body.customService.trim() : null,
        body.scheduledAt,
        body.paymentType,
      ]
    );
    res.status(201).json(mapRequest(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

function mapRequest(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userFullName: row.user_full_name,
    address: row.address,
    contactPhone: row.contact_phone,
    serviceName: row.service_name || row.custom_service,
    customService: row.custom_service,
    scheduledAt: row.scheduled_at,
    paymentType: row.payment_type,
    paymentLabel: row.payment_type === 'cash' ? 'Наличные' : 'Банковская карта',
    status: row.status,
    statusLabel: STATUS_LABELS[row.status] || row.status,
    cancelReason: row.cancel_reason,
    createdAt: row.created_at,
    // ОТЗЫВЫ: раскомментируйте в mapRequest:
    // review: row.review_text
    //   ? {
    //       text: row.review_text,
    //       rating: row.review_rating,
    //       createdAt: row.review_created_at,
    //     }
    //   : null,
  };
}

// =============================================================================
// ОТЗЫВЫ: раскомментируйте роут + validateReview в validation.js + таблицу reviews
// POST /api/requests/:id/review — только своя заявка, status !== 'new', один отзыв
// В ТЗ «только завершённые»: замените проверку на row.status !== 'completed'
// =============================================================================
// router.post('/:id/review', authRequired, async (req, res) => {
//   if (req.user.role === 'admin') {
//     return res.status(403).json({ message: 'Отзыв оставляет только заказчик' });
//   }
//   const requestId = Number(req.params.id);
//   const { text, rating } = req.body;
//   const errors = validateReview({ text, rating });
//   if (Object.keys(errors).length) {
//     return res.status(400).json({ errors });
//   }
//   try {
//     const existing = await pool.query(
//       'SELECT id, user_id, status FROM requests WHERE id = $1',
//       [requestId]
//     );
//     if (!existing.rows.length) {
//       return res.status(404).json({ message: 'Заявка не найдена' });
//     }
//     const row = existing.rows[0];
//     if (row.user_id !== req.user.id) {
//       return res.status(403).json({ message: 'Нет доступа к этой заявке' });
//     }
//     if (row.status === 'new') {
//       return res.status(400).json({ message: 'Отзыв можно оставить после обработки заявки администратором' });
//     }
//     const dup = await pool.query('SELECT id FROM reviews WHERE request_id = $1', [requestId]);
//     if (dup.rows.length) {
//       return res.status(400).json({ message: 'Отзыв по этой заявке уже оставлен' });
//     }
//     const ratingVal = rating != null && rating !== '' ? Number(rating) : null;
//     await pool.query(
//       `INSERT INTO reviews (request_id, user_id, text, rating)
//        VALUES ($1, $2, $3, $4)`,
//       [requestId, req.user.id, text.trim(), ratingVal]
//     );
//     const { rows } = await pool.query(
//       `SELECT r.*, st.name AS service_name, u.full_name AS user_full_name,
//               rev.text AS review_text, rev.rating AS review_rating, rev.created_at AS review_created_at
//        FROM requests r
//        LEFT JOIN service_types st ON st.id = r.service_type_id
//        JOIN users u ON u.id = r.user_id
//        LEFT JOIN reviews rev ON rev.request_id = r.id
//        WHERE r.id = $1`,
//       [requestId]
//     );
//     res.status(201).json(mapRequest(rows[0]));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

export default router;
