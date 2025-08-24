import React, { useMemo, useRef, useState, useEffect } from "react";
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
import { SampleApi } from "@/bridge/handler/SampleHandler";
import {Direction, LocalStatus, UnityMsg, UnityMsgType} from "@/types/bridge";

const MessageInterfaceSample: React.FC<{ className?: string }> = ({ className = "" }) => {
    const [messages, setMessages] = useState<UnityMsg[]>([]);
    const [customRoute, setCustomRoute] = useState<string>("");
    const [customData, setCustomData] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [filter, setFilter] = useState<"all" | Direction>("all");
    const [typeFilter, setTypeFilter] = useState<"all" | UnityMsgType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const seqRef = useRef(0);

    const routeOptions = [
        "SampleHandler_ChangeSphereColor",
        "SampleHandler_CalculateAdd",
        "SampleHandler_CalculateMultiply",
    ];

    const getDirectionIcon = (d: Direction) =>
        d === "R2U" ? <ArrowRight size={16} className="text-blue-500" /> : <ArrowLeft size={16} className="text-green-500" />;

    const getStatusIcon = (status?: LocalStatus) => {
        switch (status) {
            case "success":
                return <CheckCircle size={16} className="text-green-500" />;
            case "error":
                return <XCircle size={16} className="text-red-500" />;
            case "pending":
                return <AlertCircle size={16} className="text-yellow-500" />;
            default:
                return <Clock size={16} className="text-gray-400" />;
        }
    };

    const parseJsonSafely = (raw: string) => {
        const s = raw.trim();
        if (!s) return {};
        return JSON.parse(s);
    };

    const sendNTY = () => {
        if (customRoute !== "SampleHandler_ChangeSphereColor") {
            alert("NTY는 ChangeSphereColor만 샘플로 지원합니다.");
            return;
        }
        const data = parseJsonSafely(customData);
        if (typeof (data as any).color !== "string") {
            alert('JSON에 { "color": "#FF006B" } 형태로 넣어주세요.');
            return;
        }
        try {
            SampleApi.changeSphereColor((data as any).color);
            setMessages((prev) => [...prev, { type: "NTY", route: customRoute, data, direction: "R2U", status: "success" }]);
        } catch {
            setMessages((prev) => [...prev, { type: "NTY", route: customRoute, data, direction: "R2U", status: "error" }]);
            alert("NTY 전송 실패");
        }
    };

    const sendREQ = async () => {
        if (!customRoute) return;
        const data = parseJsonSafely(customData);
        setIsSending(true);
        const newIndex = messages.length;
        setMessages((prev) => [...prev, { type: "REQ", route: customRoute, data, direction: "R2U", status: "pending" }]);
        const setStatus = (s: LocalStatus) =>
            setMessages((prev) => {
                const next = prev.slice();
                if (next[newIndex]) next[newIndex] = { ...next[newIndex], status: s };
                return next;
            });
        try {
            if (customRoute === "SampleHandler_CalculateAdd") {
                const { a, b } = (data as any) ?? {};
                if (typeof a !== "number" || typeof b !== "number") throw new Error();
                SampleApi.calculateAdd(
                    a,
                    b,
                    () => setStatus("success"),
                    () => setStatus("error")
                );
            } else if (customRoute === "SampleHandler_ChangeSphereColor") {
                sendNTY();
            } else {
                alert("샘플에서는 지정된 라우트만 지원합니다.");
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setIsSending(false);
        }
    };

    const sendACK = () => {
        if (!customRoute) return;
        parseJsonSafely(customData);
        alert("데모용: 수동 ACK는 U2R REQ 수신 로그가 있을 때만 의미가 있습니다.");
    };

    useEffect(() => {
        const handler = (e: MessageEvent) => {
            const p = e.data;
            if (!p || (!p.route && !p.type)) return;
            const msg: UnityMsg = {
                type: p.type as UnityMsgType,
                route: String(p.route ?? ""),
                data: p.data ?? {},
                direction: (p.direction as Direction) || "U2R",
                status: p.type === "ACK" || p.type === "NTY" ? "success" : undefined,
            };
            setMessages((prev) => [...prev, msg]);
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    const filtered = useMemo(() => {
        const pairs = messages.map((m, idx) => ({ m, idx }));
        return pairs
            .filter(({ m }) => {
                const okDir = filter === "all" || m.direction === filter;
                const okType = typeFilter === "all" || m.type === typeFilter;
                const q = searchQuery.trim().toLowerCase();
                const okQ =
                    q === "" ||
                    m.route.toLowerCase().includes(q) ||
                    JSON.stringify(m.data).toLowerCase().includes(q);
                return okDir && okType && okQ;
            })
            .reverse();
    }, [messages, filter, typeFilter, searchQuery]);

    const total = messages.length;
    const r2u = messages.filter((m) => m.direction === "R2U").length;
    const u2r = messages.filter((m) => m.direction === "U2R").length;
    const success = messages.filter((m) => m.status === "success").length;
    const error = messages.filter((m) => m.status === "error").length;
    const pending = messages.filter((m) => m.status === "pending").length;

    const handleDownloadLogs = () => {
        const dataStr = JSON.stringify(filtered.map((x) => x.m), null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `unity-messages.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setMessages([]);
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
                            <CheckCircle size={16} />
                            ACK 전송
                        </button>
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{r2u}</div>
                            <div className="text-sm text-gray-600">R→U</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{u2r}</div>
                            <div className="text-sm text-gray-600">U→R</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{success}</div>
                            <div className="text-sm text-gray-600">Success</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{error}</div>
                            <div className="text-sm text-gray-600">Error</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{pending}</div>
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
                                <p className="text-sm mt-2">{messages.length === 0 ? "Unity와 통신을 시작하세요." : "필터를 조정해 보세요."}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filtered.map(({ m, idx }) => (
                                    <div key={idx} className="p-4 hover:bg-gray-50">
                                        <div className="cursor-pointer" onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    {getDirectionIcon(m.direction)}
                                                    <span className={`px-2 py-1 text-xs rounded font-mono ${m.direction === "R2U" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{m.direction}</span>
                                                    <span className={`px-2 py-1 text-xs rounded font-mono ${m.type === "REQ" ? "bg-orange-100 text-orange-700" : m.type === "ACK" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{m.type}</span>
                                                    <span className="font-mono text-sm text-gray-900">{m.route}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(m.status)}
                                                </div>
                                            </div>
                                        </div>
                                        {expandedIndex === idx && (
                                            <div className="mt-3 p-3 bg-gray-100 rounded border">
                                                <h4 className="font-medium text-gray-900 mb-2">Message Data:</h4>
                                                <pre className="text-xs bg-black p-2 rounded border overflow-x-auto text-amber-50">
                          {JSON.stringify(m.data, null, 2)}
                        </pre>
                                                {m.status && <div className="mt-2 text-xs text-gray-600">Status: {m.status}</div>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageInterfaceSample;
