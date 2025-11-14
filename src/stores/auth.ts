import { create } from "zustand";

export type User = {
    id: string;
    name: string;
    roles: string[];
};

type AuthState = {
    user: User | null;
    token: string | null;

    setUser: (u: User | null) => void;
    setToken: (t: string | null) => void;
    isLoggedIn: () => boolean;

    reset: () => void;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    token: null,

    setUser: (u) => set({ user: u }),
    setToken: (t) => set({ token: t }),
    isLoggedIn: () => get().user !== null,

    reset: () => set({ user: null, token: null }),
}));
