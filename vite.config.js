import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { getApplicationConfig } from './sharedUtils/getConfig'

const { analytics } = getApplicationConfig()
const { gtmPropertyId, localIdentifier } = analytics
const { enabled, propertyId } = localIdentifier

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    ViteEjsPlugin({
      gtmPropertyId,
      environment: process.env.NODE_ENV || 'development',
      gaPropertyId: propertyId,
      includeDevGoogleAnalytics: enabled
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'static/src')
      }
    ]
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill()
      ]
    }
  },
  css: {
    devSourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test-setup.js',
    clearMocks: true,
    coverage: {
      enabled: true,
      include: [
        'serverless/src/**/*.js',
        'static/src/**/*.js',
        'static/src/**/*.jsx'
      ],
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'clover', 'json'],
      reportOnFailure: true
    }
  }
})
