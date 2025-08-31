import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    base: '/',
    publicDir: 'public',
    build: {
        outDir: 'build/react',
    },
    plugins: [
                react(),
        svgr({
            svgrOptions: {
                icon: true,
                titleProp: true,
            },
            include: '**/*.svg',
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'build/unity/',
                    dest: 'build',
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
