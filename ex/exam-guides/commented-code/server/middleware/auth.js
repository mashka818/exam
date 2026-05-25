/**
 * =============================================================================
 * ФАЙЛ: server/middleware/auth.js
 * JWT. authRequired — user routes. adminRequired — /api/admin
 * =============================================================================
 */

/**
 * =============================================================================
 * JWT middleware
 * =============================================================================
 * JWT_SECRET — server/.env
 * role в токене: user | admin — из таблицы users
 *
 * authRequired — вешать на роуты /requests, /admin (заголовок Authorization: Bearer ...)
 * adminRequired — только для /api/admin/* (роль admin после входа Admin26)
 *
 * На фронте: ProtectedRoute role="user" | "admin" (client/src/components/ProtectedRoute.jsx)
 *
 * JWT_SECRET в server/.env — обязательно задать перед экзаменом
 * =============================================================================
 */
import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Сессия истекла, войдите снова' });
  }
}

export function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ только для администратора' });
  }
  next();
}
