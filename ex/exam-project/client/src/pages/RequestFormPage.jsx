/**
 * =============================================================================
 * ФАЙЛ: client/src/pages/RequestFormPage.jsx | URL: /requests/form | п.4
 * Форма заявки: api.getServices() + api.createRequest(). Поля form state → validation → POST
 * =============================================================================
 */

/**
 * =============================================================================
 * п.4 ЗАДАНИЯ — «Страница формирования заявки»  (/requests/form)
 * =============================================================================
 * Поля: адрес, контактные данные (телефон), дата/время, вид услуги, оплата.
 * «Иная услуга» — чекбокс + текст (модуль ПУ).
 * После отправки — редирект на п.3 (/requests).
 * БАНКЕТАМ.НЕТ (п.4): select помещение; дата type="text" placeholder ДД.ММ.ГГГГ (не datetime-local).
 * БАНКЕТАМ.НЕТ: убрать блок «Иная услуга» (isCustomService).
 * БАНКЕТАМ.НЕТ: заголовок «Оформление бронирования», label «Помещение».
 *
 * services: api.getServices() → select option (id, name) из service_types
 * submit: validateRequestForm → api.createRequest(form) → navigate('/requests')
 * paymentType: 'cash' | 'card' — значения как в schema CHECK
 * isCustomService — модуль ПУ; для Банкетам.Нет удалить блок и поля в API
 *
 * GUIDE_PAGES.md §2.4 | server/routes/requests.js POST /
 * =============================================================================
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import FormField from '../components/FormField.jsx';
import PageImage from '../components/PageImage.jsx';
import { api } from '../api.js';
import { formatPhoneInput, validateRequestForm } from '../utils/validation.js';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400';

export default function RequestFormPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    address: '',
    contactPhone: '',
    scheduledAt: '',
    paymentType: '',
    serviceTypeId: '',
    isCustomService: false,
    customService: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
  }, []);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let v = value;
    if (field === 'contactPhone') v = formatPhoneInput(value);
    setForm((f) => ({ ...f, [field]: v }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const localErrors = validateRequestForm(form);
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }
    try {
      await api.createRequest({
        address: form.address,
        contactPhone: form.contactPhone,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        paymentType: form.paymentType,
        serviceTypeId: form.isCustomService ? null : Number(form.serviceTypeId),
        isCustomService: form.isCustomService,
        customService: form.isCustomService ? form.customService : null,
      });
      navigate('/requests');
    } catch (err) {
      if (err.data?.errors) setErrors(err.data.errors);
      else setServerError(err.data?.message || err.message);
    }
  };

  return (
    <Layout variant="dashboard">
      <p className="text-white/70 text-xs mb-2">Пункт 4 задания</p>
      <PageImage imageKey="newRequestBanner" className="w-full h-20 object-cover rounded-xl mb-4" />

      <Link
        to="/requests"
        className="inline-block text-sm text-white/90 underline mb-4 hover:text-white"
      >
        ← Назад к истории заявок (п.3)
      </Link>

      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-lg p-6 animate-fade-up border border-cyan-100"
        noValidate
      >
        {/* БАНКЕТАМ.НЕТ: «Оформление бронирования» */}
        <h1 className="text-xl font-bold text-cyan-900 mb-1">Формирование заявки</h1>
        <p className="text-sm text-slate-500 mb-6">Все поля обязательны</p>

        <FormField label="Адрес" error={errors.address}>
          <input
            className={`${inputClass} ${errors.address ? 'input-error' : ''}`}
            value={form.address}
            onChange={set('address')}
            placeholder="Адрес выполнения услуги"
          />
        </FormField>

        <FormField label="Контактные данные (телефон)" error={errors.contactPhone}>
          <input
            placeholder="+7(999)-123-45-67"
            className={`${inputClass} ${errors.contactPhone ? 'input-error' : ''}`}
            value={form.contactPhone}
            onChange={set('contactPhone')}
          />
        </FormField>

        <FormField label="Желаемая дата и время получения услуги" error={errors.scheduledAt}>
          <input
            type="datetime-local"
            className={`${inputClass} ${errors.scheduledAt ? 'input-error' : ''}`}
            value={form.scheduledAt}
            onChange={set('scheduledAt')}
          />
        </FormField>

        {!form.isCustomService && (
          <FormField label="Вид услуги" error={errors.serviceTypeId}>
            <select
              className={`${inputClass} ${errors.serviceTypeId ? 'input-error' : ''}`}
              value={form.serviceTypeId}
              onChange={set('serviceTypeId')}
            >
              <option value="">— выберите из списка —</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Из задания: общий клининг, генеральная, послестроительная, химчистка
            </p>
          </FormField>
        )}

        {/* БАНКЕТАМ.НЕТ: удалить весь блок «Иная услуга» — в задании только select помещений */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isCustomService}
            onChange={set('isCustomService')}
            className="rounded border-slate-300 text-cyan-600"
          />
          <span className="text-sm">Иная услуга</span>
        </label>

        {form.isCustomService && (
          <FormField label="Опишите, какая услуга вам необходима" error={errors.customService}>
            <textarea
              rows={3}
              className={`${inputClass} ${errors.customService ? 'input-error' : ''}`}
              value={form.customService}
              onChange={set('customService')}
            />
          </FormField>
        )}

        <FormField label="Предпочтительный тип оплаты" error={errors.paymentType}>
          <select
            className={`${inputClass} ${errors.paymentType ? 'input-error' : ''}`}
            value={form.paymentType}
            onChange={set('paymentType')}
          >
            <option value="">— выберите —</option>
            <option value="cash">Наличные</option>
            <option value="card">Банковская карта</option>
          </select>
        </FormField>

        {serverError && <p className="field-error mb-3">{serverError}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-600 text-white py-3 font-semibold hover:bg-cyan-700 transition"
        >
          Отправить заявку
        </button>
      </form>
    </Layout>
  );
}
