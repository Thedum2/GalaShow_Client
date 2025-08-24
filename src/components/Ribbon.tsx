import {useMemo} from "react";

type RibbonProps = {
    text: string;
    rotate?: number;
    top?: string;
    left?: string;
    width?: string;
    speedSec?: number;
    theme?: "light" | "dark";

};

export default function Ribbon({
                    text,
                    rotate = 0,
                    top = "10%",
                    left = "-10%",
                    width = "120%",
                    speedSec = 20,
                    theme = "light",
                }: RibbonProps) {

    const content = useMemo(() => Array(2).fill(text).join("   •   "), [text]);
    const bandClasses =
        theme === "light"
            ? "bg-white/90 text-black border-black/20"
            : "bg-black/70 text-white border-white/20";

    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute z-0 select-none overflow-hidden border ${bandClasses}`}
            style={{
                top,
                left,
                width,
                transform: `rotate(${rotate}deg)`,
                boxShadow:
                    theme === "light"
                        ? "0 2px 12px rgba(0,0,0,0.15)"
                        : "0 2px 12px rgba(0,0,0,0.35)",
            }}
        >
            <div className="whitespace-nowrap flex">
        <span
            className="inline-block px-8 py-2 font-semibold tracking-wide"
            style={{
                animation: `ribbon-scroll ${speedSec}s linear infinite`,
            }}
        >
          {content}
        </span>
                <span
                    className="inline-block px-8 py-2 font-semibold tracking-wide"
                    style={{
                        animation: `ribbon-scroll ${speedSec}s linear infinite`,
                    }}
                    aria-hidden
                >
          {content}
        </span>
            </div>
        </div>
    );
}