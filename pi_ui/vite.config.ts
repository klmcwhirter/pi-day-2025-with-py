import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/extension#readme
    */
    // devtools(),
    solidPlugin(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 9000,
  },
  build: {
    target: 'esnext',
  },
});
