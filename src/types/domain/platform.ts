import { PlatformType } from "@/types/common";

/**
 * 플랫폼 설정 정보
 */
export interface PlatformConfig {
    iconName: string;
    bgColor: string;
    iconSize: number;
}

/**
 * 플랫폼별 설정 매핑
 * @deprecated - 필요 시 각 컴포넌트에서 정의 권장
 */
export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
    chzzk: {
        iconName: 'chzzk',
        bgColor: '#03C75A',
        iconSize: 24,
    },
    soop: {
        iconName: 'soop',
        bgColor: '#0545B1',
        iconSize: 24,
    },
    youtube: {
        iconName: 'youtube',
        bgColor: '#FF0000',
        iconSize: 24,
    },
};
