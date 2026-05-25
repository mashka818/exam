/**
 * Проверка перед npm pack — в архив не должны попасть node_modules и .env
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const bad = [];

for (const sub of ['node_modules', 'client/node_modules', 'server/node_modules', 'client/dist']) {
  if (fs.existsSync(path.join(root, sub))) {
    bad.push(sub);
  }
}

if (fs.existsSync(path.join(root, 'server/.env'))) {
  console.warn('prepack: server/.env есть локально — в .npmignore, в архив не попадёт.');
}

if (bad.length) {
  console.warn('prepack: в проекте есть (в .npmignore, в tgz не войдут):');
  bad.forEach((b) => console.warn(`  - ${b}`));
}

console.log('prepack: ok — запускайте npm pack');
