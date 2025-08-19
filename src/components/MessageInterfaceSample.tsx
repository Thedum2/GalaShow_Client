import React, {useMemo, useRef, useState} from "react";
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
import {SampleApi} from "@/bridge/handler/SampleHandler";

type UnityMsg = {
    id: string;
    type: "REQ" | "ACK" | "NTY";
    route: string;
    data: any;
    timestamp: number;
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

    const routeOptions = [
        "SampleHandler_ChangeSphereColor",
        "SampleHandler_CalculateAdd",
        "SampleHandler_CalculateMultiply",
    ];

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

    const sendNTY = () => {
        if (customRoute !== "SampleHandler_ChangeSphereColor") {
            alert("NTY는 ChangeSphereColor만 샘플로 지원합니다.");
            return;
        }
        const data = parseJsonSafely(customData);
        if (typeof data.color !== "string") {
            alert('JSON에 { "color": "#FF006B" } 형태로 넣어주세요.');
            return;
        }
        const id = makeLocalId("r2u");
        const now = Date.now();

        try {
            SampleApi.changeSphereColor(data.color);
            setMessages((prev) => [...prev, {id, type: "NTY", route: customRoute, data, timestamp: now}]);
            setStatusById((prev) => ({...prev, [id]: "success"}));
        } catch (e) {
            setMessages((prev) => [...prev, {id, type: "NTY", route: customRoute, data, timestamp: now}]);
            setStatusById((prev) => ({...prev, [id]: "error"}));
            alert(`NTY 전송 실패: ${String((e as any)?.message ?? e)}`);
        }
    };

    const sendREQ = async () => {
        if (!customRoute) return;
        const data = parseJsonSafely(customData);
        const id = makeLocalId("r2u");
        const now = Date.now();

        // 로컬 로그(pending)
        setMessages((prev) => [...prev, {id, type: "REQ", route: customRoute, data, timestamp: now}]);
        setStatusById((prev) => ({...prev, [id]: "pending"}));
        setIsSending(true);

        const done = (ok: boolean) =>
            setStatusById((prev) => ({...prev, [id]: ok ? "success" : "error"}));

        try {
            if (customRoute === "SampleHandler_CalculateAdd") {
                const {a, b} = data ?? {};
                if (typeof a !== "number" || typeof b !== "number") {
                    throw new Error('JSON에 { "a": number, "b": number } 형태로 넣어주세요.');
                }
                SampleApi.calculateAdd(a, b, () => done(true), () => done(false));
            } else if (customRoute === "SampleHandler_ChangeSphereColor") {
                return sendNTY();
            } else {
                alert("샘플에서는 지정된 라우트만 지원합니다.");
                done(false);
            }
        } catch (e) {
            done(false);
            alert(`REQ 전송 실패: ${String((e as any)?.message ?? e)}`);
        } finally {
            setIsSending(false);
        }
    };

    // === (옵션) 수동 ACK 보내기: 같은 route의 최근 pending U2R REQ를 잡아 ACK ===
    const sendACK = () => {
        if (!customRoute) return;
        const data = parseJsonSafely(customData);
        alert("데모용: 수동 ACK는 U2R REQ 수신 로그가 있을 때만 의미가 있습니다.");
    };

    // ===== 아래는 기존 UI/디자인 그대로 (간단 통계/리스트) =====
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
                            placeholder='{"color":"#FF006B"} 또는 {"a":30,"b":50}'
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            rows={6}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={sendREQ}
                            disabled={isSending || !customRoute}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                            {isSending ? "전송 중..." : "REQ 전송"}
                        </button>
                        <button
                            onClick={sendNTY}
                            disabled={!customRoute}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <MessageCircle size={16} />
                            NTY 전송
                        </button>
                        <button
                            onClick={sendACK}
                            disabled={!customRoute}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <CheckCircle size={16}/>
                            ACK 전송
                        </button>
                    </div>
                </div>

                {/* 우측: 로그/필터 패널 (간단 표) */}
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {messages.filter((m) => getDirectionFromId(m.id) === "R2U").length}
                            </div>
                            <div className="text-sm text-gray-600">R→U</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {messages.filter((m) => getDirectionFromId(m.id) === "U2R").length}
                            </div>
                            <div className="text-sm text-gray-600">U→R</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                                {Object.values(statusById).filter((s) => s === "success").length}
                            </div>
                            <div className="text-sm text-gray-600">Success</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">
                                {Object.values(statusById).filter((s) => s === "error").length}
                            </div>
                            <div className="text-sm text-gray-600">Error</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">
                                {Object.values(statusById).filter((s) => s === "pending").length}
                            </div>
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
