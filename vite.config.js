import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import path from "path";
import svgr from "vite-plugin-svgr";

// 개발 서버에 PolyChat 중계 서버를 /polychat 경로로 내장한다.
// 자격증명은 ../PolyChat/.env.local(없으면 이 저장소의 .env.local)의 CHZZK_*, SOOP_*, YOUTUBE_* 값을 쓴다.
function polychatRelay() {
    return {
        name: 'polychat-relay',
        apply: 'serve',
        async configureServer(server) {
            const {root, mode} = server.config;
            const env = {
                ...loadEnv(mode, path.resolve(root, '../PolyChat'), ''),
                ...loadEnv(mode, root, ''),
            };
            try {
                const {createPolyChatHandler, relayOptionsFromEnv} = await import('polychat-bridge/server');
                const handler = createPolyChatHandler(relayOptionsFromEnv(env));
                server.middlewares.use('/polychat', handler);
                if (!env.CHZZK_CLIENT_ID && !env.SOOP_CLIENT_ID && !env.YOUTUBE_CLIENT_ID) {
                    server.config.logger.warn('[polychat-relay] 플랫폼 자격증명이 없습니다. ../PolyChat/.env.local을 확인하세요.');
                }
            } catch (error) {
                server.config.logger.error(`[polychat-relay] 중계 서버를 시작하지 못했습니다. npm ci로 polychat-bridge를 설치하세요. (${error.message})`);
            }
        },
    };
}

export default defineConfig({
    base: '/',
    publicDir: 'public',
    build: {
        outDir: 'build/react',
    },
    plugins: [
        polychatRelay(),
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
                    src: 'build/unity/WebGL.*',
                    dest: 'build/unity',
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
            events: 'events',
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
    },
});
