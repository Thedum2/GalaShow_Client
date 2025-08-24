import React from 'react'
import type { BackgroundProps } from '@/types/common'

export default function Background({
                                       bgSrc,
                                       bgAlt = '',
                                       bgPosition = 'center',
                                       className,
                                       overlayOpacity = 0.8,
                                   }: BackgroundProps) {
    const base = 'absolute inset-0 w-full h-full pointer-events-none select-none'
    return (
        <>
            {bgSrc ? (
                <img
                    src={bgSrc}
                    alt={bgAlt}
                    className={`${base} object-cover ${className ?? ''}`}
                    style={{ objectPosition: bgPosition, zIndex: -1 }}
                    aria-hidden
                />
            ) : (
                <div className={`${base} ${className ?? ''}`} style={{ zIndex: 0 }} aria-hidden />
            )}

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
