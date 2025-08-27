import { useEffect, useMemo, useState } from 'react'
import {FitMode} from "@/types/common";

export function useScaleFit(
    designW: number,
    designH: number,
    mode: FitMode = 'contain',
    opts?: { minScale?: number; maxScale?: number; bleedRatio?: number }
) {
    const [vw, setVw] = useState(() => (typeof window === 'undefined' ? designW : window.innerWidth))
    const [vh, setVh] = useState(() => (typeof window === 'undefined' ? designH : window.innerHeight))

    useEffect(() => {
        const onResize = () => {
            setVw(window.innerWidth)
            setVh(window.innerHeight)
        }
        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const scale = useMemo(() => {
        const sx = vw / designW
        const sy = vh / designH
        const sContain = Math.min(sx, sy)
        const sCover   = Math.max(sx, sy)

        let s =
            mode === 'contain' ? sContain :
                mode === 'cover'   ? sCover   :
                    mode === 'width'   ? sx       :
                        mode === 'height'  ? sy       :
                            sContain + (sCover - sContain) * clamp(opts?.bleedRatio ?? 0.18, 0, 1)

        if (opts?.maxScale != null) s = Math.min(s, opts.maxScale)
        if (opts?.minScale != null) s = Math.max(s, opts.minScale)
        return s
    }, [vw, vh, designW, designH, mode, opts?.bleedRatio, opts?.maxScale, opts?.minScale])

    const scaledW = designW * scale
    const scaledH = designH * scale

    return { scale, scaledW, scaledH }
}

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n))
}
