/**
 * =============================================================================
 * ФАЙЛ: server/index.js
 * Старт API :3001. Роуты /api/auth, /services, /requests, /admin
 * =============================================================================
 */

/**
 * =============================================================================
 * EXPRESS — точка входа сервера
 * =============================================================================
 * PORT, DATABASE_URL, JWT_SECRET — в server/.env
 * Префикс /api обычно не меняют. Роуты подключаются из папки routes/
 * БАНКЕТАМ.НЕТ: DATABASE_URL в .env — имя БД например banketam_net
 *
 * ЗАПУСК: npm run dev (корень) или node index.js из server/
 * Порядок: dotenv → cors → express.json() → роуты → listen(PORT)
 *
 * Новый роут: import + app.use('/api/xxx', xxxRoutes)
 * Health-check: GET /api/health → { ok: true } — проверка что API жив
 *
 * GUIDE_PAGES.md §8 | README.md
 * =============================================================================
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import requestsRoutes from './routes/requests.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Подключение API (при смене темы файлы можно переименовать, пути оставить) ---
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
});
