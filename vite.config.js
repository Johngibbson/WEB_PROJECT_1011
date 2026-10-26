import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes all asset paths relative, so the built site works on
// GitHub Pages (which serves from a sub-folder) as well as Netlify/Vercel.
export default defineConfig({
  plugins: [react()],
  base: './',
});
