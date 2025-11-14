/**
 * 승리 조건 옵션 ID
 */
export type VictoryOptionId = 'lastOne' | 'smallGroup' | 'rounds';

/**
 * 참여 옵션
 */
export interface ParticipationOption {
    label: string;
    value: string;
}

/**
 * 참여 안내 메시지
 */
export interface ParticipationInstructions {
    prefix: string;
    highlight: string;
    suffix: string;
}

/**
 * 기본 시간 옵션 (초 단위)
 */
export const DEFAULT_TIME_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
