# Полный гайд: как править шаблон на экзамене

Этот файл — **пошаговая инструкция**, как из шаблона «Мой Не Сам» сделать другую тему (например **«Банкетам.Нет»**).

- В коде ищите **`БАНКЕТАМ.НЕТ:`** — короткие подсказки у строк.
- Таблица замен темы: **`THEME_BANQUETAM_NET.md`**.
- Запуск проекта: **`README.md`**.

**Важно:** старые комментарии про клининг **не удаляйте** — они описывают текущий шаблон. Добавляйте свои правки рядом или по гайду ниже.

---

## 1. Карта проекта (что за что отвечает)

```
examTemplate/
├── client/
│   ├── public/images/          ← файлы картинок (PNG/SVG из Figma)
│   ├── src/
│   │   ├── config/images.js    ← имена файлов и alt (НЕ пути вручную в JSX!)
│   │   ├── pages/              ← страницы (один файл ≈ один экран)
│   │   ├── components/         ← общие части (Layout, FormField…)
│   │   ├── components/landing/ ← лендинг: слайдер, футер
│   │   ├── App.jsx             ← URL → какая страница открывается
│   │   ├── api.js              ← все запросы к серверу
│   │   └── utils/validation.js ← проверка полей на форме
│   └── index.html              ← <title> вкладки браузера
├── server/
│   ├── db/schema.sql           ← таблицы
│   ├── db/seed.sql             ← справочник (услуги / помещения)
│   ├── db/init.js              ← админ при npm run db:init
│   ├── routes/                 ← API
│   └── utils/validation.js     ← проверка на сервере (как на клиенте!)
```

### URL → файл страницы

| Адрес | Файл | Задание ДЭ |
|-------|------|------------|
| `/` | `LandingPage.jsx` | лендинг (не в п.1–5, но для защиты) |
| `/register` | `RegisterPage.jsx` | п.1 регистрация |
| `/login` | `LoginPage.jsx` | п.2 вход |
| `/requests` | `RequestsPage.jsx` | п.3 личный кабинет / история |
| `/requests/form` | `RequestFormPage.jsx` | п.4 оформление заявки |
| `/admin` | `AdminPage.jsx` | п.5 админ |

Маршруты прописаны в **`client/src/App.jsx`**.

---

## 2. Как заменить название и тексты (самое частое)

### 2.1. Название сайта в шапке

**Файл:** `client/src/components/Layout.jsx`

Найдите:

```javascript
const brandName = 'Мой Не Сам';        // ← заменить текст в кавычках
const brandTagline = 'Клининг без хлопот';
```

**Лендинг** (отдельная шапка): `client/src/components/landing/LandingLayout.jsx` — там тоже `brandName`.

### 2.2. Заголовок вкладки браузера

**Файл:** `client/index.html`

```html
<title>Мой Не Сам — портал клининговых услуг</title>
```

### 2.3. Тексты на конкретной странице

Откройте файл из `client/src/pages/`. Ищите:

- `<h1>`, `<h2>`, `<p>` — заголовки и абзацы;
- текст внутри `<Link>…</Link>` и `<button>…</button>`;
- `placeholder="..."` у `<input>`.

**Пример** (`RegisterPage.jsx`):

```jsx
<h2 className="text-xl font-bold text-teal-900 mb-1">Регистрация</h2>
<p className="text-sm text-slate-500 mb-6">Все поля обязательны</p>
```

Меняете только русский текст между тегами. **Классы** (`className="..."`) трогайте только если меняете дизайн.

### 2.4. Подписи полей формы

Используется компонент **`FormField`**:

```jsx
<FormField label="ФИО" error={errors.fullName}>
  <input ... />
</FormField>
```

Меняете **`label="..."`**. Для банкетов: `label="Помещение"`, `label="Дата начала банкета"` и т.д.

---

## 3. Картинки: куда класть и как подключить

### 3.1. Куда положить файл

Папка: **`client/public/images/`**

Пример: `client/public/images/logo.png`

В браузере картинка откроется как: **`http://localhost:5173/images/logo.png`**

### 3.2. Зарегистрировать в конфиге (обязательно!)

**Файл:** `client/src/config/images.js`

