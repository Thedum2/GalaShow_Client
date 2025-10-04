import React from 'react';

export type FitMode = 'contain' | 'cover' | 'width' | 'height' | 'contain-bleed';



export interface FitStageProps {
    mode?: FitMode;
    bleedRatio?: number;
    className?: string;
    children: React.ReactNode;
}
export interface Tokens {
    accessToken: string;
    refreshToken?: string | null;
}

export interface PdfViewerProps {
    url: string;
    onClose: () => void;
    title?: string;
}

export interface BackgroundProps {
    bgSrc?: string
    bgAlt?: string
    bgPosition?: string
    className?: string
    overlayOpacity?: number
    bgType?: BackgroundType
}

export type IconProps = {
    name: string;
    size?: number | string;
    color?: string;
    title?: string;
    className?: string;
    mode?: 'lazy' | 'eager';
} & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color' | 'title'>;


export type BackgroundType = "image" | "video";
