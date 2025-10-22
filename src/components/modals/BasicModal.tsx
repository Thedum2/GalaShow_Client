import { Icon } from "@/components/icons/Icon";
interface Button {
    text: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

interface BasicModalProps {
    title: string;
    subtitle?: string;
    picture?: string;
    svg?: React.ReactNode;
    buttons?: Button | Button[];
    onClose?: () => void;
    isOpen: boolean;
}

export default function BasicModal({
    title,
    subtitle,
    picture,
    svg,
    buttons = { text: "확인" },
    onClose,
    isOpen,
}: BasicModalProps) {
    if (!isOpen) return null;

    const buttonArray = Array.isArray(buttons) ? buttons : [buttons];

    const getButtonStyles = (variant: "primary" | "secondary" = "primary") => {
        const baseStyles = [
            "h-14 rounded-xl",
            "border-2",
            "text-lg font-bold",
            "transition-all duration-300 ease-out",
            "hover:scale-[1.02] active:scale-95",
            "outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
        ];

        if (variant === "primary") {
            return [
                ...baseStyles,
                "border-yellow-500 bg-black text-white",
                "hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]",
            ].join(" ");
        } else {
            return [
                ...baseStyles,
                "border-gray-500 bg-transparent text-white/80",
                "hover:border-gray-400 hover:text-white",
            ].join(" ");
        }
    };

    const handleButtonClick = (button: Button) => {
        if (button.onClick) {
            button.onClick();
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div
                className="relative bg-black/80 border-2 border-yellow-500 rounded-xl p-8 max-w-md w-full mx-4 shadow-[0_0_40px_rgba(250,204,21,0.25)]"
                onClick={(e) => e.stopPropagation()}
            >
                {onClose && (
                    <Icon
                        name="close"
                        size={24}
                        mode="eager"
                        onClick={onClose}
                        className="absolute top-4 right-4 cursor-pointer"
                    />
                )}
                {svg && (
                   <div className="w-20 h-20 rounded-full mb-4 mt-4 flex items-center justify-center bg-yellow-200 mx-auto">
                    {svg}
                   </div>
                )}
                {picture && (
                    <img
                        src={picture}
                        alt="picture"
                        className="w-full h-full object-cover rounded-xl mb-4 mt-4"
                    />
                )}
                {/* Title */}
                <h2 className="text-2xl font-extrabold text-white text-center mb-4">
                    {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-white/80 text-center mb-6">{subtitle}</p>
                )}

                {/* Buttons */}
                <div
                    className={`flex gap-3 ${buttonArray.length === 1 ? "" : "flex-row"}`}
                >
                    {buttonArray.map((button, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleButtonClick(button)}
                            className={`flex-1 ${getButtonStyles(button.variant)}`}
                        >
                            {button.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

{/** 예시 */}
{/* <BasicModal
    title="Result"
    subtitle="Result"
    buttons={[
        {
            text: "거절하기",
            onClick: () => {
                console.log("거절하기");
            },
            variant: "secondary",
        },
        {
            text: "확인하기",
            onClick: () => {
                console.log("수락하기");
            },
            variant: "primary",
        },
    ]}
    isOpen={true}
    picture="https://picsum.photos/200/300"
    onClose={() => {
        console.log("닫기");
    }}
/> */}
{/* <BasicModal
    title="Result"
    subtitle="Result"
    buttons={[{ text: "확인", onClick: () => { console.log("확인"); } }]}
    isOpen={tru
    onClose={() => { console.log("닫기"); }}
/> */}
{/* <BasicModal
                title="Your order has been placed!"
                buttons={[
                    {
                        text: "Thanks!",
                        onClick: () => {
                            console.log("수락하기");
                        },
                        variant: "primary",
                    },
                ]}
                isOpen={true}
                svg={<Icon name="celebrate" size={50} className="text-yellow-500" />}
                onClose={() => {
                    console.log("닫기");
                }}
            /> */}