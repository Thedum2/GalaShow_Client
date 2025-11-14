import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";

interface TwoButtonPopupProps {
    title: string;
    subtitle?: string;
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    onClose?: () => void;
    isOpen: boolean;
}

export default function TwoButtonPopup({
    title,
    subtitle,
    cancelText = "거절하기",
    confirmText = "확인하기",
    onCancel,
    onConfirm,
    onClose,
    isOpen,
}: TwoButtonPopupProps) {
    if (!isOpen) return null;

    const handleCancel = () => {
        if (onCancel) onCancel();
        if (onClose) onClose();
    };

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

                {/* Title */}
                <h2 className="text-2xl font-extrabold text-black text-center mb-2">
                    {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-gray-600 text-center mb-6 text-sm">{subtitle}</p>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 h-14 rounded-xl bg-white text-black font-bold text-lg
                                 border-2 border-gray-300
                                 transition-all duration-200
                                 hover:bg-gray-100 hover:border-gray-400 hover:scale-[1.02]
                                 active:scale-95
                                 shadow-md"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex-1 h-14 rounded-xl bg-yellow-400 text-black font-bold text-lg
                                 border-2 border-yellow-500
                                 transition-all duration-200
                                 hover:bg-yellow-500 hover:scale-[1.02]
                                 active:scale-95
                                 shadow-lg"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(popupContent, document.body);
}
