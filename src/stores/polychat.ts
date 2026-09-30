import { create } from "zustand";
import {
    ChzzkAdapter,
    PolyChat,
    SoopAdapter,
    YouTubeAdapter,
} from "polychat-bridge";
import type { BroadcasterInfo, ChatMessage, IChatAdapter } from "polychat-bridge";
import type { PlatformType } from "@/types/common";
import {
    CHZZK_API_BASE_URL,
    OAUTH_CALLBACK_PATH,
    POLYCHAT_API_BASE_URL,
    SOOP_API_BASE_URL,
    YOUTUBE_API_BASE_URL,
    YOUTUBE_STREAM_URL,
} from "@/api/polychatConfig";

// 방송 중일 때만 로그인한다. 채팅 연결까지 성공해야 connected가 된다.
export type PlatformStatus = "idle" | "loggingIn" | "connected";

export type PlatformConnection = {
    status: PlatformStatus;
    broadcaster: BroadcasterInfo | null;
    error: string;
};

type PolyChatState = {
    platforms: Record<PlatformType, PlatformConnection>;
    /** 방송 호스트로 표시할 메인 프로필. 연결된 플랫폼 중 하나이며 없으면 null. */
    mainPlatform: PlatformType | null;

    setMainPlatform: (platform: PlatformType) => void;

    /** OAuth 로그인 후 채팅을 연결한다. 방송 중이 아니면 로그인을 취소하고 false를 반환한다. */
    connect: (platform: PlatformType) => Promise<boolean>;
    disconnect: (platform: PlatformType) => Promise<void>;
    reset: () => Promise<void>;
};

type Adapter = ChzzkAdapter | SoopAdapter | YouTubeAdapter;

const PLATFORMS: PlatformType[] = ["chzzk", "soop", "youtube"];

// 어댑터가 여는 OAuth 팝업 창 이름. 클릭 직후 같은 이름으로 미리 열어 두면
// 설정 조회·SDK 로드 등 비동기 작업 뒤에 여는 팝업도 차단되지 않는다.
const POPUP_NAMES: Record<PlatformType, string> = {
    chzzk: "Chzzk OAuth",
    soop: "SOOP OAuth",
    youtube: "YouTube OAuth",
};
const POPUP_FEATURES = "width=500,height=700,left=100,top=100";

const idle = (): PlatformConnection => ({ status: "idle", broadcaster: null, error: "" });

const errorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);

const NOT_LIVE_MESSAGE = "방송 중이 아닙니다. 방송을 시작한 뒤 로그인해주세요.";

// 방송 중이 아니어서 거절된 경우를 안내 문구로 바꾼다.
// (SOOP은 채팅 SDK가 104로 거절하고, CHZZK·YouTube는 requireLive로 PolyChat이 거절한다.)
function chatErrorMessage(platform: PlatformType, error: unknown) {
    const message = errorMessage(error);
    if (platform === "soop" && /\(104\)/.test(message)) return NOT_LIVE_MESSAGE;
    if (platform === "chzzk" && message.startsWith("방송 중이 아닙니다")) return NOT_LIVE_MESSAGE;
    if (platform === "youtube" && message.includes("라이브 채팅을 찾을 수 없습니다")) return NOT_LIVE_MESSAGE;
    return message;
}

/** 앱 전체에서 공유하는 채팅 연결. 로비 등에서 polyChat.on('message')로 채팅을 받는다. */
export const polyChat = new PolyChat();

let publicConfig: Promise<Record<PlatformType, { clientId?: string }>> | null = null;

function loadPublicConfig() {
    publicConfig ??= fetch(`${POLYCHAT_API_BASE_URL}/config`)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .catch((error) => {
            publicConfig = null;
            throw new Error(`PolyChat 중계 서버에 연결하지 못했습니다. (${error.message})`);
        });
    return publicConfig;
}

function getOrCreateAdapter(platform: PlatformType): Adapter {
    const existing = polyChat.getAdapter(platform) as Adapter | undefined;
    if (existing) return existing;
    const adapter = platform === "chzzk" ? new ChzzkAdapter()
        : platform === "soop" ? new SoopAdapter() : new YouTubeAdapter();
    polyChat.registerAdapter(adapter as unknown as IChatAdapter);
    return adapter;
}

