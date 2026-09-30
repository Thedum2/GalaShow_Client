import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Electron이 file://로 불러오므로 상대 경로로 빌드한다.
export default defineConfig({
    base: "./",
    plugins: [react()],
    build: { outDir: "dist", emptyOutDir: true },
    // 개발 실행 중에도 npm run dist가 release 폴더를 옮길 수 있도록 빌드 산출물은 감시하지 않는다.
    server: { watch: { ignored: ["**/release/**", "**/dist/**"] } },
});
