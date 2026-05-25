/**
 * =============================================================================
 * ФАЙЛ: client/src/components/FormField.jsx
 * Обёртка label+input+ошибка. Менять label на страницах, не здесь.
 * =============================================================================
 */

/**
 * =============================================================================
 * FormField.jsx — ПОЛЕ ФОРМЫ (label + input + ошибка)
 * =============================================================================
 * САМ КОМПОНЕНТ не меняют. Меняют на страницах (RegisterPage, RequestFormPage):
 *   <FormField label="ФИО" error={errors.fullName}>
 *     <input ... />
 *   </FormField>
 *
 * error={errors.xxx} — текст с validateRegistration / validateRequestForm (validation.js).
 * Добавить новое поле: label + children (input/select/textarea) + ключ в errors на странице.
 *
 * GUIDE_PAGES.md §2.4, §7.1
 * =============================================================================
 */
export default function FormField({ label, error, children, className = '' }) {
  return (
    <label className={`block mb-4 ${className}`}>
      {/* Подпись поля — задаётся на странице (RegisterPage, NewRequestPage…) */}
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}
