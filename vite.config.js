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
          dest: 'build',
        },
      ],
    }),
  ],
});
