import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";

interface EmojiOneButtonPopupProps {
    title: string;
    subtitle?: string;
    emoji?: string;
    buttonText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    isOpen: boolean;
}

export default function EmojiOneButtonPopup({
    title,
    subtitle,
    emoji = "🎉",
    buttonText = "Thanks!",
    onConfirm,
    onClose,
    isOpen,
}: EmojiOneButtonPopupProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (onClose) onClose();
    };

    const popupContent = (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div
                className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                {onClose && (
                    <Icon
                        name="close"
                        size={24}
                        mode="eager"
                        onClick={onClose}
                        className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-black transition-colors"
                    />
                )}

                {/* Emoji */}
                <div className="text-7xl text-center mb-6 animate-bounce-slow">
                    {emoji}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-extrabold text-black text-center mb-2">
                    {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-gray-600 text-center mb-6 text-sm">{subtitle}</p>
                )}

                {/* Button */}
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="w-full h-14 rounded-xl bg-black text-white font-bold text-lg
                             border-2 border-black
                             transition-all duration-200
                             hover:bg-gray-800 hover:border-gray-800 hover:scale-[1.02]
                             active:scale-95
                             shadow-lg"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );

    return createPortal(popupContent, document.body);
}
