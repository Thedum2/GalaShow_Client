import React from "react";
import Tilt from "react-parallax-tilt";
import { LoginCardProps } from "@/types/components";

export default function LoginCard({
  title,
  subtext,
  color,
  titleColor,
  subtextColor,
  buttonText,
  buttonIcon,
  onClick,
  disabled,
  logo,
  borderWidth,
  borderColor,
}: LoginCardProps) {
  const cardStyle = {
    borderWidth: borderWidth ?? '1px',
    borderColor: borderColor ?? 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'solid' as const,
  };

  return (
    <Tilt
        className="background-stripes parallax-effect-glare-scale"
        perspective={500}
        glareEnable={true}
        glareMaxOpacity={0.45}
        scale={1.02}
    >
      <div
        className={`
          relative group rounded-2xl bg-gradient-to-b from-neutral-900/70 to-neutral-900/40
          backdrop-blur-md shadow-lg
          w-[449px] h-[275px] flex flex-col overflow-hidden
          transition-all duration-300
          ${disabled ? "opacity-80" : "hover:shadow-2xl"}
          gap-0
        `}
        style={cardStyle}
      >
        <div className="relative z-10 flex flex-col flex-grow h-full p-2">
          <div className="grow-[3] basis-0 flex justify-center items-center overflow-hidden p-4">
            {logo}
          </div>

          <div className="basis-0 grow-[3] gap-1 flex flex-col justify-center items-center text-center overflow-hidden p-2">
            <h3
              className="text-3xl font-bold tracking-tight truncate"
              style={{ color: titleColor || 'white' }}
            >
              {title}
            </h3>
            {subtext && (
              <h5
                className="text-lg font-bold tracking-tight truncate"
                style={{ color: subtextColor || '#6B7280' }}
              >
                {subtext}
              </h5>
            )}
          </div>

          <div className="grow basis-0 flex justify-center items-center p-4">
            <button
              onClick={disabled ? undefined : onClick}
              disabled={disabled}
              className={`
                w-full max-w-xs h-14 rounded-xl px-6 text-xl font-semibold
                flex justify-center items-center gap-2
                transition-all duration-200 border border-transparent
                disabled:bg-neutral-700/60 disabled:text-white/60 disabled:cursor-not-allowed
                group-hover:scale-105 group-hover:shadow-lg
              `}
              style={!disabled ? { backgroundColor: color, color: '#ffffff' } : {}}
            >
              {buttonIcon}
              <span>{buttonText}</span>
            </button>
          </div>
        </div>
      </div>
    </Tilt>
  );
}