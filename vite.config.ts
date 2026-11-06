import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Only env vars starting with this reach the browser (`import.meta.env`), and they end up in
  // the public bundle: never name a secret CHECKLIST_<something>. Vite's default is "VITE_".
  envPrefix: 'CHECKLIST_',
  server: {
    port: 3000,
  },
});
