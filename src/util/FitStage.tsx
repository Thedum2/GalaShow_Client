import { useScaleFit } from './useScaleFit';
import {FitStageProps} from "@/types/common";

const DEFAULT_W = 1920
const DEFAULT_H = 1080

export default function FitStage({
                                     mode = 'contain',
                                     bleedRatio = 0.18,
                                     className,
                                     children,
                                 }: FitStageProps) {
    const { scale, scaledW, scaledH } = useScaleFit(DEFAULT_W, DEFAULT_H, mode, { bleedRatio })

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                background: 'transparent',
                zIndex: 20,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: scaledW,
                    height: scaledH,
                    willChange: 'transform',
                    contain: 'layout paint size',
                }}
            >
                <div
                    style={{
                        width: DEFAULT_W,
                        height: DEFAULT_H,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        willChange: 'transform',
                    }}
                    className={className}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}