```javascript
export const IMAGES = {
  logo: {
    file: 'logo.png',              // имя файла в public/images/
    alt: 'Логотип Банкетам.Нет',   // для доступности
  },
  // добавьте новый ключ:
  myBanner: {
    file: 'my-banner.png',
    alt: 'Описание картинки',
  },
};
```

### 3.3. Показать на странице

**Не пишите** `src="/images/logo.png"` напрямую (так тоже можно, но в шаблоне принят единый способ):

```jsx
import PageImage from '../components/PageImage.jsx';

<PageImage imageKey="logo" className="h-9 w-auto" />
```

- `imageKey` — ключ из `IMAGES` (`logo`, `homeHero`, `registerBanner`…).
- `className` — размер и скругление (Tailwind).

### 3.4. Добавить новую картинку с нуля

1. Положите `new-photo.png` в `public/images/`.
2. В `images.js` добавьте блок с ключом, например `newPhoto: { file: 'new-photo.png', alt: '...' }`.
3. На странице: `<PageImage imageKey="newPhoto" className="w-full h-40 object-cover rounded-xl" />`.

### 3.5. Заменить картинку (Figma → PNG)

1. Экспорт из Figma с **тем же именем** (например `register-banner.png`).
2. Замените файл в `public/images/` (перезапишите).
3. В `images.js` поменяйте `file: 'register-banner.svg'` → `file: 'register-banner.png'`.
4. Обновите страницу в браузере (F5).

### 3.6. Слайдер (4 картинки)

**Файлы:** `HeroSlider.jsx`, `images.js`, `public/images/slide-1.png` … `slide-4.png`

В `HeroSlider.jsx`:

```javascript
const SLIDE_KEYS = ['slide1', 'slide2', 'slide3', 'slide4']; // добавить slide4
```

В `images.js` — ключи `slide1`…`slide4`.

Интервал смены:

```javascript
}, 5000); // миллисекунды → для 3 сек: 3000
```

Тексты на слайдах — объект `slideText` в том же файле.

---

## 4. Кнопки и ссылки

### 4.1. Кнопка «отправить форму»

Уже есть на формах:

```jsx
<button type="submit" className="w-full rounded-xl bg-teal-600 text-white py-3 ...">
  Зарегистрироваться
</button>
```

Меняете только текст между тегами. `type="submit"` не убирайте.

### 4.2. Ссылка на другую страницу

```jsx
import { Link } from 'react-router-dom';

<Link to="/register" className="text-teal-700 underline">
  Еще не зарегистрированы? Регистрация
</Link>
```

- `to="/register"` — куда ведёт (должен быть в `App.jsx`).
- Текст внутри `Link` — что видит пользователь.

### 4.3. Добавить новую кнопку-ссылку

Скопируйте блок `Link` выше, вставьте под существующим, поменяйте `to` и текст.

### 4.4. Удалить кнопку

Удалите целиком блок `<button>...</button>` или `<Link>...</Link>` **вместе с обёрткой**, если она только для этой кнопки.

**Пример — убрать «Отменить» в админке** (`AdminPage.jsx`):

Удалите блок:

```jsx
{r.status !== 'cancelled' && (
  <button ...>Отменить</button>
)}
```

И поле «Причина отмены», если отмены больше нет в задании.

### 4.5. Кнопка с действием (без перехода)

```jsx
<button
  type="button"
  onClick={() => updateStatus(r.id, 'completed')}
  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs"
>
  Выполнено
</button>
```

- `onClick` — что выполнить (функция в том же файле).
- Текст кнопки — подпись для пользователя.

Для «Банкетам.Нет» меняете текст на **«Банкет завершен»**, логику `updateStatus` не трогаете.

---

## 5. Как убрать / добавить секцию на странице

Страница — это набор блоков `<section>...</section>` или `<div>...</div>`.

### 5.1. Удалить секцию

Найдите комментарий `{/* --- О клининге --- */}` и удалите **весь** блок от `<section` до `</section>` (или от `<div` до `</div>`).

**Проверка:** в редакторе должен остаться валидный JSX — у каждого открывающего тега есть закрывающий.

### 5.2. Добавить секцию

Скопируйте похожую секцию с другой страницы (например с `LandingPage.jsx`), вставьте в нужное место, поменяйте тексты и `imageKey`.

