import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // This ensures it binds to all network interfaces
    port: 3000, // Or any other port you are using
  },
  plugins: [react()],
})
