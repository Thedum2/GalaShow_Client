import {httpClient} from "../httpClient";
import {LoginRequest} from "@/model/response/auth/LoginRequest";
import {AuthSession} from "@/model/response/auth/AuthSession";
import {TokenStorage} from "../utils/TokenStorage";

export const AuthApi = {
    async login(req: LoginRequest): Promise<AuthSession> {
        const session = await httpClient.post<AuthSession>("/auth/login", req.toPlain(), AuthSession.fromJSON);
        TokenStorage.setTokens({accessToken: session.accessToken, refreshToken: session.refreshToken});
        return session;
    },
    async refresh(refreshToken: string): Promise<AuthSession> {
        const session = await httpClient.post<AuthSession>("/auth/refresh", {refreshToken}, AuthSession.fromJSON);
        TokenStorage.setTokens({accessToken: session.accessToken, refreshToken: session.refreshToken});
        return session;
    },
    async logout(): Promise<void> {
        const refreshToken = TokenStorage.getRefreshToken();
        if (!refreshToken) return;
        await httpClient.post<{ ok: boolean }>("/auth/logout", {refreshToken}, (j) => ({ok: Boolean(j?.ok)}));
        TokenStorage.clear();
    },
};
