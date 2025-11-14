import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";

interface OneButtonPopupProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    isOpen: boolean;
}

export default function OneButtonPopup({
    title,
    subtitle,
    buttonText = "확인하기",
    onConfirm,
    onClose,
    isOpen,
}: OneButtonPopupProps) {
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
                    className="w-full h-14 rounded-xl bg-yellow-400 text-black font-bold text-lg
                             border-2 border-yellow-500
                             transition-all duration-200
                             hover:bg-yellow-500 hover:scale-[1.02]
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
