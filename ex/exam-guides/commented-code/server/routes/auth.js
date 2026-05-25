/**
 * =============================================================================
 * ФАЙЛ: server/routes/auth.js
 * POST /register, POST /login, GET /me
 * =============================================================================
 */

/**
 * =============================================================================
 * AUTH — /api/auth
 * =============================================================================
 * POST /register — новый user (поля: login, password, fullName, phone, email)
 * POST /login    — вход, возвращает JWT
 * GET  /me       — текущий пользователь по токену
 * ЗАМЕНИТЕ: INSERT в users при других полях регистрации
 * БАНКЕТАМ.НЕТ (п.1–2): validateRegistration — логин/пароль по заданию; ошибка «Логин уже занят».
 *
 * register: bcrypt.hash → INSERT users → JWT (role user)
 * login: SELECT по login → bcrypt.compare → JWT { id, login, role }
 * me: authRequired не здесь — см. ниже GET /me с jwt.verify в этом файле
 *
 * Ответ register/login: { token, user: { id, login, fullName, role, … } }
 * Ошибка 400: { errors: { login: '...' } } — фронт кладёт в errors state
 *
 * GUIDE_PAGES.md §8.1 | client/pages/RegisterPage, LoginPage
 * =============================================================================
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { validateRegistration } from '../utils/validation.js';

const router = Router();

// POST /api/auth/register — регистрация заказчика
router.post('/register', async (req, res) => {
  const { login, password, fullName, phone, email } = req.body;
  const errors = validateRegistration({ login, password, fullName, phone, email });
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  try {
    const exists = await pool.query('SELECT id FROM users WHERE login = $1', [login.trim()]);
    if (exists.rows.length) {
      return res.status(400).json({ errors: { login: 'Логин уже занят' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (login, password_hash, full_name, phone, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, login, full_name, phone, email, role`,
      [login.trim(), passwordHash, fullName.trim(), phone.trim(), email.trim()]
    );

    const user = result.rows[0];
    const token = signToken(user);
    res.status(201).json({ user: mapUser(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/auth/login — вход (и обычный пользователь, и adminka)
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  if (!login?.trim() || !password) {
    return res.status(400).json({ message: 'Введите логин и пароль' });
  }

  try {
    const result = await pool.query(
      'SELECT id, login, password_hash, full_name, phone, email, role FROM users WHERE login = $1',
      [login.trim()]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const token = signToken(user);
    res.json({ user: mapUser(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/auth/me — текущий пользователь по токену
router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Не авторизован' });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id, login, full_name, phone, email, role FROM users WHERE id = $1',
      [payload.id]
    );
    if (!result.rows[0]) return res.status(401).json({ message: 'Пользователь не найден' });
    res.json({ user: mapUser(result.rows[0]) });
  } catch {
    res.status(401).json({ message: 'Недействительный токен' });
  }
});

function signToken(user) {
  return jwt.sign(
    { id: user.id, login: user.login, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function mapUser(row) {
  return {
    id: row.id,
    login: row.login,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    role: row.role,
  };
}

export default router;
