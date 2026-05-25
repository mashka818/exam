/**
 * =============================================================================
 * ФАЙЛ: server/routes/services.js
 * GET /api/services — справочник для select на форме п.4
 * =============================================================================
 */

/**
 * =============================================================================
 * SERVICES — GET /api/services
 * =============================================================================
 * Справочник service_types — заполняется при npm run db:init из seed.sql.
 * Фронт: RequestFormPage useEffect → api.getServices() → <select>.
 *
 * Менять список: server/db/seed.sql (пересоздать БД или UPDATE вручную).
 * БАНКЕТАМ.НЕТ: id + name помещений (зал, ресторан, веранды…)
 *
 * Авторизация не нужна — справочник публичный.
 * GUIDE_PAGES.md §8.3 | seed.sql
 * =============================================================================
 */
import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// GET /api/services — список видов услуг для select на форме заявки
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM service_types ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
