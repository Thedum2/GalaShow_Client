// API 미니게임 → Unity RGF 요청 변환 (src/game/minigamePlugins.ts)
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { transform } from "esbuild";

async function loadModule() {
    const source = await readFile(new URL("../src/game/minigamePlugins.ts", import.meta.url), "utf8");
    const { code } = await transform(source, { loader: "ts", format: "esm" });
    const dir = await mkdtemp(join(tmpdir(), "galashow-test-"));
    const file = join(dir, "minigamePlugins.mjs");
    await writeFile(file, code);
    return import(pathToFileURL(file).href);
}

const m = await loadModule();

const trolleyGameData = {
    pluginId: "galashow.trolley",
    rule: { noInput: "eliminate", allEliminated: "all_survive", hostChoice: { ifMissing: "random" } },
    content: {
        dilemmas: [
            { id: "d1", title: "T1", description: "D1", choices: [{ id: "A", label: "a1" }, { id: "B", label: "b1" }] },
            { id: "d2", title: "T2", description: "D2", choices: [{ id: "A", label: "a2" }, { id: "B", label: "b2" }] },
            { id: "bad", title: "3개", choices: [{ id: "A" }, { id: "B" }, { id: "C" }] },
        ],
    },
};

test("pluginId는 game_data에서 읽고 없으면 null", () => {
    assert.equal(m.resolvePluginId(trolleyGameData), "galashow.trolley");
    assert.equal(m.resolvePluginId({ sampleOnly: true }), null);
    assert.equal(m.resolvePluginId(null), null);
    assert.equal(m.resolvePluginId({ pluginId: "  " }), null);
});

test("phase_data ms → 초, 0·누락은 기본값, 트롤리 최소 시간 보장", () => {
    const d = m.toPhaseDuration({ READY: 2000, SETUP: 1500, PRESENT: 800, INPUT: 8000, WAIT: 0, EXECUTE: 800, REVEAL: 2500 }, "galashow.trolley");
    assert.deepEqual(Object.keys(d), ["READY", "SETUP", "PRESENT", "INPUT", "WAIT", "EXECUTE", "REVEAL", "CLEANUP"]);
    assert.equal(d.READY, 2);
    assert.equal(d.SETUP, 1.5);
    assert.equal(d.INPUT, 8);
    assert.equal(d.PRESENT, 5);   // 최소 5초
    assert.equal(d.WAIT, -1);     // 0 → 트롤리 기본: 무한 대기(호스트 선택)
    assert.equal(d.REVEAL, 8);    // 최소 8초
    assert.equal(d.CLEANUP, 1.5); // 누락 → 기본
    const other = m.toPhaseDuration({ INPUT: 1234, WAIT: -1 }, "other.game");
    assert.equal(other.INPUT, 1.2);
    assert.equal(other.WAIT, -1);  // -1은 무한 대기로 그대로
    assert.equal(m.toPhaseDuration({ WAIT: -1, REVEAL: -1 }, "galashow.trolley").REVEAL, -1); // 최소 시간 미적용
});

test("참가자 → playerIdx 1부터, 양방향 매핑", () => {
    const map = m.buildPlayerMapping([{ id: "chzzk:가", nickname: "가" }, { id: "soop:나", nickname: "나" }]);
    assert.deepEqual(map.playerInfo, [
        { playerIdx: 1, playerType: "human", playerName: "가" },
        { playerIdx: 2, playerType: "human", playerName: "나" },
    ]);
    assert.equal(map.idByIdx[2], "soop:나");
    assert.equal(map.idxById["chzzk:가"], 1);
});

test("트롤리 gameData: 안 나온 문항 우선, 선택지 2개만, rule 변환", () => {
    const first = m.buildTrolleyGameData(trolleyGameData, [], () => 0);
    assert.equal(first.contentId, "d1");
    assert.deepEqual(first.gameData.choices, [
        { id: "A", label: "a1", description: "" },
        { id: "B", label: "b1", description: "" },
    ]);
    assert.deepEqual(first.gameData.rule, { noInput: "eliminate", allEliminated: "all_survive", hostChoiceIfMissing: "random" });
    const noRule = m.buildTrolleyGameData({ content: trolleyGameData.content }, [], () => 0);
    assert.equal(noRule.gameData.rule.noInput, "random"); // 기본: 미입력 자동 선택

    const second = m.buildTrolleyGameData(trolleyGameData, ["d1"], () => 0);
    assert.equal(second.contentId, "d2");

    const exhausted = m.buildTrolleyGameData(trolleyGameData, ["d1", "d2"], () => 0.99);
    assert.equal(exhausted.contentId, "d2");

    assert.throws(() => m.buildTrolleyGameData({ content: { dilemmas: [] } }, []));
});

test("buildGameData: 변환 규칙 없는 게임은 그대로 전달", () => {
    const raw = { foo: 1 };
    assert.deepEqual(m.buildGameData("other.game", raw, []), { gameData: raw, contentId: null });
    assert.equal(m.buildGameData("galashow.trolley", trolleyGameData, [], () => 0).contentId, "d1");
});
