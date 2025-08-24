import {Lock} from "lucide-react";
import React from "react";
import {LoginCardProps} from "@/types/components";


const COLOR_MAP: Record<LoginCardProps["color"], string> = {
    blue: "bg-blue-600 hover:bg-blue-500 border-blue-400/20",
    green: "bg-green-600 hover:bg-green-500 border-green-400/20",
    gray: "bg-gray-600 hover:bg-gray-500 border-gray-400/20",
    indigo: "bg-indigo-600 hover:bg-indigo-500 border-indigo-400/20",
};

export default function LoginCard({
                                      title,
                                      subtitle,
                                      color,
                                      buttonText,
                                      onClick,
                                      disabled,
                                      logo,
                                      glow = "ring-indigo-500/40",
                                  }: LoginCardProps) {
    const colorClass = COLOR_MAP[color] ?? COLOR_MAP.indigo;

    return (
        <div
            className={`relative group rounded-2xl bg-gradient-to-b from-neutral-900/70 to-neutral-900/40 
      border border-white/10 backdrop-blur-md p-6 sm:p-8
      shadow-[0_10px_30px_rgba(0,0,0,0.35)]
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]
      focus-within:-translate-y-1
      ${disabled ? "opacity-80" : ""}`}
        >
            <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-2 ${glow}`}
            />
            <div className="flex items-center gap-3">
                <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    {logo ?? <Lock className="text-white/80"/>}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={disabled ? undefined : onClick}
                    disabled={disabled}
                    className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-semibold
          transition-all duration-200 border 
          ${
                        disabled
                            ? "bg-neutral-700/60 text-white/60 border-white/10 cursor-not-allowed"
                            : `${colorClass} text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]`
                    }`}
                >
                    {buttonText}
                </button>
            </div>

            {!disabled && (
                <div className="mt-3 text-xs text-white/50">
                    계속하면 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
                </div>
            )}
        </div>
    );
}