Шаблон секции:

```jsx
<section className="mx-auto max-w-lg lg:max-w-5xl px-4 py-10">
  <h2 className="text-xl font-bold text-slate-800 mb-4">Заголовок блока</h2>
  <p className="text-sm text-slate-600">Текст блока.</p>
</section>
```

### 5.3. Перенести слайдер в личный кабинет

1. В `RequestsPage.jsx` вверху добавьте импорт:
   ```jsx
   import HeroSlider from '../components/landing/HeroSlider.jsx';
   ```
2. Внутри `return`, после шапки страницы:
   ```jsx
   <HeroSlider />
   ```

---

## 6. Как создать новую страницу с нуля

### Шаг 1. Файл страницы

Создайте `client/src/pages/MyPage.jsx`:

```jsx
/**
 * Описание страницы. URL: /my-page
 */
import Layout from '../components/Layout.jsx';

export default function MyPage() {
  return (
    <Layout variant="default">
      <h1 className="text-xl font-bold">Заголовок</h1>
      <p className="text-slate-600">Содержимое.</p>
    </Layout>
  );
}
```

`variant` для шапки: `default` | `register` | `login` | `dashboard` | `admin` (см. `Layout.jsx`).

### Шаг 2. Маршрут

**Файл:** `App.jsx`

```jsx
import MyPage from './pages/MyPage.jsx';

// внутри <Routes>:
<Route path="/my-page" element={<MyPage />} />
```

Если страница только для вошедших:

```jsx
<Route
  path="/my-page"
  element={
    <ProtectedRoute role="user">
      <MyPage />
    </ProtectedRoute>
  }
/>
```

### Шаг 3. Ссылка на страницу

Где нужно — добавьте `<Link to="/my-page">Текст</Link>`.

---

## 7. Формы: поля, валидация, отправка

### 7.1. Добавить поле в форму

1. В `useState` формы добавьте ключ:
   ```javascript
   const [form, setForm] = useState({
     address: '',
     newField: '', // новое
   });
   ```
2. В JSX:
   ```jsx
   <FormField label="Новое поле" error={errors.newField}>
     <input
       className={inputClass}
       value={form.newField}
       onChange={(e) => setForm((f) => ({ ...f, newField: e.target.value }))}
     />
   </FormField>
   ```
3. В `validateRegistration` / `validateRequestForm` (`client/src/utils/validation.js`) — проверка.
4. То же в `server/utils/validation.js`.
5. В `server/routes/...` — сохранение в SQL (INSERT/UPDATE).

### 7.2. Убрать поле

Обратный порядок: удалите из JSX → из `useState` → из валидации → из API/SQL.

### 7.3. Выпадающий список (select)

Уже есть в `RequestFormPage.jsx`:

```jsx
<select value={form.serviceTypeId} onChange={set('serviceTypeId')}>
  <option value="">— выберите —</option>
  {services.map((s) => (
    <option key={s.id} value={s.id}>{s.name}</option>
  ))}
</select>
```

Список приходит с API `/api/services` из таблицы `service_types` (`seed.sql`).

### 7.4. Дата ДД.ММ.ГГГГ (для «Банкетам.Нет»)

Сейчас: `<input type="datetime-local" />`.

Заменить на:

```jsx
<input
  type="text"
  placeholder="ДД.ММ.ГГГГ"
  value={form.banquetDate}
  onChange={set('banquetDate')}
/>
```

В `validation.js` добавить проверку регуляркой, например `/^\d{2}\.\d{2}\.\d{4}$/`.

На сервере при сохранении — преобразовать строку в дату для PostgreSQL.

---

## 8. База данных и API

### 8.1. Сменить список услуг / помещений

**Файл:** `server/db/seed.sql` — замените `INSERT INTO service_types`.

После изменения: `npm run db:init` (или вручную очистить и вставить).

**Файл:** `client/src/constants/services.js` — массив для лендинга (должен совпадать по смыслу).

### 8.2. Сменить админа

**Файл:** `server/db/init.js` — `login` и `password` в `seedAdmin()`.

Затем: `npm run db:init`.

### 8.3. Сменить подписи статусов

