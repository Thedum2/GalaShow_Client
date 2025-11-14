import React from "react";
import Icon from "@/components/icons/Icon";

interface HostInformationProps {
    logoText?: string;
    streamerTag: string;
    viewerCountLabel: string;
    hostName: string;
    description: string;
    ratingLabel: string;
    imageUrl?: string;
    isLive?: boolean;
    className?: string;
}

const HostInformation: React.FC<HostInformationProps> = ({
    streamerTag,
    viewerCountLabel,
    hostName,
    description,
    ratingLabel,
    imageUrl,
    isLive = true,
    className = "",
}) => {
    return (
        <div className={`bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-3 flex flex-col items-center justify-between gap-1 shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden ${className}`}>
            <div className="flex w-full items-center justify-between">
                <Icon name="chzzk_mini" size={45}/>
                <span className="text-2xl text-white font-extrabold">{streamerTag}</span>
                <div className="flex items-center gap-1 text-gray-300">
                    <Icon name="Eye" type="lucide" size={20} />
                    <span className="text-sm font-semibold">{viewerCountLabel}</span>
                </div>
            </div>

            <div className="relative">
                <div className="h-[172px] w-[172px] overflow-hidden rounded-full border-4 border-red-500 bg-gradient-to-br from-purple-600 to-pink-600">
                    {imageUrl ? (
                        <img src={imageUrl} alt={hostName} className="h-full w-full object-cover" />
                    ) : (
                        <img src={imageUrl} alt={hostName} className="h-full w-full object-cover" />
                    )}
                </div>
                {isLive && (
                    <div className="absolute -bottom-[0px] left-1/2 -translate-x-1/2 rounded bg-red-600 px-3 py-0.5 text-s font-bold text-white">
                        LIVE
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-4xl font-black text-white">{hostName}</h2>
                <p className="flex-grow text-sm font-medium text-white">{description}</p>
            </div>
        </div>
    );
};

export default HostInformation;
