import { useEffect, useRef, useState } from "react";
import { FlaskConical, Radio, Send, Zap, Users, AlertTriangle, MessageSquare, Plug, Vote, TrainFront } from "lucide-react";
import chzzkIcon from "./assets/chzzk_mini.svg";
import soopIcon from "./assets/soopmini.svg";
import youtubeIcon from "./assets/youtube.svg";
import type { ChatPayload, GameState, PlatformType, ServerStatus } from "./types";
import { ALL_PLATFORMS, CHATTER, JOIN_COMMANDS, Viewer, createViewers, keyOf, randomItem } from "./viewers";

const PLATFORM_ICONS: Record<PlatformType, string> = { chzzk: chzzkIcon, soop: soopIcon, youtube: youtubeIcon };
const PLATFORM_NAMES: Record<PlatformType, string> = { chzzk: "CHZZK", soop: "SOOP", youtube: "YouTube" };
const RECRUIT_LABEL = { ready: "모집 전", open: "모집 중", closed: "마감" } as const;

type LogEntry = { id: number; viewer: Viewer; content: string };

const btn =
    "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white transition-colors " +
    "hover:border-yellow-400/70 hover:bg-yellow-400/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:bg-white/5";
const primaryBtn =
    "rounded-lg border border-yellow-500 bg-yellow-400 px-3 py-2 text-sm font-black text-black transition-colors hover:bg-yellow-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";
const numberInput =
    "w-20 rounded-md border border-white/15 bg-black/50 px-2 py-1.5 text-center text-sm font-bold text-yellow-200 focus:border-yellow-400 focus:outline-none";

function PlatformMark({ platform, size = 18 }: { platform: PlatformType; size?: number }) {
    return <img src={PLATFORM_ICONS[platform]} alt={PLATFORM_NAMES[platform]} width={size} height={size} className="shrink-0" />;
}

function Section({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint?: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <div>
                <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-yellow-300">
                    {icon}
                    {title}
                </h3>
                {hint && <p className="mt-0.5 text-[11px] text-white/55">{hint}</p>}
            </div>
            {children}
        </section>
    );
}

