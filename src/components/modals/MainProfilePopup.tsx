import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import type { PlatformType } from "@/types/common";

export interface MainProfileOption {
    platform: PlatformType;
    /** 플랫폼 표시 이름 (SOOP, CHZZK, YouTube) */
    name: string;
    nickname: string;
    imageUrl?: string;
    color: string;
}

interface MainProfilePopupProps {
    isOpen: boolean;
    profiles: MainProfileOption[];
    initialPlatform?: PlatformType | null;
    /** 확정 즉시 호출된다(메인 프로필 저장). */
    onSelect: (platform: PlatformType) => void;
    /** 선택 연출이 끝난 뒤 호출된다(다음 화면으로 이동). */
    onComplete: () => void;
    onClose: () => void;
}

// 선택 연출 길이. 왕관·문구 애니메이션(tailwind spotlight-in, crown-drop, rise-in)이 끝난 뒤 넘어간다.
const CELEBRATION_MS = 1500;

function ProfileAvatar({ profile, size }: { profile: MainProfileOption; size: number }) {
    return (
        <div
            className="relative rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden"
            style={{ width: size, height: size, boxShadow: `0 0 0 4px ${profile.color}` }}
        >
            {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.nickname} className="h-full w-full object-cover" />
            ) : (
                <Icon name="neneko" size={size * 0.8} mode="eager" />
            )}
        </div>
    );
}

export default function MainProfilePopup({
    isOpen,
    profiles,
    initialPlatform,
    onSelect,
    onComplete,
    onClose,
}: MainProfilePopupProps) {
    const [selected, setSelected] = useState<PlatformType | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    // 열릴 때마다 현재 메인(없으면 첫 프로필)을 기본 선택으로 둔다.
    useEffect(() => {
        if (!isOpen) return;
        setConfirmed(false);
        setSelected(profiles.some((p) => p.platform === initialPlatform) ? initialPlatform! : profiles[0]?.platform ?? null);
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!confirmed) return;
        const timer = setTimeout(onComplete, CELEBRATION_MS);
        return () => clearTimeout(timer);
    }, [confirmed, onComplete]);

    useEffect(() => {
        if (!isOpen || confirmed) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, confirmed, onClose]);

    if (!isOpen) return null;

    const chosen = profiles.find((p) => p.platform === selected);

    const handleConfirm = () => {
        if (!chosen) return;
        onSelect(chosen.platform);
        setConfirmed(true);
    };

    const popupContent = (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={confirmed ? undefined : onClose}
        >
            <div
                className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl animate-popup-in"
                onClick={(e) => e.stopPropagation()}
            >
                {confirmed && chosen ? (
                    <div className="flex flex-col items-center py-6">
                        <div className="relative mt-8 animate-spotlight-in">
                            <span
                                className="absolute inset-0 rounded-full animate-glow-ring"
                                style={{ boxShadow: `0 0 0 6px ${chosen.color}` }}
                            />
                            <div className="absolute left-1/2 -top-12 z-10 animate-crown-drop text-yellow-400 drop-shadow-[0_4px_8px_rgba(234,179,8,0.6)]">
                                <Icon name="Crown" type="lucide" size={56} strokeWidth={2.5} fill="currentColor" />
                            </div>
                            <ProfileAvatar profile={chosen} size={148} />
                            <PlatformIcon platform={chosen.platform} size={44} className="absolute -bottom-1 -right-1" />
                        </div>
                        <div className="mt-6 flex flex-col items-center gap-1 text-center animate-rise-in">
                            <h2 className="text-3xl font-extrabold text-black">{chosen.nickname}</h2>
                            <p className="text-gray-600 text-sm">메인 프로필로 방송을 시작합니다</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Icon
                            name="close"
                            size={24}
                            mode="eager"
                            onClick={onClose}
                            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-black transition-colors"
                        />

                        <h2 className="text-2xl font-extrabold text-black text-center mb-2">
                            메인 프로필을 선택하세요
                        </h2>
                        <p className="text-gray-600 text-center mb-6 text-sm">
                            선택한 프로필이 게임에서 방송 호스트로 표시됩니다
                        </p>

                        <div className="flex justify-center gap-4 mb-8" role="radiogroup" aria-label="메인 프로필">
                            {profiles.map((profile) => {
                                const isSelected = profile.platform === selected;
                                return (
                                    <button
                                        key={profile.platform}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => setSelected(profile.platform)}
                                        className={`
                                            relative flex-1 max-w-[190px] rounded-2xl border-2 px-4 pt-6 pb-5
                                            flex flex-col items-center gap-3
                                            transition-all duration-200
                                            ${isSelected ? "scale-[1.04] shadow-xl" : "border-gray-200 hover:border-gray-400 hover:scale-[1.02]"}
                                        `}
                                        style={isSelected ? { borderColor: profile.color, backgroundColor: `${profile.color}0D` } : undefined}
                                    >
                                        {isSelected && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-yellow-400 border-2 border-yellow-500 px-2.5 py-0.5 text-xs font-black text-black animate-fade-in">
                                                <Icon name="Crown" type="lucide" size={14} strokeWidth={2.5} />
                                                메인
                                            </span>
                                        )}
                                        <div className="relative">
                                            <ProfileAvatar profile={profile} size={84} />
                                            <PlatformIcon platform={profile.platform} size={30} className="absolute -bottom-1 -right-1" />
                                        </div>
                                        <div className="flex flex-col items-center min-w-0 w-full">
                                            <span className="text-lg font-extrabold text-black truncate max-w-full">
                                                {profile.nickname}
                                            </span>
                                            <span className="text-xs font-bold" style={{ color: profile.color }}>
                                                {profile.name}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-14 rounded-xl bg-white text-black font-bold text-lg
                                         border-2 border-gray-300
                                         transition-all duration-200
                                         hover:bg-gray-100 hover:border-gray-400 hover:scale-[1.02]
                                         active:scale-95
                                         shadow-md"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!chosen}
                                className="flex-1 h-14 rounded-xl bg-yellow-400 text-black font-bold text-lg
                                         border-2 border-yellow-500
                                         transition-all duration-200
                                         hover:bg-yellow-500 hover:scale-[1.02]
                                         active:scale-95
                                         disabled:opacity-50 disabled:hover:scale-100
                                         shadow-lg"
                            >
                                이 프로필로 시작하기
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return createPortal(popupContent, document.body);
}
