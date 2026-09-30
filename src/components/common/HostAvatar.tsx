import { useEffect, useState } from "react";
import Icon from "@/components/icons/Icon";
import { selectMainBroadcaster, usePolyChatStore } from "@/stores/polychat";

/**
 * 메인 프로필(방송 호스트) 사진. 사진이 없거나 불러오지 못하면 기본 캐릭터를 보여준다.
 */
export default function HostAvatar({ size, className = "" }: { size: number; className?: string }) {
    const host = usePolyChatStore(selectMainBroadcaster);
    const url = host?.profileImageUrl;
    const [failed, setFailed] = useState(false);
    useEffect(() => setFailed(false), [url]);

    return (
        <div
            className={`relative shrink-0 rounded-full ring-4 ring-red-500 overflow-hidden bg-white ${className}`}
            style={{ width: size, height: size }}
        >
            {url && !failed ? (
                <img src={url} alt={host?.nickname ?? "방송 호스트"} className="h-full w-full object-cover" onError={() => setFailed(true)} />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <Icon name="neneko" size={Math.round(size * 0.8)} mode="eager" />
                </div>
            )}
        </div>
    );
}