export default function App() {
    const [server, setServer] = useState<ServerStatus | null>(null);
    const [game, setGame] = useState<GameState | null>(null);
    const [platforms, setPlatforms] = useState<PlatformType[]>(ALL_PLATFORMS);
    const [poolSize, setPoolSize] = useState(30);
    const [pool, setPool] = useState<Viewer[]>(() => createViewers(30, ALL_PLATFORMS));
    const [joinedKeys, setJoinedKeys] = useState<Set<string>>(new Set());
    const [batch, setBatch] = useState(5);
    const [rate, setRate] = useState(2);
    const [trickling, setTrickling] = useState(false);
    const [withChatter, setWithChatter] = useState(true);
    const [burst, setBurst] = useState(200);
    const [voteOptions, setVoteOptions] = useState(4);
    const [favorite, setFavorite] = useState(0);
    const [choiceA, setChoiceA] = useState(50);
    const [inputRate, setInputRate] = useState(90);
    const [spread, setSpread] = useState(8);
    const [changeRate, setChangeRate] = useState(15);
    const [manual, setManual] = useState<ChatPayload>({ platform: "chzzk", nickname: "테스트시청자", content: JOIN_COMMANDS[0] });
    const [log, setLog] = useState<LogEntry[]>([]);
    const [sentCount, setSentCount] = useState(0);
    const logId = useRef(0);

    useEffect(() => {
        window.simulator.getStatus().then(setServer);
        const offStatus = window.simulator.onStatus(setServer);
        const offState = window.simulator.onState(setGame);
        return () => {
            offStatus();
            offState();
        };
    }, []);

    const pageCount = server?.clients.length ?? 0;
    const connected = pageCount > 0;
    // 게임 페이지 연결이 끊기면 마지막 상태는 믿을 수 없으므로 지운다.
    useEffect(() => {
        if (!connected) setGame(null);
    }, [connected]);

    const addLog = (viewer: Viewer, content: string) =>
        setLog((prev) => [{ id: ++logId.current, viewer, content }, ...prev].slice(0, 12));

    const send = (viewer: Viewer, content: string, record = true) => {
        window.simulator.send({ type: "chat", ...viewer, content });
        setSentCount((n) => n + 1);
        if (record) addLog(viewer, content);
        if (JOIN_COMMANDS.includes(content.trim())) setJoinedKeys((prev) => new Set(prev).add(keyOf(viewer)));
    };

    const pending = pool.filter((v) => !joinedKeys.has(keyOf(v)));
    const joined = pool.filter((v) => joinedKeys.has(keyOf(v)));
    const joinNext = (count: number) => pending.slice(0, count).forEach((v) => send(v, randomItem(JOIN_COMMANDS)));

    // 초당 rate명씩 참가 신청을 흘려보낸다. 잡담 섞기를 켜면 잡담도 함께 보낸다.
    const pendingRef = useRef(pending);
    pendingRef.current = pending;
    useEffect(() => {
        if (!trickling) return;
        const timer = setInterval(() => {
            const next = pendingRef.current[0];
            if (!next) {
                setTrickling(false);
                return;
            }
            send(next, randomItem(JOIN_COMMANDS));
            if (withChatter && Math.random() < 0.4) send(randomItem(pool), randomItem(CHATTER));
        }, 1000 / Math.max(rate, 0.1));
        return () => clearInterval(timer);
    }, [trickling, rate, withChatter, pool]); // eslint-disable-line react-hooks/exhaustive-deps

    const regeneratePool = () => {
        setTrickling(false);
        setPool(createViewers(poolSize, platforms));
        setJoinedKeys(new Set());
    };

    // 1초 동안 새 시청자 burst명의 메시지(참가 70%, 잡담 30%)를 20번에 나눠 보낸다.
    const runBurst = () => {
        const viewers = createViewers(burst, platforms);
        const chunk = Math.max(1, Math.ceil(burst / 20));
        for (let i = 0; i < 20; i++) {
            const messages = viewers.slice(i * chunk, (i + 1) * chunk)
                .map((v) => ({ ...v, content: Math.random() < 0.7 ? randomItem(JOIN_COMMANDS) : randomItem(CHATTER) }));
            if (messages.length) setTimeout(() => window.simulator.send({ type: "batch", messages }), i * 50);
        }
        setSentCount((n) => n + burst);
        addLog({ platform: platforms[0] ?? "chzzk", nickname: "부하 테스트" }, `${burst}개 메시지 / 1초`);
    };

    // 선택 화면의 민심 투표: 참가한 시청자가 "!번호" 또는 "!투표번호"로 투표한다.
    // favorite를 고르면 절반은 그 번호에 몰아준다(0이면 고르게 무작위).
    const runVotes = () => {
        joined.forEach((v) => {
            const pick = favorite > 0 && Math.random() < 0.5 ? favorite : 1 + Math.floor(Math.random() * voteOptions);
            send(v, Math.random() < 0.5 ? `!${pick}` : `!투표${pick}`, false);
        });
        addLog({ platform: joined[0]?.platform ?? "chzzk", nickname: "게임 투표" }, `${joined.length}명 투표 (1~${voteOptions}${favorite ? `, ${favorite}번 우세` : ""})`);
    };

    // 미니게임 입력(트롤리 A/B): 참가한 시청자가 spread초에 걸쳐 A 또는 B를 채팅한다.
    // 입력률만큼만 입력하고, changeRate만큼은 나중에 반대쪽으로 바꾼다. 시청자 입력은 1 또는 2만 받는다.
    const choiceText = (first: boolean) => (first ? "1" : "2");
    const runChoices = () => {
        let count = 0;
        let aCount = 0;
        joined.forEach((v) => {
            if (Math.random() * 100 >= inputRate) return;
            const pickA = Math.random() * 100 < choiceA;
            count++;
            if (pickA) aCount++;
            const at = Math.random() * spread * 1000;
            setTimeout(() => send(v, choiceText(pickA), false), at);
            if (Math.random() * 100 < changeRate) {
                setTimeout(() => send(v, choiceText(!pickA), false), at + (spread * 1000 - at) * Math.random());
            }
        });
        addLog({ platform: joined[0]?.platform ?? "chzzk", nickname: "미니게임 입력" },
            `${count}명 입력 (1번 ${aCount} · 2번 ${count - aCount}, ${spread}초, 변경 ${changeRate}%)`);
    };
    const PHASE_LABEL: Record<string, string> = {
        READY: "준비", SETUP: "준비", PRESENT: "문제 공개", INPUT: "입력 중", WAIT: "입력 마감", EXECUTE: "판정", REVEAL: "결과 발표", CLEANUP: "정리",
    };
    const STATUS_LABEL: Record<string, string> = {
        idle: "대기", loading: "Unity 로딩", initializing: "참가자 등록", ready: "시작 대기", running: "진행 중",
        completed: "완료", unsupported: "Unity 미지원 게임", error: "오류",
    };
    const gameInfo = game?.game;
    const inputOpen = gameInfo?.phase === "INPUT";

    const excluded = game?.lobby.excluded ?? [];
    const edgeCases: { label: string; disabled?: boolean; run: () => void }[] = [
        { label: "중복 신청", disabled: joined.length === 0, run: () => send(randomItem(joined), randomItem(JOIN_COMMANDS)) },
        {
            label: "같은 닉네임·다른 플랫폼",
            disabled: joined.length === 0,
            run: () => {
                const v = randomItem(joined);
                send({ platform: randomItem(ALL_PLATFORMS.filter((p) => p !== v.platform)), nickname: v.nickname }, randomItem(JOIN_COMMANDS));
            },
        },
        {
            label: "제외된 사람 재신청",
            disabled: excluded.length === 0,
            run: () => {
                const [platform, ...rest] = randomItem(excluded).split(":");
                send({ platform: platform as PlatformType, nickname: rest.join(":") }, randomItem(JOIN_COMMANDS));
            },
        },
        { label: "명령어 아닌 채팅", run: () => send(randomItem(pool), randomItem(CHATTER)) },
    ];

    const connections = game?.connections;
    const fakeConnected = ALL_PLATFORMS.filter((p) => connections?.[p] === "fake");
    const toggleFake = (p: PlatformType) => {
        const next = fakeConnected.includes(p) ? fakeConnected.filter((x) => x !== p) : [...fakeConnected, p];
        window.simulator.send({ type: "fakeConnection", platforms: next });
    };
    const togglePlatform = (p: PlatformType) =>
        setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : ALL_PLATFORMS.filter((x) => prev.includes(x) || x === p)));

    return (
        <div className="flex h-full flex-col">
            <header className="shrink-0 border-b border-yellow-500/40 bg-black/60 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FlaskConical size={20} className="text-yellow-300" />
                        <h1 className="text-lg font-black">GalaShow 시뮬레이터</h1>
                    </div>
                    <span className="text-[11px] text-white/55">보낸 메시지 {sentCount}</span>
                </div>
                <div className={`mt-2 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                    server?.error ? "bg-red-500/15 text-red-200" : connected ? "bg-green-500/15 text-green-200" : "bg-white/5 text-white/70"
                }`}>
                    <Plug size={14} />
                    {server?.error
                        ? server.error
                        : connected
                            ? `게임 페이지 ${pageCount}개 연결됨 · ${server?.clients[0]?.url || server?.clients[0]?.origin}`
                            : `게임 페이지 연결 대기 중 (ws://127.0.0.1:${server?.port ?? 47800})`}
                </div>
                {!connected && !server?.error && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/50">
                        Client 개발 서버(npm run dev)나 개발 배포 주소 뒤에 <b className="text-yellow-200">?sim</b>을 붙여 열면 자동으로 연결됩니다.
                    </p>
                )}
            </header>

            <main className="flex-1 overflow-y-auto p-3.5">
                <div className={`flex flex-col gap-3 ${connected ? "" : "pointer-events-none opacity-40"}`}>
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-2.5 text-center text-[11px] text-white/70">
                        <div><div className="text-xl font-black text-yellow-300">{game ? `${game.lobby.participantCount}/${game.lobby.capacity}` : "-"}</div>참가자</div>
                        <div><div className="text-xl font-black text-white">{game ? RECRUIT_LABEL[game.lobby.status] : "-"}</div>모집 상태</div>
                        <div><div className="text-xl font-black text-white">{pending.length}</div>대기 시청자</div>
                    </div>

                    <Section icon={<Radio size={13} />} title="채팅 연결 흉내" hint="방송 없이 로비 시작 조건(채팅 연결)을 통과시킵니다.">
                        <div className="flex gap-2">
                            {ALL_PLATFORMS.map((p) => {
                                const state = connections?.[p] ?? "off";
                                return (
                                    <button key={p} type="button" disabled={state === "real"} onClick={() => toggleFake(p)}
                                        title={state === "real" ? "실제로 연결된 계정입니다" : undefined}
                                        className={`${btn} flex flex-1 items-center justify-center gap-1.5 ${state === "fake" ? "!border-green-400 !bg-green-500/15" : ""}`}>
                                        <PlatformMark platform={p} />
                                        {state === "real" ? "실제 연결" : state === "fake" ? "연결됨" : "끊김"}
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    <Section icon={<Users size={13} />} title="시청자 풀" hint="참가 신청에 쓸 가짜 시청자를 만듭니다.">
                        <div className="flex flex-wrap items-center gap-2">
                            {ALL_PLATFORMS.map((p) => (
                                <button key={p} type="button" onClick={() => togglePlatform(p)} title={PLATFORM_NAMES[p]}
                                    className={`${btn} !px-2 ${platforms.includes(p) ? "!border-yellow-400" : "opacity-40"}`}>
                                    <PlatformMark platform={p} />
                                </button>
                            ))}
                            <input type="number" min={1} max={2000} value={poolSize}
                                onChange={(e) => setPoolSize(Math.max(1, Math.min(2000, Number(e.target.value) || 1)))} className={numberInput} />
                            <span className="text-sm">명</span>
                            <button type="button" onClick={regeneratePool} className={btn}>다시 만들기</button>
                        </div>
                    </Section>

                    <Section icon={<Send size={13} />} title="참가 신청">
                        <div className="flex items-center gap-2">
                            <input type="number" min={1} value={batch} onChange={(e) => setBatch(Math.max(1, Number(e.target.value) || 1))} className={numberInput} />
                            <button type="button" onClick={() => joinNext(batch)} disabled={pending.length === 0} className={primaryBtn}>명 한 번에 신청</button>
                            <button type="button" onClick={() => joinNext(pending.length)} disabled={pending.length === 0} className={btn}>남은 {pending.length}명 전부</button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">초당</span>
                            <input type="number" min={0.2} step={0.5} value={rate} onChange={(e) => setRate(Math.max(0.2, Number(e.target.value) || 1))} className={numberInput} />
                            <span className="text-sm">명씩</span>
                            <button type="button" onClick={() => setTrickling((v) => !v)} disabled={!trickling && pending.length === 0}
                                className={trickling ? `${btn} !border-red-400 !bg-red-500/20` : primaryBtn}>
                                {trickling ? "멈추기" : "흘려보내기"}
                            </button>
                            <label className="flex items-center gap-1 text-sm">
                                <input type="checkbox" checked={withChatter} onChange={(e) => setWithChatter(e.target.checked)} className="accent-yellow-400" />
                                잡담 섞기
                            </label>
                        </div>
                    </Section>

                    <Section icon={<AlertTriangle size={13} />} title="예외 상황">
                        <div className="grid grid-cols-2 gap-2">
                            {edgeCases.map((c) => (
                                <button key={c.label} type="button" onClick={c.run} disabled={c.disabled} className={btn}>{c.label}</button>
                            ))}
                        </div>
                    </Section>

                    <Section icon={<Zap size={13} />} title="부하 테스트" hint="새 시청자의 메시지(참가 70%, 잡담 30%)를 1초 동안 보냅니다.">
                        <div className="flex items-center gap-2">
                            <input type="number" min={10} max={5000} step={50} value={burst}
                                onChange={(e) => setBurst(Math.max(10, Math.min(5000, Number(e.target.value) || 10)))} className={numberInput} />
                            <span className="text-sm">개</span>
                            <button type="button" onClick={runBurst} className={primaryBtn}>보내기</button>
                        </div>
                    </Section>

                    <Section icon={<Vote size={13} />} title="게임 투표" hint="선택 화면에서 참가한 시청자가 !번호 또는 !투표번호로 투표합니다.">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">후보</span>
                            <input type="number" min={1} max={9} value={voteOptions}
                                onChange={(e) => setVoteOptions(Math.max(1, Math.min(9, Number(e.target.value) || 1)))} className={numberInput} />
                            <span className="text-sm">개 · 우세</span>
                            <select value={favorite} onChange={(e) => setFavorite(Number(e.target.value))}
                                className="rounded-md border border-white/15 bg-black/50 px-1.5 py-1.5 text-sm focus:border-yellow-400 focus:outline-none">
                                <option value={0}>없음</option>
                                {Array.from({ length: voteOptions }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}번</option>)}
                            </select>
                            <button type="button" onClick={runVotes} disabled={joined.length === 0} className={primaryBtn}>
                                참가자 {joined.length}명 투표
                            </button>
                        </div>
                    </Section>

                    <Section icon={<TrainFront size={13} />} title="미니게임 입력 (트롤리 1/2)"
                        hint="참가한 시청자가 입력 단계에 1 또는 2를 채팅합니다. 입력 단계가 아니면 Client가 Unity로 보내지 않습니다.">
                        <div className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${inputOpen ? "bg-green-500/15 text-green-200" : "bg-white/5 text-white/70"}`}>
                            {gameInfo
                                ? `${gameInfo.gameName ?? "-"}${gameInfo.practice ? " (연습)" : ""} · ${STATUS_LABEL[gameInfo.status] ?? gameInfo.status}${gameInfo.phase ? ` · ${PHASE_LABEL[gameInfo.phase] ?? gameInfo.phase}` : ""} · 생존 ${gameInfo.survivorCount}명 · 전달 ${gameInfo.forwardedInputs}건`
                                : "게임 진행 정보 없음 (Tutorial 화면에서 게임을 시작하세요)"}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span>1번</span>
                            <input type="number" min={0} max={100} value={choiceA}
                                onChange={(e) => setChoiceA(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className={numberInput} />
                            <span>% · 입력률</span>
                            <input type="number" min={0} max={100} value={inputRate}
                                onChange={(e) => setInputRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className={numberInput} />
                            <span>%</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <input type="number" min={0} max={60} value={spread}
                                onChange={(e) => setSpread(Math.max(0, Math.min(60, Number(e.target.value) || 0)))} className={numberInput} />
                            <span>초에 걸쳐 · 변경</span>
                            <input type="number" min={0} max={100} value={changeRate}
                                onChange={(e) => setChangeRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className={numberInput} />
                            <span>%</span>
                        </div>
                        <button type="button" onClick={runChoices} disabled={joined.length === 0} className={primaryBtn}>
                            참가자 {joined.length}명 1/2 입력{inputOpen ? "" : " (입력 단계 아님)"}
                        </button>
                    </Section>

                    <Section icon={<MessageSquare size={13} />} title="직접 입력">
                        <div className="flex items-center gap-2">
                            <select value={manual.platform} onChange={(e) => setManual({ ...manual, platform: e.target.value as PlatformType })}
                                className="rounded-md border border-white/15 bg-black/50 px-1.5 py-1.5 text-sm focus:border-yellow-400 focus:outline-none">
                                {ALL_PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM_NAMES[p]}</option>)}
                            </select>
                            <input value={manual.nickname} onChange={(e) => setManual({ ...manual, nickname: e.target.value })} placeholder="닉네임"
                                className="w-28 rounded-md border border-white/15 bg-black/50 px-2 py-1.5 text-sm focus:border-yellow-400 focus:outline-none" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input value={manual.content} onChange={(e) => setManual({ ...manual, content: e.target.value })} placeholder="메시지"
                                onKeyDown={(e) => e.key === "Enter" && manual.nickname.trim() && send(manual, manual.content)}
                                className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/50 px-2 py-1.5 text-sm focus:border-yellow-400 focus:outline-none" />
                            <button type="button" disabled={!manual.nickname.trim()} onClick={() => send(manual, manual.content)} className={primaryBtn}>전송</button>
                        </div>
                    </Section>

                    <Section icon={<MessageSquare size={13} />} title="최근 보낸 채팅">
                        {log.length === 0 ? (
                            <p className="text-xs text-white/50">아직 보낸 채팅이 없습니다.</p>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {log.map((entry) => (
                                    <div key={entry.id} className="flex items-center gap-1.5 text-xs">
                                        <PlatformMark platform={entry.viewer.platform} size={14} />
                                        <span className="max-w-[150px] truncate font-bold text-white/90">{entry.viewer.nickname}</span>
                                        <span className="truncate text-white/60">{entry.content}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>
            </main>
        </div>
    );
}
