import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";
import { connectSimulator } from "./simulatorBridge";

/**
 * GalaShow Simulator 앱과의 연결. 화면에는 연결됐을 때만 작은 배지를 표시한다.
 * 로컬 개발 서버에서는 항상, 개발 배포에서는 주소에 ?sim을 붙였을 때만 동작한다(운영 빌드에서는 제외).
 */
export default function SimulatorLink() {
    const [connected, setConnected] = useState(false);

    useEffect(() => connectSimulator(setConnected), []);

    if (!connected) return null;

    return createPortal(
        <div
            className="fixed bottom-3 right-3 z-[65] flex items-center gap-1.5 rounded-full border border-yellow-500/70 bg-neutral-950/90 px-3 py-1 text-xs font-black text-yellow-200 shadow-lg animate-fade-in"
            title="GalaShow Simulator 앱에서 보낸 가짜 채팅을 받고 있습니다"
        >
            <Icon name="FlaskConical" type="lucide" size={14} />
            시뮬레이터 연결됨
        </div>,
        document.body,
    );
}