| Где | Что |
|-----|-----|
| `server/routes/requests.js` | `STATUS_LABELS` |
| `server/routes/admin.js` | объект в `statusLabel` |
| `RequestsPage.jsx` | `statusColors` + отображение |
| `AdminPage.jsx` | тексты на кнопках |

Ключи в БД (`new`, `in_progress`, `completed`) можно **не менять** — меняйте только **русские подписи**.

### 8.4. Добавить фильтр в админке (пошагово)

**Сейчас фильтра нет** — только комментарий. Как сделать:

**Вариант А — только на фронте (быстро на экзамене):**

1. `AdminPage.jsx` — состояние:
   ```javascript
   const [filterStatus, setFilterStatus] = useState('all');
   ```
2. Перед списком — `<select>`:
   ```jsx
   <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
     <option value="all">Все</option>
     <option value="new">Новая</option>
     <option value="in_progress">В работе</option>
     <option value="completed">Выполнено</option>
   </select>
   ```
3. Вместо `requests.map` используйте:
   ```javascript
   const visible = filterStatus === 'all'
     ? requests
     : requests.filter((r) => r.status === filterStatus);
   ```
   и `visible.map(...)`.

**Вариант Б — на сервере:** в `admin.js` читать `req.query.status` и добавлять `WHERE r.status = $1` в SQL.

**Сортировка:** `useState sortBy` + `.sort()` по дате или ФИО.

**Пагинация:** `const PAGE = 5`, `page` state, `slice((page-1)*PAGE, page*PAGE)`.

---

## 9. Отзывы (личный кабинет, «Банкетам.Нет»)

Сейчас **не реализовано** — только комментарии.

План:

1. **schema.sql** — поле `review_text TEXT` в `requests` или таблица `reviews`.
2. **API** — `POST /api/requests/:id/review` (только если `status !== 'new'`).
3. **RequestsPage.jsx** — под карточкой заявки textarea + кнопка «Оставить отзыв», если админ уже менял статус.

---

## 10. Цвета и «отличительная черта» раздела

Каждая страница передаёт в Layout свой **`variant`**:

| Страница | variant | Цвет шапки |
|----------|---------|------------|
| Регистрация | `register` | бирюзовая |
| Вход | `login` | тёмная |
| Заявки | `dashboard` | градиент |
| Админ | `admin` | фиолетовая |

Менять цвета: `headerStyles` в `Layout.jsx`.

Кнопки на странице: классы Tailwind `bg-teal-600`, `bg-cyan-600` и т.д. — можно заменить на одну палитру под банкеты (золотой/бордовый).

---

## 11. Чек-лист перед сдачей

- [ ] `npm run db:init` прошёл без ошибок
- [ ] `npm run dev` — сайт открывается
- [ ] Регистрация → вход → заявка → видна в списке
- [ ] Админ видит заявки и меняет статус
- [ ] Картинки в `public/images/` отображаются
- [ ] На ширине 390px в DevTools ничего не обрезано
- [ ] Все тексты соответствуют **вашей** теме задания
- [ ] 3+ коммита в git (по заданию модуля 2/3)

---

## 12. Частые ошибки

| Проблема | Решение |
|----------|---------|
| Картинка не видна | Файл в `public/images/`? Ключ в `images.js`? `imageKey` верный? |
| 404 на API | Запущен ли `npm run dev` из корня? Сервер на :3001? |
| После входа белый экран | F12 → Console; проверьте токен / роль user vs admin |
| Валидация не совпадает | Правьте **и** client, **и** server `validation.js` |
| Список услуг пустой | `npm run db:init`, проверьте `seed.sql` |

---

## 13. Порядок работы на экзамене (60–90 мин)

1. Прочитать задание, открыть **`THEME_BANQUETAM_NET.md`** или свой конспект.
2. `Layout.jsx` + `LandingLayout` — название.
3. `init.js` + `seed.sql` → `npm run db:init`.
4. `validation.js` (×2) — логин/пароль/дата.
5. Все `pages/*.jsx` — тексты и ссылки.
6. `STATUS_LABELS` + админ-кнопки.
7. Картинки Figma → `public/images/` + `images.js`.
8. По оставшемуся времени: фильтр админа, отзывы, 4-й слайд.

Удачи на демоэкзамене.
