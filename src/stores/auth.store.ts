import { create } from "zustand";

export type User = {
    id: string;
    name: string;
    roles: string[];

};

type AuthState = {
    user: User | null;

    setUser: (u: User | null) => void;
    isLoggedIn: () => boolean;

    reset: () => void;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,

    setUser: (u) => set({ user: u }),
    isLoggedIn: () => get().user !== null,

    reset: () => set({ user: null }),
}));
