import React from "react";
import { LoginCardProps } from "@/types/components";

export default function LoginCard({
  title,
  color,
  buttonText,
  buttonIcon,
  onClick,
  disabled,
  logo,
  glow,
}: LoginCardProps) {
  return (
    <div
      className={`
        relative group rounded-2xl bg-gradient-to-b from-neutral-900/70 to-neutral-900/40
        border border-white/10 backdrop-blur-md shadow-lg
        w-[449px] h-[275px] flex flex-col overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        gap-0
        ${disabled ? "opacity-80" : ""}
      `}
    >

      {/* Section 1: Logo (Ratio 2) */}
      <div className="grow-[2] basis-0 flex justify-center items-center overflow-hidden p-4">
        {logo}
      </div>

      {/* Section 2: Text (Ratio 1) */}
      <div className="grow basis-0 flex flex-col justify-center items-center text-center overflow-hidden p-4">
        <h3 className="text-3xl font-bold text-white tracking-tight truncate">{title}</h3>
      </div>

      {/* Section 3: Button (Ratio 1) */}
      <div className="grow basis-0 flex justify-center items-center p-4">
        <button
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          className={`
            w-full max-w-xs h-14 rounded-xl px-6 text-xl font-semibold
            flex justify-center items-center gap-2
            transition-all duration-200 border border-transparent
            disabled:bg-neutral-700/60 disabled:text-white/60 disabled:cursor-not-allowed
          `}
          style={!disabled ? { backgroundColor: color, color: '#ffffff' } : {}}
        >
          {buttonIcon}
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
