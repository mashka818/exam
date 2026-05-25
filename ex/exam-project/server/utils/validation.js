/**
 * =============================================================================
 * ФАЙЛ: server/utils/validation.js
 * Как client/src/utils/validation.js — те же правила!
 * =============================================================================
 */

/**
 * =============================================================================
 * ВАЛИДАЦИЯ НА СЕРВЕРЕ (обязательно дублировать на клиенте)
 * =============================================================================
 * ЗАМЕНИТЕ регулярки и тексты ошибок по критериям задания.
 * =============================================================================
 * БАНКЕТАМ.НЕТ (п.1): логин — латиница и цифры, min 6: LOGIN_REGEX = /^[a-zA-Z0-9]{6,}$/
 * БАНКЕТАМ.НЕТ (п.1): пароль min 8 символов (сейчас 6).
 * БАНКЕТАМ.НЕТ (п.4): дата ДД.ММ.ГГГГ — DATE_REGEX + parse в validateRequest.
 * БАНКЕТАМ.НЕТ: убрать проверку isCustomService / custom_service если нет «иной услуги».
 *
 * Вызывается из routes перед INSERT — никогда не доверяйте только клиенту.
 * Возвращает объект errors {}; пустой = ок. Роут отвечает res.status(400).json({ errors })
 *
 * Дубль на клиенте: client/src/utils/validation.js (те же REGEX и тексты)
 *
 * GUIDE_PAGES.md §7.1 | RegisterPage + RequestFormPage
 * =============================================================================
 */

/** Формат телефона из задания — синхронизировать с formatPhoneInput на фронте */
export const PHONE_REGEX = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const FIO_REGEX = /^[А-Яа-яЁё\s-]+$/;

/** POST /api/auth/register */
export function validateRegistration({ login, password, fullName, phone, email }) {
  const errors = {};

  if (!login?.trim()) errors.login = 'Логин обязателен';
  else if (login.trim().length < 3) errors.login = 'Логин не короче 3 символов'; // БАНКЕТАМ.НЕТ: min 6 + только [a-zA-Z0-9]

  if (!password) errors.password = 'Пароль обязателен';
  else if (password.length < 6) errors.password = 'Пароль не менее 6 символов'; // БАНКЕТАМ.НЕТ: < 8

  if (!fullName?.trim()) errors.fullName = 'ФИО обязательно';
  else if (!FIO_REGEX.test(fullName.trim())) errors.fullName = 'ФИО: только кириллица и пробелы';

  if (!phone?.trim()) errors.phone = 'Телефон обязателен';
  else if (!PHONE_REGEX.test(phone.trim())) errors.phone = 'Формат: +7(XXX)-XXX-XX-XX';

  if (!email?.trim()) errors.email = 'Email обязателен';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Некорректный email';

  return errors;
}

/** POST /api/requests */
export function validateRequest(body) {
  const errors = {};
  const {
    address,
    contactPhone,
    scheduledAt,
    paymentType,
    serviceTypeId,
    isCustomService,
    customService,
  } = body;

  if (!address?.trim()) errors.address = 'Адрес обязателен';
  if (!contactPhone?.trim()) errors.contactPhone = 'Контактный телефон обязателен';
  else if (!PHONE_REGEX.test(contactPhone.trim()))
    errors.contactPhone = 'Формат: +7(XXX)-XXX-XX-XX';

  if (!scheduledAt) errors.scheduledAt = 'Дата и время обязательны';
  else if (new Date(scheduledAt) <= new Date())
    errors.scheduledAt = 'Дата должна быть в будущем';

  if (!paymentType) errors.paymentType = 'Укажите способ оплаты';
  else if (!['cash', 'card'].includes(paymentType))
    errors.paymentType = 'Некорректный способ оплаты';

  if (isCustomService) {
    if (!customService?.trim()) errors.customService = 'Опишите иную услугу';
  } else if (!serviceTypeId) {
    errors.serviceTypeId = 'Выберите вид услуги';
  }

  return errors;
}
