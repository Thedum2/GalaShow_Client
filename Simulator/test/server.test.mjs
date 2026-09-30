import assert from "node:assert/strict";
import { once } from "node:events";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { createSimulatorServer, validateOutgoing, isAllowedOrigin } = require("../electron/server.cjs");
const WebSocket = require("ws");

let nextPort = 47900;

async function startServer(t) {
    const port = nextPort++;
    const states = [];
    let status;
    const server = createSimulatorServer({ port, onStatus: (s) => { status = s; }, onState: (s) => states.push(s) });
    t.after(() => server.close());
    await new Promise((resolve) => {
        const timer = setInterval(() => { if (status?.listening) { clearInterval(timer); resolve(); } }, 10);
    });
    return { server, port, states, status: () => status };
}

async function connect(port, origin) {
    const ws = new WebSocket(`ws://127.0.0.1:${port}`, { origin });
    await once(ws, "open");
    return ws;
}

test("origins: local dev servers and galashow.cloud only", () => {
    for (const o of ["http://localhost:5173", "http://127.0.0.1:5181", "https://dev.galashow.cloud", "https://galashow.cloud"]) assert.ok(isAllowedOrigin(o), o);
    for (const o of ["https://evil.example", "http://dev.galashow.cloud", "https://galashow.cloud.evil.example", undefined, "null"]) assert.ok(!isAllowedOrigin(o), String(o));
});

test("outgoing messages are validated", () => {
    assert.ok(validateOutgoing({ type: "chat", platform: "chzzk", nickname: "a", content: "참여" }));
    assert.equal(validateOutgoing({ type: "chat", platform: "twitch", nickname: "a", content: "참여" }), null);
    assert.equal(validateOutgoing({ type: "chat", platform: "soop", nickname: " ", content: "참여" }), null);
    assert.ok(validateOutgoing({ type: "batch", messages: [{ platform: "soop", nickname: "b", content: "x" }] }));
    assert.equal(validateOutgoing({ type: "batch", messages: [{ platform: "soop" }] }), null);
    assert.ok(validateOutgoing({ type: "fakeConnection", platforms: ["youtube"] }));
    assert.equal(validateOutgoing({ type: "fakeConnection", platforms: ["x"] }), null);
    assert.equal(validateOutgoing({ type: "eval", code: "1" }), null);
});

test("rejects connections from other origins", async (t) => {
    const { port } = await startServer(t);
    const ws = new WebSocket(`ws://127.0.0.1:${port}`, { origin: "https://evil.example" });
    const [error] = await once(ws, "error");
    assert.match(error.message, /401/);
});

test("broadcasts chat to game pages and relays their state", async (t) => {
    const { server, port, states, status } = await startServer(t);
    const page = await connect(port, "http://localhost:5173");
    page.send(JSON.stringify({ type: "hello", app: "galashow-client", url: "http://localhost:5173/lobby" }));
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(status().clients.length, 1);
    assert.equal(status().clients[0].url, "http://localhost:5173/lobby");

    const received = once(page, "message");
    assert.equal(server.send({ type: "chat", platform: "chzzk", nickname: "별빛왕1", content: "참여" }), 1);
    assert.deepEqual(JSON.parse(String((await received)[0])), { type: "chat", platform: "chzzk", nickname: "별빛왕1", content: "참여" });
    assert.equal(server.send({ type: "chat", platform: "nope", nickname: "x", content: "y" }), -1);

    page.send(JSON.stringify({ type: "state", lobby: { status: "open", participantCount: 1, capacity: 100, excluded: [] } }));
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(states.at(-1).lobby.participantCount, 1);

    page.close();
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(status().clients.length, 0);
});

test("reports a friendly error when the port is taken", async (t) => {
    const { port } = await startServer(t);
    let status;
    const second = createSimulatorServer({ port, onStatus: (s) => { status = s; } });
    t.after(() => second.close());
    await new Promise((r) => setTimeout(r, 100));
    assert.equal(status.listening, false);
    assert.match(status.error, /이미 사용 중/);
});
