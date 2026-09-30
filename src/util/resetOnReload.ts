// 새로고침하면 항상 첫 화면으로 돌아간다. 채팅 연결·로비·게임 진행 상태는 메모리에만 있어
// 새로고침하면 사라지므로 중간 화면에서 다시 시작하지 않게 한다.
// 라우터가 현재 주소를 읽기 전에 실행되도록 main.jsx에서 router보다 먼저 import한다.
const KEEP_ON_RELOAD = ["/", "/callback"];

const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
if (navigation?.type === "reload" && !KEEP_ON_RELOAD.includes(window.location.pathname)) {
    window.history.replaceState(null, "", "/");
}

export {};
