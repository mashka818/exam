#!/usr/bin/env node
/**
 * Распаковка шаблона из npm-пакета в папку проекта (экзамен / новый ПК).
 * Вызов: npx exam-de-unpack
 *        npx exam-de-unpack C:\DE\my-project
 *        npx exam-de-unpack --here
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'exam-starter',
  'design',
]);

const SKIP_ROOT_FILES = new Set([
  'exam-template-moy-ne-sam-1.0.0.tgz',
]);

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name);
}

function shouldSkipFile(relPath) {
  const base = path.basename(relPath);
  if (SKIP_ROOT_FILES.has(base)) return true;
  if (base.endsWith('.tgz')) return true;
  const norm = relPath.replace(/\\/g, '/');
  if (norm === 'server/.env') return true;
  return false;
}

function parseTarget() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  if (process.argv.includes('--here') || args.length === 0) {
    return process.cwd();
  }
  return path.resolve(args[0]);
}

function copyRecursive(srcDir, destDir, relative = '') {
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      copyRecursive(src, dest, rel);
      continue;
    }

    if (shouldSkipFile(rel)) continue;

    const destEnv = path.join(destDir, 'server', '.env');
    if (rel === 'server/.env' && fs.existsSync(path.join(destDir, 'server', '.env'))) {
      console.log('  пропуск (уже есть): server/.env');
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const target = parseTarget();
const force = process.argv.includes('--force');

console.log('');
console.log('=== exam-de-unpack: шаблон ДЭ ===');
console.log(`Из: ${PACKAGE_ROOT}`);
console.log(`В:  ${target}`);
console.log('');

if (!fs.existsSync(target)) {
  fs.mkdirSync(target, { recursive: true });
}

const marker = path.join(target, 'client', 'src', 'App.jsx');
if (fs.existsSync(marker) && !force) {
  console.log('В папке уже есть шаблон (client/src/App.jsx).');
  console.log('Чтобы перезаписать: npx exam-de-unpack --force');
  process.exit(0);
}

copyRecursive(PACKAGE_ROOT, target);

console.log('Готово. Дальше в этой папке:');
console.log('  npm install');
console.log('  npm run install:all');
console.log('  настроить server/.env');
console.log('  npm run db:init');
console.log('  npm run dev');
console.log('');
