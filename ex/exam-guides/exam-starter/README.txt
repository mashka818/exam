ЭКЗАМЕН БЕЗ ФЛЕШКИ
==================

Флешка не нужна. Шаблон качается с https://www.npmjs.com/ (интернет на экзамене).

1) ДОМА: npm login → npm publish (пакет @mashka818/exam-de-template)
   Подробно: NPM_PACKAGE.md

2) НА ЭКЗАМЕНЕ (проще всего):

   mkdir C:\DE\work
   cd C:\DE\work
   npx @mashka818/exam-de-template@1.0.0 init

   copy server\.env.example server\.env
   npm run db:init
   npm run dev

3) Через npm install — см. EXAM_COMMANDS.txt (способы 2 и 3)

Файл package.json в этой папке — образец для способа 3 (вручную).
Пакет: @mashka818/exam-de-template
