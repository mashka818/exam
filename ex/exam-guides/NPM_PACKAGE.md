# Шаблон на npm (экзамен **без флешки**)

На экзамене нужны **интернет** и заранее опубликованный пакет на https://www.npmjs.com/

Вы создаёте папку → `npm install` или `npx … init` → шаблон скачивается в `node_modules` → распаковка в проект (или работа из `node_modules`).

Краткая шпаргалка команд: **EXAM_COMMANDS.txt**

---

## 1. Один раз дома: опубликовать пакет

### 1.1. Регистрация

1. Аккаунт: https://www.npmjs.com/~mashka818 (логин `mashka818`)
2. Подтвердите email

### 1.2. Имя пакета (обязательно scoped)

В корне `examTemplate` откройте **`package.json`** и замените `name`:

```json
"name": "@mashka818/exam-de-template",
```

Формат: `@ваш-логин-npm/любое-имя` — так имя почти всегда свободно.

Добавьте (если ещё нет):

```json
"publishConfig": {
  "access": "public"
}
```

### 1.3. Публикация

**Не** из папки `exam-project` (там другой `package.json`). Из **корня** репозитория:

```powershell
cd C:\Users\Masha\Desktop\examTemplate
npm login
npm run publish:npm
```

Если включена 2FA на npm — код из приложения:

```powershell
npm run publish:npm -- --otp=123456
```

Проверка в браузере: `https://www.npmjs.com/package/@mashka818/exam-de-template`

После правок шаблона увеличьте `"version": "1.0.1"` и снова `npm publish`.

### 1.4. Что запомнить на экзамен

- Полное имя пакета: `@mashka818/exam-de-template`
- Версия: `1.0.0` (или актуальная)

---

## 2. На экзамене — одна команда

```powershell
mkdir C:\DE\work
cd C:\DE\work
npx @mashka818/exam-de-template@1.0.0 init
```

Появятся две папки:

```
C:\DE\work\
  exam-project\    ← правите и запускаете
  exam-guides\     ← шпоры (удалить перед сдачей)
```

`init` ставит зависимости в **exam-project**.

Дальше:

```powershell
cd exam-project
copy server\.env.example server\.env
notepad server\.env
npm run db:init
npm run dev
```

Перед сдачей: удалите папку **exam-guides** (уровнем выше: `cd ..` → `rmdir /s /q exam-guides`).

---

## 3. На экзамене — через `npm install` (как вы просили)

### Вариант А: без своего package.json

```powershell
mkdir C:\DE\work
cd C:\DE\work
npm install @mashka818/exam-de-template@1.0.0
npx exam-de-unpack --here
npm install
npm run install:all
```

После первой строки пакет лежит в `node_modules/@mashka818/exam-de-template`.  
`exam-de-unpack` копирует файлы в текущую папку — удобно сдавать проект не из `node_modules`.

### Вариант Б: свой минимальный `package.json`

Скопируйте смысл из **`exam-starter/package.json`** (подставьте свой логин):

```json
{
  "name": "de-exam-work",
  "private": true,
  "dependencies": {
    "@mashka818/exam-de-template": "1.0.0"
  },
  "scripts": {
    "postinstall": "exam-de-unpack --here"
  }
}
```

```powershell
cd C:\DE\work
npm install
npm install
npm run install:all
```

Два раза `npm install`: после первого `postinstall` подменяет `package.json` полным шаблоном.

### Вариант В: только `node_modules` (как у одногруппника)

```powershell
mkdir C:\DE\work
cd C:\DE\work
npm install @mashka818/exam-de-template@1.0.0
cd node_modules\@mashka818\exam-de-template
npm install
npm run install:all
npm run dev
```

Работает, но правки и сдача — внутри `node_modules` (менее удобно).

---

## 4. Команды в пакете (после установки)

| Команда | Действие |
|---------|----------|
| `npx exam-de-init` | Распаковать + `npm install` + `install:all` |
| `npx exam-de-unpack --here` | Только скопировать файлы в папку |
| `npm run install:all` | Зависимости server + client |
| `npm run db:init` | Таблицы и админ |
| `npm run dev` | Сайт + API |

---

## 5. Что на ПК экзамена всё равно нужно

| Программа | Не ставится через npm |
|-----------|------------------------|
| Node.js 18+ | да |
| PostgreSQL | да |
| Интернет | для `npm install` / `npx` |

См. **TECH_STACK.txt**

---

## 6. Локальная проверка перед экзаменом

```powershell
mkdir C:\temp\de-test
cd C:\temp\de-test
npx @mashka818/exam-de-template@1.0.0 init
```

Если открывается http://localhost:5173 — на экзамене будет то же самое.

---

## 7. Сборка .tgz (флешка не нужна)

`npm run pack:template` — только для архива/резервной копии, на экзамене **не обязательно**.

---

## 8. Если `npm publish` ругается

| Ошибка | Решение |
|--------|---------|
| 402 / scope | `"publishConfig": { "access": "public" }` и `npm publish --access public` |
| имя занято | используйте `@логин/имя`, не голое `exam-template-...` |
| не залогинены | `npm login` |
| 403 | подтвердите email на npm |

---

**Пакет:** `@mashka818/exam-de-template`
