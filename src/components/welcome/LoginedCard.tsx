import React from "react";
import Tilt from "react-parallax-tilt";
import { LoginedCardProps } from "@/types/components";
import Icon from "@/components/icons/Icon";
export default function LoginedCard({
    title = "네네코 마시로",
    colorForConnected ="#979797",
    colorForDisConnect ="#505050",
    titleColor,
    buttonTextForConnected = "연결됨",
    buttonTextForDisConnect = "연결 해제하기",
    buttonIconForConnected = <Icon name="verified_account" size={28} mode="eager" />,
    buttonIconForDisConnect = <Icon name="logout" size={28} mode="eager" />,
    onClick,
    disabled,
    logo,
    loginedIcon = <Icon name="neneko" size={83} mode="eager" />,
    borderWidth,
    borderColor,
}: LoginedCardProps) {
    const cardStyle = {
        borderWidth: borderWidth ?? '1px',
        borderColor: borderColor ?? 'rgba(113, 67, 67, 0.5)',
        borderStyle: 'solid' as const,
    };

    return (
        <Tilt
            className="background-stripes parallax-effect-glare-scale"
            perspective={500}
            glareEnable={true}
            glareMaxOpacity={0.45}
            scale={1.02}
        >
            <div
                className={`
          relative group rounded-2xl bg-gradient-to-b from-neutral-900/70 to-neutral-900/40
          backdrop-blur-md shadow-lg
          w-[449px] h-[275px] flex flex-col overflow-hidden
          transition-all duration-300
          ${disabled ? "opacity-80" : "hover:shadow-2xl"}
          gap-0
        `}
                style={cardStyle}
            >
                <div className="relative z-10 flex flex-col flex-grow h-full p-2">
                    <div className="grow-[3] basis-0 flex justify-center items-center overflow-hidden p-4 gap-4" >
                        {logo}
                        <Icon name="x" size={44} mode="eager" />
                        {loginedIcon}
                    </div>


                    <div className="basis-0 grow-[3] gap-1 flex flex-col justify-center items-center text-center overflow-hidden p-2">
                        <h3
                            className="text-4xl font-bold tracking-tight truncate"
                            style={{ color: titleColor || 'white' }}
                        >
                            {title}
                        </h3>


                    </div>

                    <div className=" flex flex-col justify-center items-center text-center ">
                        <div className="border-b border-width-[2.5px] w-[80%]" style={{ borderColor: borderColor }}></div>
                    </div>



                    <div className="grow basis-0 flex justify-center items-center p-4 gap-2">
                        <button
                            onClick={disabled ? undefined : onClick}
                            disabled={disabled}
                            className={`
                w-[115px] max-w-xs h-[43px] rounded-full px-2 text-lg font-black
                flex justify-center items-center gap-2
                transition-all duration-200 border border-transparent
                disabled:bg-neutral-700/60 disabled:text-white/60 disabled:cursor-not-allowed
                group-hover:scale-105 group-hover:shadow-lg
              `}
                            style={!disabled ? { backgroundColor: colorForConnected, color: '#000000' } : {}}
                        >
                            {buttonIconForConnected}
                            <span>{buttonTextForConnected}</span>
                        </button>

                        <button
                            onClick={disabled ? undefined : onClick}
                            disabled={disabled}
                            className={`
                w-[164px] max-w-xs h-[43px] rounded-full px-2 text-lg font-black
                flex justify-center items-center gap-2
                transition-all duration-200 border border-transparent
                disabled:bg-neutral-700/60 disabled:text-white/60 disabled:cursor-not-allowed
                group-hover:scale-105 group-hover:shadow-lg
              `}
                            style={!disabled ? { backgroundColor: colorForDisConnect, color: '#ffffff' } : {}}
                        >
                            {buttonIconForDisConnect}
                            <span>{buttonTextForDisConnect}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Tilt>
    );
}