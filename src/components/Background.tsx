import React from 'react'
import type { BackgroundProps } from '@/types/common'
import { BackgroundType } from '@/types/common'

// bgType이 명시적으로 제공되지 않은 경우, 파일 확장자를 통해 타입을 추론합니다.
const getSourceType = (src: string): BackgroundType | 'unknown' => {
    const extension = src.split('.').pop()?.toLowerCase().split('?')[0];
    if (!extension) {
        // 확장자가 없는 URL(Pexels 등)을 위한 예외 처리
        if (src.includes('pexels.com/video')) return 'video';
        return 'unknown';
    }

    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    if (videoExtensions.includes(extension)) return 'video';
    if (imageExtensions.includes(extension)) return 'image';

    return 'unknown';
};

export default function Background({
                                       bgSrc,
                                       bgAlt = '',
                                       bgPosition = 'center',
                                       className,
                                       overlayOpacity = 0.8,
                                       bgType,
                                   }: BackgroundProps) {
    const base = 'absolute inset-0 w-full h-full pointer-events-none select-none'

    const sourceType = bgType || (bgSrc ? getSourceType(bgSrc) : 'unknown');

    const renderBackground = () => {
        if (!bgSrc) {
            return <div className={`${base} ${className ?? ''}`} style={{ zIndex: 0 }} aria-hidden />;
        }

        switch (sourceType) {
            case 'video':
                return (
                    <video
                        key={bgSrc} // 소스가 바뀔 때마다 비디오를 다시 렌더링하기 위함
                        src={bgSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`${base} object-cover ${className ?? ''}`}
                        style={{ objectPosition: bgPosition, zIndex: -1 }}
                        aria-hidden
                    />
                );
            case 'image':
            default:
                return (
                    <img
                        key={bgSrc}
                        src={bgSrc}
                        alt={bgAlt}
                        className={`${base} object-cover ${className ?? ''}`}
                        style={{ objectPosition: bgPosition, zIndex: -1 }}
                        aria-hidden
                    />
                );
        }
    };

    return (
        <>
            {renderBackground()}
            {overlayOpacity > 0 && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundColor: 'black',
                        opacity: overlayOpacity,
                        zIndex: -1,
                    }}
                    aria-hidden
                />
            )}
        </>
    )
}
