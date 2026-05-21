import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const repoName = 'mui-notifications'
const base = process.env.VITE_DEMO_BASE ?? `/${repoName}/`

export default defineConfig({
  base,
  resolve: {
    alias: {
      'mui-notifications': resolve(__dirname, 'lib/main.ts'),
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    outDir: 'demo-dist',
  },
})
