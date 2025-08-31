import React, { useState, useRef, MouseEvent } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: -1, y: -1 });
  };

  const getCardStyle = () => {
    if (!isHovering || !cardRef.current) return {};
    const { width, height } = cardRef.current.getBoundingClientRect();
    const { x, y } = mousePosition;
    const rotateX = (y / height - 0.5) * -15;
    const rotateY = (x / width - 0.5) * 15;
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  const getGlowStyle = () => {
    if (!isHovering || !glow) return { background: 'none' };
    const { x, y } = mousePosition;
    return {
      backgroundImage: `radial-gradient(circle at ${x}px ${y}px, ${glow}80, transparent 20%)`,
    };
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={getCardStyle()}
      className={`
        relative group rounded-2xl bg-gradient-to-b from-neutral-900/70 to-neutral-900/40
        border border-white/10 backdrop-blur-md shadow-lg
        w-[449px] h-[275px] flex flex-col overflow-hidden
        transition-all duration-300
        ${disabled ? "opacity-80" : "hover:shadow-2xl"}
        gap-0
      `}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 z-0" style={getGlowStyle()} />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col flex-grow h-full">
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
  );
}
