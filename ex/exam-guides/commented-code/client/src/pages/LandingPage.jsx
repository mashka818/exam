/**
 * =============================================================================
 * ФАЙЛ: client/src/pages/LandingPage.jsx | URL: /
 * Лендинг: слайдер, тексты perks, блок услуг. Не путать с Layout.jsx
 * =============================================================================
 */

/**
 * =============================================================================
 * ЛЕНДИНГ (/) — главная для гостей
 * =============================================================================
 * Слайдер, о клининге, услуги, футер с фото-заглушками.
 * Картинки: config/images.js → public/images/
 * БАНКЕТАМ.НЕТ: тексты про банкеты; perks и «Наши услуги» = 4 помещения;
 * LandingLayout brandName → Банкетам.Нет; слайдер 4×3 сек (HeroSlider).
 *
 * СТРУКТУРА: LandingLayout → HeroSlider → секции → SiteFooter
 * perks[] — карточки преимуществ (массив строк, менять под тему)
 * DEFAULT_SERVICE_NAMES — подписи на лендинге (дубль seed.sql; синхронизировать)
 * cabinetPath — куда ведёт CTA для вошедшего пользователя
 *
 * GUIDE_PAGES.md §5 | config/images.js (aboutCleaning, homeHero…)
 * =============================================================================
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LandingLayout from '../components/landing/LandingLayout.jsx';
import HeroSlider from '../components/landing/HeroSlider.jsx';
import SiteFooter from '../components/landing/SiteFooter.jsx';
import PageImage from '../components/PageImage.jsx';
import { DEFAULT_SERVICE_NAMES } from '../constants/services.js';

const perks = [
  'Опытные клинеры и проверенные средства',
  'Удобная подача заявки онлайн',
  'Наличные или карта — как вам удобнее',
  'Жилые и производственные помещения',
];

export default function LandingPage() {
  const { user } = useAuth();
  const cabinetPath = user?.role === 'admin' ? '/admin' : '/requests';

  return (
    <LandingLayout>
      <HeroSlider />

      <section className="mx-auto max-w-lg lg:max-w-5xl px-4 lg:px-8 py-10 lg:py-14">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center animate-fade-up">
          <PageImage
            imageKey="aboutCleaning"
            className="w-full h-48 lg:h-64 object-cover rounded-2xl shadow mb-6 lg:mb-0"
          />
          <div>
            <h2 className="text-2xl font-bold text-teal-900 mb-3">О нашем клининге</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              «Мой Не Сам» — портал для заказа уборки жилых и производственных помещений.
              Вы регистрируетесь, оформляете заявку с адресом и видом услуги, выбираете дату и
              способ оплаты — мы берём задачу в работу.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Работаем аккуратно, с соблюдением сроков и прозрачными статусами заявки в личном
              кабинете.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-teal-50 border-y border-teal-100 py-10 lg:py-14">
        <div className="mx-auto max-w-lg lg:max-w-5xl px-4 lg:px-8">
          <h2 className="text-xl font-bold text-teal-900 mb-6 text-center">Наши услуги</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEFAULT_SERVICE_NAMES.map((name) => (
              <li
                key={name}
                className="bg-white rounded-xl p-4 shadow-sm border border-teal-100 text-center text-sm font-medium text-slate-700 hover:shadow-md transition"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-lg lg:max-w-5xl px-4 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Почему выбирают нас</h2>
        <ul className="space-y-3">
          {perks.map((p) => (
            <li key={p} className="flex gap-3 text-sm text-slate-600">
              <span className="text-teal-600 font-bold">✓</span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-lg lg:max-w-5xl px-4 lg:px-8 pb-12">
        <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-8 text-center text-white shadow-lg animate-fade-up">
          <h2 className="text-xl font-bold mb-2">
            {user ? 'Добро пожаловать!' : 'Готовы заказать уборку?'}
          </h2>
          <p className="text-teal-100 text-sm mb-6">
            {user
              ? 'Перейдите в кабинет, чтобы посмотреть заявки или оформить новую.'
              : 'Зарегистрируйтесь за минуту и оформите первую заявку.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link
                to={cabinetPath}
                className="rounded-xl bg-white text-teal-800 py-3 px-6 font-semibold hover:bg-teal-50 transition"
              >
                {user.role === 'admin' ? 'Панель администратора' : 'Мои заявки'}
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-xl bg-white text-teal-800 py-3 px-6 font-semibold hover:bg-teal-50 transition"
                >
                  Зарегистрироваться
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/50 py-3 px-6 font-medium hover:bg-white/10 transition"
                >
                  Уже есть аккаунт
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </LandingLayout>
  );
}
