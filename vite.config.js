import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'OUTPOST: Junior Astronaut Mission Trainer',
        short_name: 'OUTPOST',
        description: 'An interactive, gamified training tool for young people who want to be astronauts.',
        theme_color: '#070B18',
        background_color: '#070B18',
        display: 'standalone',
        
      },
      workbox: {
        // Cache all static assets and the NASA image fallbacks
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.nasa\.gov\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nasa-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/apod\.nasa\.gov\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nasa-apod-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});