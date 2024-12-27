import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy:{
  //     '/':'http://localhost:5000',
     
  //   }
  // },
  plugins: [react()],
})
