import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {viteStaticCopy} from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'build/react',
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'build/unity/',
          //unity/는 자동으로 생성 ,(최종 경로 build/unity)
          dest: 'build',
        },
      ],
    }),
  ],
});
