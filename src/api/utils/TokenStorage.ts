import {Tokens} from "@/types/common";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
export const TokenStorage = {
    getAccessToken: () => localStorage.getItem(ACCESS_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
    setTokens(tokens: Tokens) {
        localStorage.setItem(ACCESS_KEY, tokens.accessToken);
        if (typeof tokens.refreshToken === "string") localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    },
    clear() {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};
