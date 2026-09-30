// 개발용 가짜 채팅. 실제 어댑터와 같은 경로(polyChat의 'message' 이벤트)로 메시지를 흘려보내
// 로비 참가·게임 입력이 실제 방송 채팅과 똑같이 처리되게 한다. 운영 빌드에는 포함되지 않는다.
import { polyChat, usePolyChatStore } from "@/stores/polychat";
import type { PlatformType } from "@/types/common";

export const ALL_PLATFORMS: PlatformType[] = ["chzzk", "soop", "youtube"];

/** 채팅 연결 흉내로 연결 상태만 바꾼 플랫폼 */
const fakePlatforms = new Set<PlatformType>();
export const isFakeConnection = (platform: PlatformType) => fakePlatforms.has(platform);

/** 가짜 시청자의 채팅 한 줄을 실제 채팅처럼 내보낸다. */
export function sendChat(platform: PlatformType, nickname: string, content: string) {
    polyChat.emit("message", {
        platform,
        message: {
            platform,
            chat_id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            nickname,
            content,
            timestamp: new Date(),
        },
    });
}

/** 채팅 연결 흉내: 방송 없이도 로비의 시작 조건(채팅 연결)을 통과하도록 연결 상태만 바꾼다. 실제 연결은 건드리지 않는다. */
export function setFakeConnection(platforms: PlatformType[]) {
    const state = usePolyChatStore.getState();
    const next = { ...state.platforms };
    for (const p of ALL_PLATFORMS) {
        const isReal = next[p].status === "connected" && !fakePlatforms.has(p);
        if (isReal) continue;
        if (platforms.includes(p)) {
            fakePlatforms.add(p);
            next[p] = { status: "connected", broadcaster: { nickname: `테스트 ${p.toUpperCase()}`, profileImageUrl: "" }, error: "" };
        } else if (fakePlatforms.has(p)) {
            fakePlatforms.delete(p);
            next[p] = { status: "idle", broadcaster: null, error: "" };
        }
    }
    const main = state.mainPlatform && next[state.mainPlatform].status === "connected"
        ? state.mainPlatform
        : ALL_PLATFORMS.find((p) => next[p].status === "connected") ?? null;
    usePolyChatStore.setState({ platforms: next, mainPlatform: main });
}
