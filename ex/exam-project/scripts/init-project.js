#!/usr/bin/env node
/**
 * Экзамен: создать exam-project + exam-guides в текущей папке.
 * npx @mashka818/exam-de-template@1.0.0 init
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.pack-tmp']);

function copyTree(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(s, d);
    else {
      if (entry.name === '.env' && s.replace(/\\/g, '/').includes('/server/')) continue;
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
}

const examRoot = process.argv.includes('--here')
  ? process.cwd()
  : process.argv[2]
    ? path.resolve(process.argv[2])
    : process.cwd();

const skipInstall = process.argv.includes('--no-install');

const srcProject = path.join(PACKAGE_ROOT, 'exam-project');
const srcGuides = path.join(PACKAGE_ROOT, 'exam-guides');
const destProject = path.join(examRoot, 'exam-project');
const destGuides = path.join(examRoot, 'exam-guides');

console.log('\n=== exam-de-init ===\n');
console.log(`Папка экзамена: ${examRoot}\n`);

if (!fs.existsSync(srcProject)) {
  console.error('В пакете нет exam-project/. Обновите npm publish.');
  process.exit(1);
}

if (fs.existsSync(destProject) && !process.argv.includes('--force')) {
  console.log('Уже есть exam-project/. Добавьте --force для перезаписи.');
  process.exit(1);
}

console.log('Копирую exam-project/ …');
if (fs.existsSync(destProject)) fs.rmSync(destProject, { recursive: true, force: true });
copyTree(srcProject, destProject);

if (fs.existsSync(srcGuides)) {
  console.log('Копирую exam-guides/ …');
  if (fs.existsSync(destGuides)) fs.rmSync(destGuides, { recursive: true, force: true });
  copyTree(srcGuides, destGuides);
} else {
  console.warn('В пакете нет exam-guides/ — только чистый проект.');
}

if (skipInstall) {
  console.log('\nГотово (--no-install).\n');
  process.exit(0);
}

console.log('\nУстановка зависимостей в exam-project/ …\n');
execSync('npm install', { cwd: destProject, stdio: 'inherit' });
execSync('npm run install:all', { cwd: destProject, stdio: 'inherit' });

console.log('\n=== Готово ===\n');
console.log('  exam-project/  — правите и запускаете здесь');
console.log('  exam-guides/   — шпоры; удалите перед сдачей\n');
console.log('Дальше:');
console.log('  cd exam-project');
console.log('  copy server\\.env.example server\\.env');
console.log('  npm run db:init');
console.log('  npm run dev\n');
