-- =============================================================================
-- ФАЙЛ: server/db/schema.sql
-- Таблицы users, service_types, requests. Статусы CHECK. npm run db:init
-- =============================================================================

-- =============================================================================
-- СХЕМА БД — при смене темы переименуйте БД и таблицы по смыслу предметной области
-- Тема сейчас: клининг «Мой Не Сам» → заявки на уборку (requests)
-- Другая тема: заявки → orders / bookings / applications
-- =============================================================================
-- БАНКЕТАМ.НЕТ: users — без изменений структуры (ФИО, телефон, email, login, password).
-- БАНКЕТАМ.НЕТ: service_types → помещения (зал, ресторан, веранды).
-- БАНКЕТАМ.НЕТ: requests → бронирования; address можно оставить или переименовать в comment_only.
-- БАНКЕТАМ.НЕТ: scheduled_at → дата начала банкета.
-- БАНКЕТАМ.НЕТ: статусы CHECK → 'new','in_progress','completed' (без cancelled при необходимости).
-- БАНКЕТАМ.НЕТ: Модуль 3 — ДОБАВИТЬ таблицу reviews (request_id, user_id, text, rating, created_at).
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Справочник видов услуг — при другой теме замените названия и список в seed
-- БАНКЕТАМ.НЕТ: по смыслу «помещения», таблицу можно не переименовывать (меньше правок в SQL)
CREATE TABLE IF NOT EXISTS service_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Заявки заказчика — ядро предметной области
-- Поля: address (адрес/комментарий), scheduled_at (дата услуги), payment_type cash|card
-- service_type_id ИЛИ custom_service — «иная услуга»; БАНКЕТАМ.НЕТ: только service_type_id
-- status: new → админ меняет на in_progress / completed (подписи в requests.js STATUS_LABELS)
CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  contact_phone VARCHAR(32) NOT NULL,
  service_type_id INTEGER REFERENCES service_types(id),
  custom_service TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('cash', 'card')),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  cancel_reason TEXT, -- БАНКЕТАМ.НЕТ: поле можно не использовать (в задании нет «отмены»)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- БАНКЕТАМ.НЕТ: ALTER TABLE requests ADD COLUMN review_text TEXT; — отзыв после смены статуса админом
);

CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
