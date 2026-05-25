/**
 * =============================================================================
 * ФАЙЛ: client/src/utils/validation.js
 * Валидация форм на клиенте. ДУБЛИРОВАТЬ в server/utils/validation.js!
 * register → RegisterPage | request → RequestFormPage
 * =============================================================================
 */

/**
 * =============================================================================
 * ВАЛИДАЦИЯ НА КЛИЕНТЕ (мгновенные ошибки на форме)
 * =============================================================================
 * Должна совпадать с server/utils/validation.js
 * ЗАМЕНИТЕ регулярки и сообщения, если в задании другие правила.
 * БАНКЕТАМ.НЕТ: см. server/utils/validation.js (логин, пароль 8, дата ДД.ММ.ГГГГ).
 *
 * ВАЖНО: любое изменение здесь — продублировать в server/utils/validation.js
 * Иначе форма пройдёт на клиенте, но сервер вернёт 400.
 *
 * validateRegistration — RegisterPage submit
 * validateRequestForm — RequestFormPage submit
 * formatPhoneInput — onChange телефона (маска +7(999)-999-99-99)
 *
 * GUIDE_PAGES.md §7.1 | THEME_BANQUETAM_NET.md
 * =============================================================================
 */

/** Телефон строго в формате задания — менять вместе с подсказкой на форме */
export const PHONE_REGEX = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const FIO_REGEX = /^[А-Яа-яЁё\s-]+$/;

/** Регистрация — поля users */
export function validateRegistration(form) {
  const errors = {};
  if (!form.login?.trim()) errors.login = 'Логин обязателен';
  if (!form.password) errors.password = 'Пароль обязателен';
  else if (form.password.length < 6) errors.password = 'Минимум 6 символов'; // БАНКЕТАМ.НЕТ: 8
  if (!form.fullName?.trim()) errors.fullName = 'ФИО обязательно';
  else if (!FIO_REGEX.test(form.fullName.trim())) errors.fullName = 'Только кириллица и пробелы';
  if (!form.phone?.trim()) errors.phone = 'Телефон обязателен';
  else if (!PHONE_REGEX.test(form.phone.trim())) errors.phone = 'Формат: +7(XXX)-XXX-XX-XX';
  if (!form.email?.trim()) errors.email = 'Email обязателен';
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'Некорректный email';
  return errors;
}

/** Новая заявка — поля requests */
export function validateRequestForm(form) {
  const errors = {};
  if (!form.address?.trim()) errors.address = 'Адрес обязателен';
  if (!form.contactPhone?.trim()) errors.contactPhone = 'Телефон обязателен';
  else if (!PHONE_REGEX.test(form.contactPhone.trim()))
    errors.contactPhone = 'Формат: +7(XXX)-XXX-XX-XX';
  if (!form.scheduledAt) errors.scheduledAt = 'Укажите дату и время';
  if (!form.paymentType) errors.paymentType = 'Выберите оплату';
  if (form.isCustomService) {
    if (!form.customService?.trim()) errors.customService = 'Опишите услугу';
  } else if (!form.serviceTypeId) {
    errors.serviceTypeId = 'Выберите услугу';
  }
  return errors;
}

/** Маска телефона при вводе — можно оставить для любой темы с тем же форматом */
export function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits.length) return '';
  let d = digits;
  if (d[0] === '8') d = '7' + d.slice(1);
  if (d[0] !== '7') d = '7' + d;
  const p = d.slice(1);
  let out = '+7';
  if (p.length > 0) out += `(${p.slice(0, 3)}`;
  if (p.length >= 3) out += `)-${p.slice(3, 6)}`;
  if (p.length >= 6) out += `-${p.slice(6, 8)}`;
  if (p.length >= 8) out += `-${p.slice(8, 10)}`;
  return out;
}
