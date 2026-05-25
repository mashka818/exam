/**
 * =============================================================================
 * ФАЙЛ: server/db/init.js
 * npm run db:init — schema+seed+админ. Логин/пароль админа ЗДЕСЬ (seedAdmin).
 * =============================================================================
 */

/**
 * =============================================================================
 * ИНИЦИАЛИЗАЦИЯ БД: npm run db:init
 * =============================================================================
 * Читает schema.sql + seed.sql, создаёт админа adminka/password
 * ЗАМЕНИТЕ: login/password в seedAdmin(), ФИО и email админа
 *
 * КОМАНДА: из корня проекта npm run db:init
 *   1) Читает schema.sql (таблицы)
 *   2) Читает seed.sql (услуги)
 *   3) seedAdmin() — UPSERT админа (ON CONFLICT login)
 *
 * Перед запуском: CREATE DATABASE в psql + DATABASE_URL в server/.env
 * БАНКЕТАМ.НЕТ: login Admin26, password Demo20 в seedAdmin()
 *
 * README.md | GUIDE_PAGES.md §8.5
 * =============================================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './pool.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runSqlFile(filename) {
  const sql = fs.readFileSync(path.join(__dirname, filename), 'utf8');
  await pool.query(sql);
}

async function seedAdmin() {
  // --- Учётка админа по заданию ДЭ (п.5) — менять здесь ---
  // БАНКЕТАМ.НЕТ: const login = 'Admin26'; const password = 'Demo20';
  const login = 'adminka';
  const password = 'password';
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (login, password_hash, full_name, phone, email, role)
     VALUES ($1, $2, $3, $4, $5, 'admin')
     ON CONFLICT (login) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       role = 'admin'`,
    [login, hash, 'Администратор системы', '+7(000)-000-00-00', 'admin@moynesam.local'] // БАНКЕТАМ.НЕТ: email admin@banketam.net
  );
  console.log('Админ: логин adminka, пароль password'); // БАНКЕТАМ.НЕТ: Admin26 / Demo20
}

async function main() {
  try {
    await runSqlFile('schema.sql');
    await runSqlFile('seed.sql');
    await seedAdmin();
    console.log('База данных готова.');
  } catch (err) {
    console.error('Ошибка инициализации:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
