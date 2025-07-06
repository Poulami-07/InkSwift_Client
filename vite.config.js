import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { fileURLToPath } from 'url';


// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
 resolve: {
    alias: {
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist'),
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         'pdfjs-worker': ['pdfjs-dist/build/pdf.worker.entry'],
  //       },
  //     },
  //   },
  // },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

// content: [
//   './index.html',
//   './src/**/*.{js,ts,jsx,tsx}',
//   './src/styles/react-pdf.css' // ensure this file is included
// ],
// safelist: [
//   {
//     pattern: /^react-pdf__/,
//   },
// ],
