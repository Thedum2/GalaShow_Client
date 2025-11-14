import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Step, StepExtra } from '@/types/common';

interface StepsBoxProps {
    title: string;
    stepSets: Step[][];
}

const StepsBox: React.FC<StepsBoxProps> = ({ title, stepSets = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const allSteps = useMemo(() => stepSets.flat(), [stepSets]);

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

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
        startTimer();
    };

    return (
        <div
            className="relative w-full max-w-[1447px] h-[195px] mx-auto bg-black rounded-2xl flex flex-col p-3"
            style={{
                borderWidth: '1px',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderStyle: 'solid',}}
        >
            <div
                className="flex-grow relative overflow-hidden rounded-xl"
                aria-label={title}
                aria-live="polite"
            >
                {allSteps.map((raw, i) => {
                    const step = raw as Step & StepExtra;
                    const isActive = i === currentIndex;

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: isActive ? 1 : 0,
                                transition: 'opacity 500ms ease-in-out',
                                willChange: 'opacity',
                            }}
                            aria-hidden={!isActive}
                        >
                            <div className="w-full h-full rounded-2xl pl-5 pr-5">
                                <div className="relative z-10 h-full grid grid-cols-12 gap-3 md:gap-4">
                                    <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <div className="relative shrink-0">
                                                <div
                                                    className="p-1 rounded-xl ring-1 ring-white/20"
                                                    style={{
                                                        backgroundColor: step.iconBgColor || 'rgba(255,255,255,0.08)',
                                                    }}
                                                >
                                                    {step.icon}
                                                </div>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-2.5">
                {allSteps.map((s, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`relative group h-2.5 w-2.5 rounded-full p-0 transition-all ${
                            currentIndex === index ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={currentIndex === index}
                    />
                ))}
            </div>
        </div>
    );
};

export default StepsBox;