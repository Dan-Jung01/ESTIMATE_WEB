import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/ESTIMATE_WEB/',  // ⚠️ 리포지토리 이름과 동일해야 합니다.
})
// export default defineConfig({ plugins:[react()], server:{ port:5173 } })