async function initAndAuthenticate(platform: PlatformType, adapter: Adapter, clientId: string) {
    const redirectUri = `${window.location.origin}${OAUTH_CALLBACK_PATH}`;
    if (platform === "chzzk") {
        await (adapter as ChzzkAdapter).init({ clientId, redirectUri, apiBaseUrl: CHZZK_API_BASE_URL, requireLive: true });
        await (adapter as ChzzkAdapter).authenticate({});
    } else if (platform === "soop") {
        await (adapter as SoopAdapter).init({ clientId, apiBaseUrl: SOOP_API_BASE_URL });
        await (adapter as SoopAdapter).authenticate({ clientId });
    } else {
        await (adapter as YouTubeAdapter).init({
            clientId,
            redirectUri,
            apiBaseUrl: YOUTUBE_API_BASE_URL,
            streamUrl: YOUTUBE_STREAM_URL,
            requireLive: true,
        });
        await (adapter as YouTubeAdapter).authenticate({});
    }
}

type MainState = Pick<PolyChatState, "platforms" | "mainPlatform">;

// 메인이 없거나 연결이 끊겼으면 연결된 다른 플랫폼으로 넘긴다(처음 연결한 계정이 메인이 된다).
function withMain(state: MainState): MainState {
    const connected = PLATFORMS.filter((p) => state.platforms[p].status === "connected");
    const main = state.mainPlatform && connected.includes(state.mainPlatform) ? state.mainPlatform : connected[0] ?? null;
    return { ...state, mainPlatform: main };
}

/** 메인 프로필의 방송인 정보(닉네임·프로필 이미지). 연결된 계정이 없으면 null. */
export const selectMainBroadcaster = (state: PolyChatState) =>
    state.mainPlatform ? state.platforms[state.mainPlatform].broadcaster : null;

export const usePolyChatStore = create<PolyChatState>()((set, get) => {
    const update = (platform: PlatformType, updates: Partial<PlatformConnection>) =>
        set((state) => withMain({
            platforms: { ...state.platforms, [platform]: { ...state.platforms[platform], ...updates } },
            mainPlatform: state.mainPlatform,
        }));

    polyChat.on("auth", ({ platform, broadcasterInfo }) => {
        update(platform as PlatformType, { broadcaster: broadcasterInfo });
    });
    polyChat.on("connected", ({ platform }) => {
        update(platform as PlatformType, { status: "connected", error: "" });
    });
    polyChat.on("disconnected", ({ platform }) => {
        // 방송 종료 등으로 채팅이 끊기면 로그인도 해제한다.
        if (get().platforms[platform as PlatformType]?.status === "connected") {
            update(platform as PlatformType, { status: "idle", broadcaster: null, error: "채팅 연결이 끊어졌습니다." });
        }
    });
    polyChat.on("error", ({ platform, error }) => {
        update(platform as PlatformType, { error: error.message });
    });

    return {
        platforms: { chzzk: idle(), soop: idle(), youtube: idle() },
        mainPlatform: null,

        setMainPlatform: (platform) => {
            if (get().platforms[platform].status === "connected") set({ mainPlatform: platform });
        },

        // 로그인 버튼 클릭 핸들러에서 바로 호출해야 한다(팝업 차단 방지).
        connect: async (platform) => {
            if (get().platforms[platform].status !== "idle") return false;

            const popup = window.open("about:blank", POPUP_NAMES[platform], POPUP_FEATURES);
            if (!popup) {
                update(platform, { error: "팝업이 차단되었습니다. 팝업 차단을 해제해주세요." });
                return false;
            }
            update(platform, { status: "loggingIn", broadcaster: null, error: "" });

            const adapter = getOrCreateAdapter(platform);
            let stage: "login" | "chat" = "login";
            try {
                const config = await loadPublicConfig();
                const clientId = config[platform]?.clientId;
                if (!clientId) throw new Error("중계 서버에 이 플랫폼의 Client ID가 설정되지 않았습니다.");

                await initAndAuthenticate(platform, adapter, clientId);
                if (!adapter.isAuthenticated) throw new Error("인증에 실패했습니다.");
                stage = "chat";
                await adapter.connect();
                update(platform, { status: "connected", error: "" });
                return true;
            } catch (error) {
                if (!popup.closed) popup.close();
                await adapter.disconnect().catch(() => {});
                update(platform, {
                    status: "idle",
                    broadcaster: null,
                    error: stage === "chat" ? chatErrorMessage(platform, error) : errorMessage(error),
                });
                return false;
            }
        },

        disconnect: async (platform) => {
            const adapter = polyChat.getAdapter(platform);
            set((state) => withMain({
                platforms: { ...state.platforms, [platform]: idle() },
                mainPlatform: state.mainPlatform,
            }));
            await adapter?.disconnect().catch(() => {});
        },

        reset: async () => {
            await Promise.all(PLATFORMS.map((platform) => get().disconnect(platform)));
        },
    };
});

export type { BroadcasterInfo, ChatMessage };
