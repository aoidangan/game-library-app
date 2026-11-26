import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 주소가 https://<아이디>.github.io/game-library-app/ 이라서
// 배포용 빌드와 빌드 미리보기(npm run preview)에서는 경로 앞에 /game-library-app/을 붙여요. (개발 서버는 /)
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/game-library-app/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: '내 게임 목록',
        short_name: '게임 목록',
        description: '에픽 게임 라이브러리 295개를 검색하고 오늘 할 게임을 골라요.',
        lang: 'ko',
        theme_color: '#4f6bed',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 앱 화면과 games.json은 미리 저장해 두고, 표지는 볼 때마다 저장해서 오프라인에서도 열려요.
        globPatterns: ['**/*.{js,css,html,png,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/covers/'),
            handler: 'CacheFirst',
            options: { cacheName: 'covers', expiration: { maxEntries: 400 } },
          },
        ],
      },
    }),
  ],
}))
