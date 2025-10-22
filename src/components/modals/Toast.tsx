import { useEffect } from "react";
import { Icon } from "@/components/icons/Icon";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = "border-2 shadow-lg";

        switch (type) {
            case "success":
                return `${baseStyles} border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]`;
            case "error":
                return `${baseStyles} border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]`;
            case "warning":
                return `${baseStyles} border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.3)]`;
            case "info":
                return `${baseStyles} border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]`;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success":
                return "text-green-500";
            case "error":
                return "text-red-500";
            case "warning":
                return "text-yellow-500";
            case "info":
                return "text-blue-500";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return "";
            case "error":
                return "";
            case "warning":
                return " ";
            case "info":
                return "9";
        }
    };

    return (
        <div
            className={`
                relative bg-black/90 backdrop-blur-sm rounded-xl p-4 pr-12
                min-w-[300px] max-w-[400px]
                flex items-center gap-3
                animate-slide-in
                ${getToastStyles()}
            `}
        >
            <div className={`text-2xl font-bold ${getIconColor()}`}>
                {getIcon()}
            </div>
            <p className="text-white text-sm flex-1">{message}</p>
            <Icon
                name="close"
                size={20}
                mode="eager"
                onClick={() => onClose(id)}
                className="absolute top-3 right-3 cursor-pointer text-white/60 hover:text-white transition-colors"
            />
        </div>
    );
}

interface ToastContainerProps {
    toasts: Array<{
        id: string;
        type: ToastType;
        message: string;
        duration?: number;
    }>;
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}
