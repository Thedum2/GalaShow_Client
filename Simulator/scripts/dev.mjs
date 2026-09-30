// 개발 실행: Vite 개발 서버를 띄운 뒤 그 주소로 Electron을 실행한다. Electron을 닫으면 함께 종료한다.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const electronPath = require("electron");

const vite = await createServer({ server: { port: 5190, strictPort: true } });
await vite.listen();
const url = `http://localhost:${vite.config.server.port}/`;

const electron = spawn(electronPath, ["."], {
    stdio: "inherit",
    env: { ...process.env, VITE_DEV_SERVER_URL: url },
});
electron.on("exit", async (code) => {
    await vite.close();
    process.exit(code ?? 0);
});
