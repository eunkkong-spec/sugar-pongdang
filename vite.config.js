import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  // 빌드 결과를 index.html 한 파일로 묶어 더블클릭으로 열 수 있게
  plugins: [react(), viteSingleFile()],
  base: './',
  // 슈가퐁당 전용 포트 (다른 프로젝트 5173과 겹치지 않게)
  server: {
    port: 5180,
    strictPort: true,
    open: true,
  },
})
