import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'ws',
      port: 3000,
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3009,
//     hmr: {
//       protocol: 'ws',
//       port: 443,
//     },
//     middlewareMode: true,  // Changed from 'html'
//     watch: {
//       onBeforeWrite(_, res) {
//         res.setHeader(
//           'Content-Security-Policy',
//           `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;`
//         );
//       },
//     },
//   },
//   build: {
//     sourcemap: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//         },
//       },
//     },
//   },
// });

