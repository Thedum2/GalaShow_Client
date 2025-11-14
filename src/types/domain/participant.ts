import { PlatformType } from "@/types/common";

/**
 * 기본 참가자 정보
 */
export interface Participant {
    id: string;
    name: string;
    platform: PlatformType;
}

/**
 * 참가자 목록 아이템 (상세 정보 포함)
 */
export interface ParticipantListItem {
    id: string;
    name: string;
    avatarUrl?: string;
    detail?: string;
    badgeLabel?: string;
    badgeClassName?: string;
    joinedAt?: string | number | Date;
}

/**
 * 참가 선택 아이템 (간단한 버전)
 */
export interface ParticipationSelectionItem {
    id: string;
    name: string;
    avatarUrl: string;
}
