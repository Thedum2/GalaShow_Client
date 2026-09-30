import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CountdownPopupProps {
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    /** 카운트다운 시작 숫자 */
    seconds?: number;
    /** "시작!"을 보여준 뒤 호출된다. */
    onComplete: () => void;
    onCancel?: () => void;
}

// "시작!" 문구를 보여주는 시간
const GO_MS = 700;

export default function CountdownPopup({
    isOpen,
    title = "게임을 시작합니다",
    subtitle,
    seconds = 3,
    onComplete,
    onCancel,
}: CountdownPopupProps) {
    const [count, setCount] = useState(seconds);

    useEffect(() => {
        if (isOpen) setCount(seconds);
    }, [isOpen, seconds]);

    useEffect(() => {
        if (!isOpen) return;
        const timer = count > 0
            ? setTimeout(() => setCount((c) => c - 1), 1000)
            : setTimeout(onComplete, GO_MS);
        return () => clearTimeout(timer);
    }, [isOpen, count, onComplete]);

    useEffect(() => {
        if (!isOpen || !onCancel || count === 0) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onCancel, count]);

    if (!isOpen) return null;

    const isGo = count === 0;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl px-10 pt-8 pb-7 w-full max-w-sm mx-4 shadow-2xl flex flex-col items-center animate-popup-in">
                <h2 className="text-2xl font-extrabold text-black text-center">{title}</h2>
                {subtitle && <p className="mt-1 text-gray-600 text-center text-sm">{subtitle}</p>}

                <div className="relative my-7 flex h-40 w-40 items-center justify-center" aria-live="assertive">
                    {/* 숫자가 바뀔 때마다 key가 바뀌어 애니메이션이 다시 재생된다 */}
                    <span key={`ring-${count}`} className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-count-ring motion-reduce:hidden" />
                    <div className={`absolute inset-0 rounded-full ${isGo ? "bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)]" : "bg-black"}`} />
                    <span
                        key={count}
                        className={`relative font-black animate-count-pop motion-reduce:animate-none ${isGo ? "text-5xl text-black" : "text-8xl text-yellow-400"}`}
                    >
                        {isGo ? "시작!" : count}
                    </span>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isGo}
                        className="w-full h-12 rounded-xl bg-white text-black font-bold text-base
                                 border-2 border-gray-300 transition-all duration-200
                                 hover:bg-gray-100 hover:border-gray-400 active:scale-95
                                 disabled:opacity-40 disabled:hover:bg-white"
                    >
                        취소
                    </button>
                )}
            </div>
        </div>,
        document.body,
    );
}
