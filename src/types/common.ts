import React from 'react';

// ============================================
// 전역 공통 타입
// ============================================

/**
 * 플랫폼 타입 (여러 곳에서 재사용)
 */
export type PlatformType = 'chzzk' | 'soop' | 'youtube';

/**
 * 배경 타입
 */
export type BackgroundType = "image" | "video";

/**
 * Fit 모드 (FitStage에서 사용)
 */
export type FitMode = 'contain' | 'cover' | 'width' | 'height' | 'contain-bleed';

// ============================================
// 재사용되는 컴포넌트 Props
// ============================================

/**
 * FitStage Props
 */
export interface FitStageProps {
    mode?: FitMode;
    bleedRatio?: number;
    className?: string;
    children: React.ReactNode;
}

/**
 * Background Props
 */
export interface BackgroundProps {
    bgSrc?: string
    bgAlt?: string
    bgPosition?: string
    className?: string
    overlayOpacity?: number
    bgType?: BackgroundType
}

/**
 * Icon Props (공통 아이콘 컴포넌트)
 */
export type IconProps = {
    name: string;
    size?: number | string;
    color?: string;
    title?: string;
    className?: string;
    mode?: 'lazy' | 'eager';
    type?: 'custom' | 'lucide';
    strokeWidth?: number;
} & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color' | 'title'>;

/**
 * PlatformIcon Props
 */
export interface PlatformIconProps {
    platform: PlatformType;
    size?: number;
    className?: string;
}

/**
 * PdfViewer Props
 */
export interface PdfViewerProps {
    url: string;
    onClose: () => void;
    title?: string;
}

/**
 * Ribbon Props (RibbonOverlay에서 재사용)
 */
export interface RibbonProps {
    text: string;
    rotate?: number;
    top?: string;
    left?: string;
    width?: string;
    speedSec?: number;
    theme?: "light" | "dark";
}

/**
 * Step 인터페이스 (StepsBox 등 여러 곳에서 사용)
 */
export interface Step {
    icon: React.ReactElement;
    title: string;
    desc: string;
    iconBgColor?: string;
}

/**
 * Step 추가 정보
 */
export interface StepExtra {
    mediaUrl?: string;
    media?: React.ReactNode;
    progress?: number;
    accent?: string;
}

// ============================================
// 인증 관련
// ============================================

/**
 * 토큰 정보
 */
export interface Tokens {
    accessToken: string;
    refreshToken?: string | null;
}

