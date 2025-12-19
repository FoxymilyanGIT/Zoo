import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok.io',
      '.ngrok-free.dev'
    ]
  }
})
