/**
 * =============================================================================
 * ФАЙЛ: client/vite.config.js
 * Порт 5173. proxy /api → :3001 (если сменили PORT в server/.env — поменять target)
 * =============================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * =============================================================================
 * vite.config.js — СБОРКА И DEV-СЕРВЕР ФРОНТА
 * =============================================================================
 * port: 5173 — адрес сайта http://localhost:5173
 * proxy /api → http://localhost:3001 — поэтому в api.js пишем fetch('/api/...')
 *
 * Картинки: всё из client/public/ отдаётся как /имя-файла (папка images → /images/...)
 *
 * Если сменили PORT в server/.env (например 3002) — поменяйте target ниже.
 * production build: npm run build → папка client/dist
 *
 * GUIDE_PAGES.md §3.1
 * =============================================================================
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
