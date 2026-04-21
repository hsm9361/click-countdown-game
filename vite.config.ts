import { defineConfig } from 'vite'

const envPort = process.env.PORT
const port = envPort !== undefined ? Number(envPort) : 5173

export default defineConfig({
  server: {
    port,
    strictPort: true,
  },
})
