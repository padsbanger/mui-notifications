import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'; // For TypeScript declarations
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),  
    dts({ 
      include: ['lib'],
      tsconfigPath: './tsconfig-build.json', 
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
      external: ['react', 'react/jsx-runtime', 'react-dom'], // Don't bundle React
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
