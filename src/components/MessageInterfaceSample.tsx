// src/components/MessageInterfaceSample.tsx
import React, {useEffect, useMemo, useRef, useState} from "react";
import {unityService} from "../bridge/unityService";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    Download,
    Filter,
    MessageCircle,
    MessageSquare,
    Search,
    Send,
    Settings,
    Trash2,
    XCircle
} from "lucide-react";

// 샘플에서 쓰는 메시지 타입(필요한 필드만)
type UnityMsg = {
    id: string;
    type: "REQ" | "ACK" | "NTY";
    route: string;
    data: any;
    timestamp: number;
    ok?: boolean;
};

type LocalStatus = "pending" | "success" | "error";

const MessageInterfaceSample: React.FC<{ className?: string }> = ({className = ""}) => {
    const [messages, setMessages] = useState<UnityMsg[]>([]);
    const [statusById, setStatusById] = useState<Record<string, LocalStatus>>({});
    const seqRef = useRef(0);

    const [customRoute, setCustomRoute] = useState<string>("");
    const [customData, setCustomData] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [filter, setFilter] = useState<"all" | "R2U" | "U2R">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "REQ" | "ACK" | "NTY">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

    // 라우트 옵션(예시)
    const routeOptions = [
        "SampleManager_ChangeSphereColor",
        "SampleManager_ChangeBorderColor",
        "SampleManager_CalculateAdd",
        "SampleManager_CalculateMultiply",
    ];

    // id prefix로 방향 계산
    const getDirectionFromId = (id: string): "R2U" | "U2R" | "UNK" => {
        const p = id?.split("_")[0];
        if (p === "r2u") return "R2U";
        if (p === "u2r") return "U2R";
        return "UNK";
    };
    const getDirectionIcon = (id: string) =>
        getDirectionFromId(id) === "R2U"
            ? <ArrowRight size={16} className="text-blue-500"/>
            : <ArrowLeft size={16} className="text-green-500"/>;

    const getStatusIcon = (status?: LocalStatus) => {
        switch (status) {
            case "success":
                return <CheckCircle size={16} className="text-green-500"/>;
            case "error":
                return <XCircle size={16} className="text-red-500"/>;
            case "pending":
                return <AlertCircle size={16} className="text-yellow-500"/>;
            default:
                return <Clock size={16} className="text-gray-400"/>;
        }
    };

    // 간단한 id 생성기 (우리 프로토콜 형식: r2u|u2r_uuid없는 로컬 시퀀스 기반)
    const makeLocalId = (dir: "r2u" | "u2r") => {
        seqRef.current += 1;
        return `${dir}_local_${Date.now()}_${seqRef.current}`;
    };

    const parseJsonSafely = (raw: string) => {
        const s = raw.trim();
        if (!s) return {};
        try {
            return JSON.parse(s);
        } catch {
            throw new Error("유효한 JSON이 아닙니다.");
        }
    };

    // ===== 우리가 만든 함수만 사용: sendReq / sendNty / sendAck =====

    // REQ: 로컬 로그에 pending 추가 → ACK 수신되면 success/error로 마킹
    const handleSendRequest = async () => {
        if (isSending || !customRoute) return;
        setIsSending(true);
        const reqId = makeLocalId("r2u");
        const now = Date.now();
        const data = parseJsonSafely(customData);

        // REQ 로그 추가(pending)
        setMessages((prev) => [...prev, {id: reqId, type: "REQ", route: customRoute, data, timestamp: now}]);
        setStatusById((prev) => ({...prev, [reqId]: "pending"}));

        try {
            await unityService.sendReq(customRoute, data); // Promise(ACK data)
            // 성공 시 해당 REQ를 success로
            setStatusById((prev) => ({...prev, [reqId]: "success"}));
        } catch (e) {
            setStatusById((prev) => ({...prev, [reqId]: "error"}));
            alert(`REQ 전송 실패: ${String((e as any)?.message ?? e)}`);
        } finally {
            setIsSending(false);
        }
    };

    // NTY: 단방향 → 성공으로 로그
    const handleSendNotification = () => {
        if (!customRoute) return;
        const ntyId = makeLocalId("r2u");
        const now = Date.now();
        const data = parseJsonSafely(customData);

        try {
            unityService.sendNty(customRoute, data);
            setMessages((prev) => [...prev, {id: ntyId, type: "NTY", route: customRoute, data, timestamp: now}]);
            setStatusById((prev) => ({...prev, [ntyId]: "success"}));
        } catch (e) {
            setMessages((prev) => [...prev, {id: ntyId, type: "NTY", route: customRoute, data, timestamp: now}]);
            setStatusById((prev) => ({...prev, [ntyId]: "error"}));
            alert(`NTY 전송 실패: ${String((e as any)?.message ?? e)}`);
        }
    };

    /**
     * ACK: 선택한 route에 대해 "가장 최근 pending U2R REQ"를 찾아 그 id로 회신
     * (주의) U2R REQ는 Unity→React 수신 로그를 내부에 쌓아야 탐지됨.
     *       현재 컴포넌트는 '발신'만 확실히 로그하며,
     *       수신 로그가 없으면 알림을 띄움.
     */
    const handleSendAcknowledge = () => {
        if (!customRoute) return;

        const target = [...messages].reverse().find(
            (m) =>
                m.type === "REQ" &&
                getDirectionFromId(m.id) === "U2R" &&
                statusById[m.id] === "pending" &&
                m.route === customRoute
        );

        if (!target) {
            alert("선택한 route에 대해 대기 중인 U2R REQ가 없습니다.");
            return;
        }

        const data = parseJsonSafely(customData);
        try {
            unityService.sendAck(target.route, target.id, data, true);
            // 낙관적 업데이트
            setStatusById((prev) => ({...prev, [target.id]: "success"}));
            // ACK 자체 로그를 원하면 주석 해제
            // setMessages((prev) => [...prev, { id: makeLocalId("r2u"), type: "ACK", route: target.route, data, timestamp: Date.now(), ok: true }]);
        } catch (e) {
            setStatusById((prev) => ({...prev, [target.id]: "error"}));
            alert(`ACK 전송 실패: ${String((e as any)?.message ?? e)}`);
        }
    };

    // (선택) Unity→React 수신 메시지를 로그에 쌓고 싶다면,
    // unityService에 수신 hook이 있다면 여기에 연결하세요.
    // 아래는 존재할 수도/없을 수도 있는 API를 안전하게 사용하는 예시입니다.
    useEffect(() => {
        const s: any = unityService as any;
        if (typeof s.subscribeIncoming === "function") {
            const unsub = s.subscribeIncoming((env: any) => {
                // env: { type, route, id, data, ok, timestamp }
                const msg: UnityMsg = {
                    id: env.id,
                    type: env.type,
                    route: env.route,
                    data: env.data,
                    timestamp: env.timestamp ?? Date.now(),
                    ok: env.ok,
                };
                setMessages((prev) => [...prev, msg]);

                // 상태 갱신
                setStatusById((prev) => {
                    const next = {...prev};
                    if (env.type === "REQ") {
                        next[env.id] = "pending";
                    } else if (env.type === "ACK") {
                        // R2U REQ에 대한 ACK일 수도 있으니, 동일 id가 있으면 success/error로 덮기
                        next[env.id] = env.ok === false ? "error" : "success";
                    } else if (env.type === "NTY") {
                        next[env.id] = "success";
                    }
                    return next;
                });
            });
            return () => {
                if (typeof unsub === "function") unsub();
            };
        }
    }, []);

    // 필터/검색
    const filtered = useMemo(() => {
        return messages
            .filter((m) => {
                const dir = getDirectionFromId(m.id);
                const okDir = filter === "all" || dir === filter;
                const okType = typeFilter === "all" || m.type === typeFilter;
                const q = searchQuery.trim().toLowerCase();
                const okQ =
                    q === "" ||
                    m.route.toLowerCase().includes(q) ||
                    JSON.stringify(m.data).toLowerCase().includes(q) ||
                    m.id.toLowerCase().includes(q);
                return okDir && okType && okQ;
            })
            .reverse();
    }, [messages, filter, typeFilter, searchQuery]);

    // 통계(로컬 status 기준)
    const stats = useMemo(() => {
        const total = messages.length;
        const r2u = messages.filter((m) => getDirectionFromId(m.id) === "R2U").length;
        const u2r = messages.filter((m) => getDirectionFromId(m.id) === "U2R").length;
        let success = 0, error = 0, pending = 0;
        for (const m of messages) {
            const s = statusById[m.id];
            if (s === "success") success++;
            else if (s === "error") error++;
            else if (s === "pending") pending++;
        }
        return { total, r2u, u2r, success, error, pending };
    }, [messages, statusById]);

    const handleDownloadLogs = () => {
        const dataStr = JSON.stringify(filtered, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `unity-messages-${new Date().toISOString().slice(0, 19)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setMessages([]);
        setStatusById({});
    };

    // ===== UI (기존 디자인 유지) =====
    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            <div className="p-4 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings size={20} />
                    INTERFACE SAMPLE
                </h3>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadLogs}
                        disabled={filtered.length === 0}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        <Download size={14} />
                        Export
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={messages.length === 0}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        <Trash2 size={14} />
                        Clear
                    </button>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 좌측: 송신 패널 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unity Route 선택</label>
                        <select
                            value={customRoute}
                            onChange={(e) => setCustomRoute(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        >
                            <option value="">-- Route를 선택하세요 --</option>
                            {routeOptions.map((route) => (
                                <option key={route} value={route}>
                                    {route}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">JSON 데이터</label>
                        <textarea
                            value={customData}
                            onChange={(e) => setCustomData(e.target.value)}
                            placeholder='{"key":"value","message":"custom data"}'
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            rows={6}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSendRequest}
                            disabled={isSending || !customRoute}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                            {isSending ? "전송 중..." : "REQ 전송"}
                        </button>
                        <button
                            onClick={handleSendNotification}
                            disabled={!customRoute}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <MessageCircle size={16} />
                            NTY 전송
                        </button>
                        <button
                            onClick={() => handleSendAcknowledge()}
                            disabled={!customRoute}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <CheckCircle size={16}/>
                            ACK 전송
                        </button>
                    </div>
                </div>

                {/* 우측: 로그/필터 패널 */}
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.r2u}</div>
                            <div className="text-sm text-gray-600">R→U</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.u2r}</div>
                            <div className="text-sm text-gray-600">U→R</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{stats.success}</div>
                            <div className="text-sm text-gray-600">Success</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{stats.error}</div>
                            <div className="text-sm text-gray-600">Error</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Directions</option>
                            <option value="R2U">React → Unity</option>
                            <option value="U2R">Unity → React</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="REQ">Request</option>
                            <option value="ACK">Acknowledge</option>
                            <option value="NTY">Notification</option>
                        </select>
                        <div className="text-sm text-gray-600 flex items-center">
                            <Filter size={16} className="mr-1" />
                            Showing {filtered.length} of {messages.length}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto border rounded">
                        {filtered.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No messages found</p>
                                <p className="text-sm mt-2">
                                    {messages.length === 0 ? "Unity와 통신을 시작하세요." : "필터를 조정해 보세요."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filtered.map((m) => {
                                    const dir = getDirectionFromId(m.id);
                                    const status = statusById[m.id];
                                    return (
                                        <div key={m.id} className="p-4 hover:bg-gray-50">
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => setExpandedMessage(expandedMessage === m.id ? null : m.id)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        {getDirectionIcon(m.id)}
                                                        <span className={`px-2 py-1 text-xs rounded font-mono ${
                                                            dir === "R2U" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                                                        }`}>{dir}</span>
                                                        <span className={`px-2 py-1 text-xs rounded font-mono ${
                                                            m.type === "REQ" ? "bg-orange-100 text-orange-700"
                                                                : m.type === "ACK" ? "bg-purple-100 text-purple-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                        }`}>{m.type}</span>
                                                        <span
                                                            className="font-mono text-sm text-gray-900">{m.route}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(status)}
                                                        <span className="text-xs text-gray-500">
                              {new Date(m.timestamp).toLocaleTimeString()}
                            </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedMessage === m.id && (
                                                <div className="mt-3 p-3 bg-gray-100 rounded border">
                                                    <h4 className="font-medium text-gray-900 mb-2">Message Data:</h4>
                                                    <pre
                                                        className="text-xs bg-black p-2 rounded border overflow-x-auto text-amber-50">
                            {JSON.stringify(m.data, null, 2)}
                          </pre>
                                                    <div className="mt-2 text-xs text-gray-600">
                                                        <div>Message ID: {m.id}</div>
                                                        <div>Timestamp: {new Date(m.timestamp).toISOString()}</div>
                                                        {status && <div>Status: {status}</div>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MessageInterfaceSample;
