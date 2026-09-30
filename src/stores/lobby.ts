import { create } from "zustand";
import type { PlatformType } from "@/types/common";
import type { VictoryOptionId } from "@/types/domain/game";

/**
 * 채팅 참가 명령어. 메시지 전체가 이 중 하나와 같아야 참가로 처리한다.
 * PRD에서 명령어는 미정이며 임시 값이다.
 */
export const JOIN_COMMANDS = ["참여", "참가"];

/** 최대 참가자 수 상한. PRD상 목표 동시 참가 인원은 미정이며 현재 50명으로 제한한다. */
export const CAPACITY_MAX = 50;

/**
 * 게임 시작에 필요한 최소 참가자 수. PRD상 최소 시작 인원은 미정이며,
 * 최후의 1인 모드가 성립하는 최솟값(2명)을 임시로 사용한다.
 */
export const MIN_PARTICIPANTS = 2;

/** ready: 모집 전, open: 모집 중, closed: 모집 마감 */
export type RecruitStatus = "ready" | "open" | "closed";

export type LobbyParticipant = {
    /** 플랫폼 + 닉네임. PolyChat 메시지에 사용자 ID가 없어 같은 플랫폼의 동명이인은 구분하지 못한다. */
    id: string;
    platform: PlatformType;
    nickname: string;
    joinedAt: number;
};

export type JoinResult = "joined" | "duplicate" | "full" | "excluded" | "notOpen" | "ignored";

type LobbyState = {
    status: RecruitStatus;
    capacity: number;
    participants: LobbyParticipant[];
    /** 제외한 참가자 ID. 다시 신청해도 받지 않는다. */
    excludedIds: string[];
    mode: VictoryOptionId;
    /** 게임에서 쓸 시청자 아바타 ID. 1개 이상 선택해야 시작할 수 있다. */
    selectedAvatarIds: string[];
    survivorCount: number;
    roundCount: number;

    setStatus: (status: RecruitStatus) => void;
    setCapacity: (capacity: number) => void;
    setMode: (mode: VictoryOptionId) => void;
    toggleAvatar: (avatarId: string) => void;
    setSurvivorCount: (count: number) => void;
    setRoundCount: (count: number) => void;
    /** 채팅 메시지를 참가 신청으로 처리한다. 참가 명령어가 아니면 ignored. */
    handleChat: (platform: PlatformType, nickname: string, content: string) => JoinResult;
    exclude: (participantId: string) => void;
    reset: () => void;
};

export const participantId = (platform: PlatformType, nickname: string) => `${platform}:${nickname}`;

const initialState = {
    status: "ready" as RecruitStatus,
    capacity: CAPACITY_MAX,
    participants: [] as LobbyParticipant[],
    excludedIds: [] as string[],
    mode: "lastOne" as VictoryOptionId,
    selectedAvatarIds: [] as string[],
    survivorCount: 3,
    roundCount: 3,
};

export const useLobbyStore = create<LobbyState>()((set, get) => ({
    ...initialState,

    setStatus: (status) => set({ status }),
    // 모집을 한 번 시작하면(참가 허용·참가 종료) 로비를 초기화하기 전까지 바꿀 수 없다.
    setCapacity: (capacity) => {
        if (get().status !== "ready") return;
        set({ capacity: Math.min(Math.max(Math.round(capacity), MIN_PARTICIPANTS), CAPACITY_MAX) });
    },
    setMode: (mode) => set({ mode }),
    toggleAvatar: (avatarId) =>
        set((state) => ({
            selectedAvatarIds: state.selectedAvatarIds.includes(avatarId)
                ? state.selectedAvatarIds.filter((id) => id !== avatarId)
                : [...state.selectedAvatarIds, avatarId],
        })),
    setSurvivorCount: (survivorCount) => set({ survivorCount }),
    setRoundCount: (roundCount) => set({ roundCount }),

    handleChat: (platform, nickname, content) => {
        const name = nickname.trim();
        if (!name || !JOIN_COMMANDS.includes(content.trim())) return "ignored";

        const { status, capacity, participants, excludedIds } = get();
        const id = participantId(platform, name);
        if (status !== "open") return "notOpen";
        if (excludedIds.includes(id)) return "excluded";
        if (participants.some((p) => p.id === id)) return "duplicate";
        if (participants.length >= capacity) return "full";

        set({ participants: [...participants, { id, platform, nickname: name, joinedAt: Date.now() }] });
        return "joined";
    },

    exclude: (id) =>
        set((state) => ({
            participants: state.participants.filter((p) => p.id !== id),
            excludedIds: state.excludedIds.includes(id) ? state.excludedIds : [...state.excludedIds, id],
        })),

    reset: () => set(initialState),
}));
