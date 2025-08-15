import React, {useMemo, useState} from "react";
import {UnityMessage, UnityRoute} from "@/bridge/unityConfig";
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

interface Props {
    onSendRequest: (route: UnityRoute, data: any) => Promise<UnityMessage>;
    onSendNotification: (route: UnityRoute, data: any) => void;
    messages: UnityMessage[];
    onClearMessages: () => void;
    className?: string;
}

const MessageInterfaceSample: React.FC<Props> = ({
                                                     onSendRequest,
                                                     onSendNotification,
                                                     messages,
                                                     onClearMessages,
                                                     className = "",
                                                 }) => {

    const [customRoute, setCustomRoute] = useState("");
    const [customData, setCustomData] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [filter, setFilter] = useState<"all" | "R2U" | "U2R">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "REQ" | "ACK" | "NTY">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

    const routeOptions = [
        "SampleManager_HelloWorld",
    ];

    const filteredMessages = useMemo(() => {
        return messages
            .filter((m) => {
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

    const stats = useMemo(() => {
        const total = messages.length;
        const r2u = messages.filter((m) => m.direction === "R2U").length;
        const u2r = messages.filter((m) => m.direction === "U2R").length;
        const success = messages.filter((m) => m.status === "success").length;
        const error = messages.filter((m) => m.status === "error").length;
        const pending = messages.filter((m) => m.status === "pending").length;
        return { total, r2u, u2r, success, error, pending };
    }, [messages]);

    const getStatusIcon = (status?: string) => {
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

    const getDirectionIcon = (direction?: string) =>
        direction === "R2U" ? <ArrowRight size={16} className="text-blue-500" /> :
            <ArrowLeft size={16} className="text-green-500" />;

    const handleSendRequest = async () => {
        if (isSending || !customRoute) return;
        setIsSending(true);
        try {
            const data = customData.trim() ? JSON.parse(customData.trim()) : {};
            await onSendRequest(customRoute as UnityRoute, data);
        } catch (e) {
            alert(`REQ 전송 실패: ${e}`);
        } finally {
            setIsSending(false);
        }
    };

    const handleSendNotification = () => {
        if (!customRoute) return;
        try {
            const data = customData.trim() ? JSON.parse(customData.trim()) : {};
            onSendNotification(customRoute as UnityRoute, data);
        } catch (e) {
            alert(`NTY 전송 실패: ${e}`);
        }
    };

    const handleDownloadLogs = () => {
        const dataStr = JSON.stringify(filteredMessages, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `unity-messages-${new Date().toISOString().slice(0, 19)}.json`;
        a.click();
        URL.revokeObjectURL(url);
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
                        disabled={filteredMessages.length === 0}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        <Download size={14} />
                        Export
                    </button>
                    <button
                        onClick={onClearMessages}
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
                    </div>
                </div>

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
                            Showing {filteredMessages.length} of {messages.length}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto border rounded">
                        {filteredMessages.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No messages found</p>
                                <p className="text-sm mt-2">
                                    {messages.length === 0 ? "Unity와 통신을 시작하세요." : "필터를 조정해 보세요."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filteredMessages.map((m) => (
                                    <div key={m.id} className="p-4 hover:bg-gray-50">
                                        <div className="cursor-pointer"
                                             onClick={() => setExpandedMessage(expandedMessage === m.id ? null : m.id)}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    {getDirectionIcon(m.direction)}
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded font-mono ${m.direction === "R2U" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                                                        }`}
                                                    >
                                                        {m.direction || "---"}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded font-mono ${m.type === "REQ"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : m.type === "ACK"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {m.type}
                                                    </span>
                                                    <span className="font-mono text-sm text-gray-900">{m.route}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(m.status)}
                                                    <span
                                                        className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</span>
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
                                                    {m.status && <div>Status: {m.status}</div>}
                                                    {m.ref && <div>Reference: {m.ref}</div>}
                                                </div>
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