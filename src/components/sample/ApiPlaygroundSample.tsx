import React, { useMemo, useState } from "react";
import { AuthApi } from "@/api/modules/AuthApi";
import { BannersApi } from "@/api/modules/BannersApi";
import { BackgroundApi } from "@/api/modules/BackgroundApi";
import { PoliciesApi } from "@/api/modules/PoliciesApi";
import { SnsLinksApi } from "@/api/modules/SnsLinksApi";
import { TokenStorage } from "@/api/utils/TokenStorage";
import {AuthSession} from "@/api/model/response/auth/AuthSession";
import {LoginRequest} from "@/api/model/response/auth/LoginRequest";

export default function ApiPlaygroundSample() {
    const [loginId, setLoginId] = useState("dev");
    const [password, setPassword] = useState("dev");
    const [session, setSession] = useState<AuthSession | null>(null);

    const [loading, setLoading] = useState<string | null>(null);
    const [lastAction, setLastAction] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string>("");

    const accessToken = TokenStorage.getAccessToken();

    const shortToken = useMemo(() => {
        if (!accessToken) return "";
        return accessToken.length > 28
            ? `${accessToken.slice(0, 14)}…${accessToken.slice(-10)}`
            : accessToken;
    }, [accessToken]);

    const pretty = (v: any) => (v == null ? "" : JSON.stringify(v, null, 2));

    async function run<T>(label: string, fn: () => Promise<T>) {
        setLoading(label);
        setError("");
        setLastAction(label);
        try {
            const res = await fn();
            setData(res);
            return res;
        } catch (e: any) {
            const msg =
                e?.message ||
                e?.response?.data?.message ||
                `Request failed: ${label}`;
            setError(msg);
            setData(null);
        } finally {
            setLoading(null);
        }
    }

    // Actions
    const onLogin = () =>
        run("login", async () => {
            const s = await AuthApi.login(new LoginRequest(loginId, password));
            setSession(s);
            return s;
        });

    const onRefresh = () =>
        run("refresh", async () => {
            const rt = TokenStorage.getRefreshToken();
            if (!rt) throw new Error("No refreshToken in storage");
            const s = await AuthApi.refresh(rt);
            setSession(s);
            return s;
        });

    const onLogout = () =>
        run("logout", async () => {
            await AuthApi.logout();
            setSession(null);
            return { ok: true };
        });

    const fetchBanners = () => run("banners", () => BannersApi.get());
    const fetchBackground = () => run("background", () => BackgroundApi.get());
    const fetchPolicies = () => run("policies", () => PoliciesApi.get());
    const fetchSns = () => run("sns-links", () => SnsLinksApi.get());

    return (
        <div className="mx-auto max-w-5xl p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Galashow API Playground</h1>
                <span className="text-xs text-red-500">
          Base: {import.meta.env.VITE_API_URL}
        </span>
            </header>

            {/* Auth Card */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
                <h2 className="mb-4 text-lg font-medium">1) Auth</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,1fr,auto]">
                    <input
                        className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        placeholder="id"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                    />
                    <input
                        className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={onLogin}
                        disabled={loading === "login"}
                        className={`h-10 rounded-lg px-4 text-sm font-medium transition
              ${loading === "login" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                    >
                        {loading === "login" ? (
                            <span className="inline-flex items-center gap-2">
                <Spinner /> 로그인 중…
              </span>
                        ) : (
                            "로그인"
                        )}
                    </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    <button
                        onClick={onRefresh}
                        disabled={loading === "refresh"}
                        className={`h-9 rounded-lg px-3 text-sm font-medium transition
              ${loading === "refresh" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
                    >
                        {loading === "refresh" ? <Line>갱신 중…</Line> : "토큰 재발급"}
                    </button>
                    <button
                        onClick={onLogout}
                        disabled={loading === "logout"}
                        className={`h-9 rounded-lg px-3 text-sm font-medium transition
              ${loading === "logout" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 text-white"}`}
                    >
                        {loading === "logout" ? <Line>로그아웃 중…</Line> : "로그아웃"}
                    </button>
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                    <div className="text-zinc-400">
                        <span className="font-medium text-zinc-200">AccessToken:</span>{" "}
                        <code className="rounded text-red-200 bg-zinc-800 px-1.5 py-0.5 text-xs">{shortToken || "(없음)"}</code>
                    </div>
                    {session && (
                        <div className="grid gap-1.5 text-zinc-300 sm:grid-cols-2">
                            <div>
                                <span className="text-zinc-400">Access Expires:</span>{" "}
                                <span className="font-medium">{session.accessExpiresAt}</span>
                            </div>
                            <div>
                                <span className="text-zinc-400">Refresh Expires:</span>{" "}
                                <span className="font-medium">{session.refreshExpiresAt}</span>
                            </div>
                            <div>
                                <span className="text-zinc-400">User:</span>{" "}
                                <span className="font-medium">{session.user.id}</span>{" "}
                                <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-xs uppercase tracking-wide">
                  {session.user.role}
                </span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Data Card */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
                <h2 className="mb-4 text-lg font-medium">2) Data</h2>

                <div className="flex flex-wrap gap-2">
                    <SmallButton onClick={fetchBanners} loading={loading === "banners"} label="배너 목록" />
                    <SmallButton onClick={fetchBackground} loading={loading === "background"} label="배경 목록" />
                    <SmallButton onClick={fetchPolicies} loading={loading === "policies"} label="정책 조회" />
                    <SmallButton onClick={fetchSns} loading={loading === "sns-links"} label="SNS 링크" />
                </div>

                <div className="mt-3 text-xs text-zinc-500">{lastAction && `Last action: ${lastAction}`}</div>

                <div className="mt-3">
                    {error ? (
                        <pre className="max-h-96 overflow-auto rounded-xl border border-red-900/60 bg-red-950/40 p-4 font-mono text-sm text-red-200">
              {error}
            </pre>
                    ) : (
                        <pre className="max-h-96 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-200">
              {pretty(data)}
            </pre>
                    )}
                </div>

                <p className="mt-3 text-xs text-amber-50">
                    인터셉터: Authorization 자동 주입 · 401 시 토큰 갱신/재시도 · 429/네트워크/타임아웃 재시도 · 응답 <code>data</code> 언래핑
                </p>
            </section>
        </div>
    );
}

/** UI helpers (Tailwind only) */
function Spinner() {
    return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />;
}
function Line({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2">
      <Spinner /> {children}
    </span>
    );
}
function SmallButton({
                         onClick,
                         loading,
                         label,
                     }: {
    onClick: () => void;
    loading: boolean;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`h-9 rounded-lg px-3 text-sm font-medium transition
        ${loading ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" : "bg-zinc-200 text-zinc-900 hover:bg-white"}`}
        >
            {loading ? <Line>조회 중…</Line> : label}
        </button>
    );
}
