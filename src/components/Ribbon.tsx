// Ribbon.tsx (뷰포트 기준으로 끝까지 뻗는 버전)
import { useMemo } from 'react'
import type { RibbonProps } from '@/types/components'

export default function Ribbon({
                                   text,
                                   rotate = 0,
                                   top = '10%',
                                   speedSec = 20,
                                   theme = 'light',
                               }: RibbonProps) {
    const content = useMemo(() => Array(2).fill(text).join('   •   '), [text])
    const bandClasses =
        theme === 'light'
            ? 'bg-white/90 text-black border-black/20'
            : 'bg-black/70 text-white border-white/20'

    return (
        <div
            aria-hidden
            className={`pointer-events-none fixed select-none overflow-hidden border ${bandClasses}`}
            style={{
                width: '200vmax',
                left: '50%',
                transform: `translateX(-50%) rotate(${rotate}deg)`,
                transformOrigin: 'center',
                zIndex: 20,
                top,
                boxShadow:
                    theme === 'light'
                        ? '0 2px 12px rgba(0,0,0,0.15)'
                        : '0 2px 12px rgba(0,0,0,0.35)',
            }}
        >
            <div className="whitespace-nowrap flex">
        <span
            className="inline-block px-8 py-2 font-semibold tracking-wide"
            style={{ animation: `ribbon-scroll ${speedSec}s linear infinite` }}
        >
          {content}
        </span>
                <span
                    className="inline-block px-8 py-2 font-semibold tracking-wide"
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
