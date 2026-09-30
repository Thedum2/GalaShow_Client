import { useId, useMemo } from 'react'
import type { RibbonProps } from '@/types/common'

export default function Ribbon({
                                   text,
                                   rotate = 0,
                                   top = '10%',
                                   speedSec = 20,
                                   theme = 'light',
                               }: RibbonProps) {
    const content = useMemo(() => Array(2).fill(text).join('   •   '), [text])
    // 리본마다 주름 모양이 달라지도록 노이즈 seed를 고정 랜덤값으로 둔다
    const seed = useMemo(() => Math.floor(Math.random() * 1000), [])
    const filterId = `ribbon-crumple-${useId().replace(/:/g, '')}`

    const bandClasses =
        theme === 'light'
            ? 'bg-white/90 text-black border-black/20'
            : 'bg-black/70 text-white border-white/20'
    // 천이 접힌 듯한 명암 (필터를 함께 거쳐 주름 모양으로 휘어진다)
    const foldShade =
        theme === 'light'
            ? 'repeating-linear-gradient(100deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.07) 38px, rgba(255,255,255,0.35) 64px, rgba(0,0,0,0) 110px, rgba(0,0,0,0.05) 150px, rgba(0,0,0,0) 190px)'
            : 'repeating-linear-gradient(100deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.08) 38px, rgba(0,0,0,0.3) 64px, rgba(255,255,255,0) 110px, rgba(255,255,255,0.05) 150px, rgba(255,255,255,0) 190px)'
    const shadow = theme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.35)'

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed select-none"
            style={{
                width: '200vmax',
                left: '50%',
                transform: `translateX(-50%) rotate(${rotate}deg)`,
                transformOrigin: 'center',
                zIndex: 10,
                top,
            }}
        >
            <svg width="0" height="0" className="absolute">
                <filter id={filterId} x="-2%" y="-50%" width="104%" height="200%">
                    {/* 가로로 길고 세로로 촘촘한 노이즈 → 테두리가 쭈글쭈글하게 일렁인다 */}
                    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="3" seed={seed} result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            <div
                className={`absolute inset-0 border ${bandClasses}`}
                style={{
                    backgroundImage: foldShade,
                    filter: `url(#${filterId}) drop-shadow(0 2px 8px ${shadow})`,
                }}
            />

            <div className="relative overflow-hidden whitespace-nowrap flex">
        <span
            className={`inline-block px-8 py-2 font-semibold tracking-wide ${theme === 'light' ? 'text-black' : 'text-white'}`}
            style={{ animation: `ribbon-scroll ${speedSec}s linear infinite` }}
        >
          {content}
        </span>
                <span
                    className={`inline-block px-8 py-2 font-semibold tracking-wide ${theme === 'light' ? 'text-black' : 'text-white'}`}
                    style={{ animation: `ribbon-scroll ${speedSec}s linear infinite` }}
                    aria-hidden
                >
          {content}
        </span>
            </div>
            <style>{`
        @keyframes ribbon-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    )
}
