import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";

export type ImprovedToastType = "success" | "error" | "warning" | "info";

interface ImprovedToastProps {
    id: string;
    type: ImprovedToastType;
    message: string;
    duration?: number;
    index: number;
    onClose: (id: string) => void;
}

export function ImprovedToast({
    id,
    type,
    message,
    duration = 1000,
    index,
    onClose,
}: ImprovedToastProps) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // 인덱스에 따라 지연 시간 추가 (각 토스트마다 400ms씩 차이)
        const delayPerToast = 400;
        const adjustedDuration = duration + (index * delayPerToast);

        // 사라지기 시작하는 타이머
        const closeTimer = setTimeout(() => {
            setIsClosing(true);
        }, adjustedDuration);

        // 애니메이션 완료 후 실제 제거
        const removeTimer = setTimeout(() => {
            onClose(id);
        }, adjustedDuration + 300); // 애니메이션 시간(0.3s) 추가

        return () => {
            clearTimeout(closeTimer);
            clearTimeout(removeTimer);
        };
    }, [id, duration, index, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case "success":
                return "bg-white border-2 border-green-500 shadow-[0_8px_32px_rgba(34,197,94,0.4)]";
            case "error":
                return "bg-white border-2 border-red-500 shadow-[0_8px_32px_rgba(239,68,68,0.4)]";
            case "warning":
                return "bg-white border-2 border-yellow-500 shadow-[0_8px_32px_rgba(250,204,21,0.4)]";
            case "info":
                return "bg-white border-2 border-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.4)]";
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success":
                return "text-green-500 bg-green-50";
            case "error":
                return "text-red-500 bg-red-50";
            case "warning":
                return "text-yellow-500 bg-yellow-50";
            case "info":
                return "text-blue-500 bg-blue-50";
        }
    };

    const getIconName = () => {
        switch (type) {
            case "success":
                return "Check";
            case "error":
                return "X";
            case "warning":
                return "AlertTriangle";
            case "info":
                return "Info";
        }
    };

    const getProgressBarColor = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            case "info":
                return "bg-blue-500";
        }
    };

    // 인덱스에 따라 조정된 duration 계산
    const delayPerToast = 400;
    const adjustedDuration = duration + (index * delayPerToast);

    return (
        <div
            className="transition-all duration-300 ease-out overflow-hidden pointer-events-none"
            style={{
                maxHeight: isClosing ? '0' : '120px',
                marginBottom: isClosing ? '0' : '12px',
                opacity: isClosing ? '0' : '1',
            }}
        >
            <div
                className={`
                    relative
                    rounded-xl
                    min-w-[300px] max-w-[400px]
                    ${isClosing ? '' : 'animate-slide-down'}
                    ${getToastStyles()}
                    transform
                    overflow-hidden
                `}
            >
                <div className="p-3 flex items-center gap-3">
                    {/* Icon */}
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor()}`}
                    >
                        <Icon name={getIconName()} type="lucide" size={20} />
                    </div>

                    {/* Message */}
                    <p className="text-black font-semibold text-sm flex-1">{message}</p>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30 rounded-b-xl overflow-hidden">
                    <div
                        className={`h-full ${getProgressBarColor()} transition-all ease-linear`}
                        style={{
                            width: isClosing ? '0%' : '100%',
                            transitionDuration: isClosing ? '0ms' : `${adjustedDuration}ms`,
                            animation: isClosing ? 'none' : `progress-shrink ${adjustedDuration}ms linear forwards`,
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes progress-shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

interface ImprovedToastContainerProps {
    toasts: Array<{
        id: string;
        type: ImprovedToastType;
        message: string;
        duration?: number;
    }>;
    onClose: (id: string) => void;
}

export function ImprovedToastContainer({
    toasts,
    onClose,
}: ImprovedToastContainerProps) {
    const containerContent = (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col">
            {toasts.map((toast, index) => (
                <ImprovedToast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration}
                    index={index}
                    onClose={onClose}
                />
            ))}
        </div>
    );

    return createPortal(containerContent, document.body);
}
