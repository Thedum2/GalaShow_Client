import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {Step, StepExtra, StepsBoxProps} from '@/types/components';

const StepsBox: React.FC<StepsBoxProps> = ({ title, stepSets = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const allSteps = useMemo(() => stepSets.flat(), [stepSets]);
    const stepSpacingPct = 100;

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === allSteps.length - 1 ? 0 : prev + 1));
    }, [allSteps.length]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(goNext, 3000);
    }, [goNext]);

    useEffect(() => {
        if (allSteps.length > 1) startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [allSteps.length, startTimer]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [stepSets]);

    const handleSlideClick = (index: number) => {
        setCurrentIndex(index);
        startTimer();
    };

    const handleMouseEnter = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleMouseLeave = () => {
        startTimer();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setCurrentIndex((p) => (p === 0 ? allSteps.length - 1 : p - 1));
        }
    };

    if (!allSteps || allSteps.length === 0) {
        return (
            <div className="w-full max-w-[1447px] h-[300px] mx-auto bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
                <p>No steps to display.</p>
            </div>
        );
    }

    return (
        <div
            className="relative w-full max-w-[1447px] h-[300px] mx-auto bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col p-6"
            style={{
                boxShadow:
                    '0 0 40px 8px rgba(100, 180, 255, 0.3), 0 0 12px 2px rgba(100, 180, 255, 0.15) inset',
            }}
        >
            <div className="flex items-center justify-between mb-2 ml-4">
                <h2 className="md:text-2xl font-bold">{title}</h2>
                <span className="text-xs md:text-sm text-white/60">{currentIndex + 1} / {allSteps.length}</span>
            </div>

            <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.2),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.15),transparent_60%)]" />
            </div>

            <div
                className="flex-grow relative overflow-hidden rounded-xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label={title}
                aria-live="polite"
            >
                {allSteps.map((raw, i) => {
                    const step = raw as Step & StepExtra;
                    const offset = i - currentIndex;
                    const isActive = offset === 0;

                    const transform = `translateX(calc(-50% + ${offset * stepSpacingPct}%)) scale(${
                        isActive ? 1 : 0.95
                    })`;
                    const zIndex = allSteps.length - Math.abs(offset);

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: '80%',
                                height: '100%',
                                left: '45%',
                                transform,
                                transformOrigin: 'center center',
                                opacity: isActive ? 1 : 0.85,
                                filter: `blur(${isActive ? 0 : 0.5}px)`,
                                zIndex,
                                transition:
                                    'transform 420ms cubic-bezier(.2,.7,.2,1), opacity 280ms ease, filter 280ms ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                willChange: 'transform',
                            }}
                            onClick={() => handleSlideClick(i)}
                            aria-hidden={!isActive}
                        >
                            <div className="p-1 relative w-full h-[92%] rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                                <div
                                    className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
                                        isActive ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    style={{
                                        boxShadow:
                                            'inset 0 0 0 1px rgba(255,255,255,0.16), 0 0 36px 8px rgba(56,189,248,0.2)',
                                    }}
                                />

                                <div className="relative z-10 h-full grid grid-cols-12 gap-3 md:gap-4 p-3 md:p-4">
                                    <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <div className="relative shrink-0">
                                                <div
                                                    className="p-3 rounded-xl ring-1 ring-white/20"
                                                    style={{
                                                        backgroundColor:(step as any).iconBgColor || 'rgba(255,255,255,0.08)',
                                                    }}
                                                >
                                                    {step.icon}
                                                </div>
                                                <div
                                                    className="absolute inset-0 -z-10 rounded-2xl"
                                                    style={{
                                                        boxShadow: `0 0 0 8px ${step.accent || 'rgba(56,189,248,0.12)'}`,
                                                    }}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-extrabold text-2xl leading-tight truncate">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-1 text-xl text-white/75 leading-snug overflow-hidden text-ellipsis">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {typeof step.progress === 'number' && (
                                            <div className="mt-3">
                                                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${Math.max(0, Math.min(100, step.progress!))}%`,
                                                            background:
                                                                'linear-gradient(90deg, rgba(56,189,248,0.9), rgba(167,139,250,0.9))',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-0.5 text-xl text-white/60">
                                                    {Math.round(step.progress!)}%
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                                        <div className="relative w-full rounded-lg overflow-hidden border border-white/15 bg-white/5 h-[120px] md:h-[140px]">
                                            {step.media ? (
                                                <div className="w-full h-full">{step.media}</div>
                                            ) : step.mediaUrl ? (
                                                <img
                                                    src={step.mediaUrl}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full relative">
                                                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0_8px,transparent_8px_16px)]" />
                                                    <div className="absolute inset-0 grid place-items-center">
                                                        <div className="px-2.5 py-0.5 rounded-full border border-white/15 bg-white/10 text-[10px] text-white/75">
                                                            Preview
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute left-2 top-2 px-1.5 py-0.5 rounded text-[10px] bg-black/40 border border-white/10">
                                                {step.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 flex items-center justify-center gap-2.5">
                {allSteps.map((s, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlideClick(index)}
                        className={`relative group h-2.5 w-2.5 rounded-full p-0 transition-all ${
                            currentIndex === index ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={currentIndex === index}
                        title={(s as Step & StepExtra).title || `Step ${index + 1}`}
                    >
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[10px] bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {(s as Step & StepExtra).title}
            </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StepsBox;
