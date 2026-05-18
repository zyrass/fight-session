import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  server: {
    port: 3000,
    open: true // Ouvre automatiquement le navigateur au lancement
  },
  build: {
    rollupOptions: {
      // Configuration multi-pages pour que Vite sache regrouper tous nos fichiers HTML
      input: {
        main: resolve(__dirname, 'index.html'),
        createHeroe: resolve(__dirname, 'pages/form/createHeroe.html'),
        fight: resolve(__dirname, 'pages/fight/index.html'),
        shop: resolve(__dirname, 'pages/shop/shopping.html'),
        player: resolve(__dirname, 'pages/player/player.html')
      }
    }
  }
});
