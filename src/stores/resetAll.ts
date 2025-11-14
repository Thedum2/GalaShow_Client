import { useAuthStore } from "./auth";

export function resetAllStores() {
    useAuthStore.getState().reset();
}
