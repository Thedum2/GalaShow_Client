import React from "react";
import { Star } from "lucide-react";
import {StartGameButtonProps} from "@/types/components";

export default function StartGameButton({ className = "", onClick }: StartGameButtonProps) {
    return (
        <div
            className={className
            }
        >
            <button
                type="button"
                aria-label="게임 시작"
                onClick={onClick}
                className={[
                    "border-2 border-yellow-500 rounded-xl",
                    "group relative w-full h-20 rounded-[14px] overflow-hidden",
                    "bg-black bg-opacity-25 text-white",
                    "flex items-center justify-center gap-4",
                    "transition-all duration-300 ease-out",
                    "hover:scale-[1.02] active:scale-95",
                    "outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    "hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]",
                ].join(" ")}
            >
                {/* 중앙 컨텐츠 */}
                <Star
                    className="text-yellow-400 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                    fill="currentColor"
                />
                <span className="text-2xl font-extrabold tracking-wide">게임 시작!</span>
                <Star
                    className="text-yellow-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                    fill="currentColor"
                />

                {/* 샤인 스윕(빛 쓸고 지나감) */}
                <span
                    className={[
                        "pointer-events-none absolute inset-y-0",
                        "left-[-30%] w-[30%] skew-x-12",
                        "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                        "transition-[left] duration-1000 ease-out",
                        "group-hover:left-[120%]",
                    ].join(" ")}
                />

                {/* 라디얼 글로우(미세한 중심광) */}
                <span
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(250,204,21,0.10) 0%, transparent 60%)",
                    }}
                />

                {/* 스파클 파티클(빠바밤 느낌) */}
                <span
                    className={[
                        "pointer-events-none absolute w-2 h-2 rounded-full bg-yellow-300",
                        "left-1/3 top-1/2 opacity-0",
                        "transition-all duration-500 ease-out",
                        "group-hover:opacity-100 group-hover:-translate-y-8 group-hover:translate-x-6",
                    ].join(" ")}
                />
                <span
                    className={[
                        "pointer-events-none absolute w-[6px] h-[6px] rounded-full bg-amber-200",
                        "left-[55%] top-[45%] opacity-0",
                        "transition-all duration-500 ease-out delay-75",
                        "group-hover:opacity-100 group-hover:-translate-y-5 group-hover:-translate-x-8",
                    ].join(" ")}
                />
                <span
                    className={[
                        "pointer-events-none absolute w-[5px] h-[5px] rounded-full bg-yellow-400",
                        "left-[65%] top-[58%] opacity-0",
                        "transition-all duration-500 ease-out delay-150",
                        "group-hover:opacity-100 group-hover:-translate-y-9 group-hover:translate-x-3",
                    ].join(" ")}
                />
            </button>
        </div>
    );
}
