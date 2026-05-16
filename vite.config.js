import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { imageProxyPlugin } from './vite-image-proxy.js'

function apifyProxy(apifyToken) {
  if (!apifyToken) return undefined
  return {
    '/api/apify': {
      target: 'https://api.apify.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/apify/, ''),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Authorization', `Bearer ${apifyToken}`)
        })
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Só APIFY_TOKEN (sem prefixo VITE_) — nunca entra no bundle do browser
  const env = loadEnv(mode, process.cwd(), '')
  const apifyToken = env.APIFY_TOKEN

  return {
    plugins: [react(), imageProxyPlugin()],
    server: {
      proxy: apifyProxy(apifyToken),
    },
    preview: {
      proxy: apifyProxy(apifyToken),
    },
  }
})
