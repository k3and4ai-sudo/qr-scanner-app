import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages デプロイ対応 (リポジトリ名ベースの相対パスベースパス設定)
  base: './',
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
