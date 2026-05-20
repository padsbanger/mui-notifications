import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'; // For TypeScript declarations
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),  
    dts({ 
      include: ['lib'],
      tsconfigPath: './tsconfig-build.json',
      insertTypesEntry: true,
     })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'MuiNotifications',
      fileName: (format) => `mui-notifications.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/system',
        '@mui/styled-engine',
        '@mui/utils',
        '@mui/base',
        '@emotion/react',
        '@emotion/styled',
        '@emotion/cache',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    copyPublicDir: false, // Optional
  },
})
