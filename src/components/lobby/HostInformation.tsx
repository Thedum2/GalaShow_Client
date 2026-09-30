import React, { useEffect, useState } from "react";
import Icon from "@/components/icons/Icon";
import type { PlatformType } from "@/types/common";

const PLATFORM_ICONS: Record<PlatformType, string> = {
    chzzk: "chzzk_mini",
    soop: "soopmini",
    youtube: "youtube",
};

const PLATFORM_NAMES: Record<PlatformType, string> = {
    chzzk: "CHZZK",
    soop: "SOOP",
    youtube: "YouTube",
};

export interface HostConnection {
    platform: PlatformType;
    connected: boolean;
}

interface HostInformationProps {
    logoText?: string;
    streamerTag: string;
    viewerCountLabel?: string;
    hostName: string;
    description?: string;
    ratingLabel: string;
    imageUrl?: string;
    isLive?: boolean;
    /** 호스트의 방송 플랫폼. 좌측 상단 아이콘에 사용한다 */
    platform?: PlatformType;
    /** 메인 프로필이면 우측 상단에 "메인" 배지를 표시한다 */
    isMain?: boolean;
    /** 연동한 계정별 채팅 연결 상태. 이름 아래에 표시한다 */
    connections?: HostConnection[];
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
    platform = "chzzk",
    isMain = false,
    connections = [],
    className = "",
}) => {
    // 사진이 없거나 불러오지 못하면 기본 캐릭터를 보여준다.
    const [imageFailed, setImageFailed] = useState(false);
    useEffect(() => setImageFailed(false), [imageUrl]);

    return (
        <div className={`bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-3 flex flex-col items-center justify-between gap-1 shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden ${className}`}>
            <div className="flex w-full items-center justify-between">
                <Icon name={PLATFORM_ICONS[platform]} size={45}/>
                <span className="text-2xl text-white font-extrabold">{streamerTag}</span>
                {viewerCountLabel ? (
                    <div className="flex items-center gap-1 text-gray-300">
                        <Icon name="Eye" type="lucide" size={20} />
                        <span className="text-sm font-semibold">{viewerCountLabel}</span>
                    </div>
                ) : isMain ? (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-black text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                        <Icon name="Crown" type="lucide" size={14} strokeWidth={2.5} />
                        메인
                    </span>
                ) : (
                    <span className="w-[45px]" aria-hidden />
                )}
            </div>

            <div className="relative">
                <div className="h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-red-500 bg-gradient-to-br from-purple-600 to-pink-600">
                    {imageUrl && !imageFailed ? (
                        <img src={imageUrl} alt={hostName} className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white">
                            <Icon name="neneko" size={130} mode="eager" />
                        </div>
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
                {description && <p className="flex-grow text-sm font-medium text-white">{description}</p>}
            </div>

            {connections.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
                    {connections.map(({ platform: p, connected }) => (
                        <span
                            key={p}
                            title={`${PLATFORM_NAMES[p]} 채팅 ${connected ? "연결됨" : "끊김"}`}
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
                                connected ? "border-green-500/50 bg-green-500/10 text-green-200" : "border-red-500/50 bg-red-500/10 text-red-200"
                            }`}
                        >
                            <Icon name={PLATFORM_ICONS[p]} size={16} />
                            {PLATFORM_NAMES[p]}
                            <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostInformation;
