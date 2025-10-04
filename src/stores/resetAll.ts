import { useAuthStore } from "./auth.store";

export function resetAllStores() {
    useAuthStore.getState().reset();
}
