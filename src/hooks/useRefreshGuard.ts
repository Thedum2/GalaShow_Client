import { useEffect, useState } from "react";

let allowUnload = false;

/** 경고 없이 첫 화면으로 다시 불러온다. */
export function reloadToHome() {
    allowUnload = true;
    window.location.assign("/");
}

// 개발 서버의 전체 새로고침(HMR)에는 경고를 띄우지 않는다.
import.meta.hot?.on("vite:beforeFullReload", () => {
    allowUnload = true;
});

/**
 * 새로고침 경고.
 * - F5, Ctrl/Cmd+R: 기본 새로고침을 막고 팝업을 연다(open).
 * - 브라우저 새로고침 버튼·탭 닫기: 가로챌 수 없어 브라우저 기본 경고창만 띄운다(문구는 브라우저가 정한다).
 */
export function useRefreshGuard() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (allowUnload) return;
            e.preventDefault();
            e.returnValue = "";
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")) {
                e.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return { open, close: () => setOpen(false) };
}
