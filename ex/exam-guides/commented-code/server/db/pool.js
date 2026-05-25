/**
 * =============================================================================
 * ФАЙЛ: server/db/pool.js
 * Подключение БД. Только server/.env → DATABASE_URL
 * =============================================================================
 */

/**
 * =============================================================================
 * pool.js — ПОДКЛЮЧЕНИЕ К PostgreSQL
 * =============================================================================
 * Менять ТОЛЬКО server/.env → DATABASE_URL
 *   postgresql://ЛОГИН:ПАРОЛЬ@localhost:5432/ИМЯ_БАЗЫ
 *
 * БАНКЕТАМ.НЕТ: CREATE DATABASE banketam_net; и /banketam_net в URL
 * Импорт pool везде: import { pool } from '../db/pool.js';
 *
 * GUIDE_PAGES.md §8 | README.md (разбор строки подключения)
 * =============================================================================
 */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
