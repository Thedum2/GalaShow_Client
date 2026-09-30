import React, {Suspense, lazy, useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import FitStage from "@/util/FitStage";
import Background from "@/components/Background";
import { BackgroundApi } from "@/api";
import { BackgroundAsset } from "@/api/model/response/background/BackgroundAsset";
import { backgroundService } from "@/services/backgroundService";
import TwoButtonPopup from "@/components/modals/TwoButtonPopup";
import { reloadToHome, useRefreshGuard } from "@/hooks/useRefreshGuard";

// 개발용 GalaShow Simulator 앱(Simulator 폴더) 연결. 운영 빌드에서는 MODE가 상수로 치환되어 코드가 번들에서 빠진다.
// 로컬 개발 서버에서는 항상, 개발 배포에서는 주소에 ?sim을 한 번 붙이면 이번 탭에서 계속 연결한다.
const SimulatorLink = import.meta.env.MODE !== "production"
    ? lazy(() => import("@/dev/simulator/SimulatorLink"))
    : null;

function isSimulatorEnabled() {
    if (!SimulatorLink) return false;
    if (import.meta.env.DEV) return true;
    try {
        if (new URLSearchParams(window.location.search).has("sim")) sessionStorage.setItem("galashow-sim", "1");
        return sessionStorage.getItem("galashow-sim") === "1";
    } catch {
        return false;
    }
}


export default function AppLayout() {
    const [background, setBackground] = useState<BackgroundAsset | null>(null);
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(backgroundService.getState());
    const refreshGuard = useRefreshGuard();
    const [showSimulator] = useState(isSimulatorEnabled);

    useEffect(() => {
        BackgroundApi.get()
            .then(backgrounds => {
                if (backgrounds.length > 0) {
                    const randomIndex = Math.floor(Math.random() * backgrounds.length);
                    setBackground(backgrounds[randomIndex]);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const unsubscribe = backgroundService.subscribe(setIsBackgroundVisible);
        return () => unsubscribe();
    }, []);

    return (
        <>
            {isBackgroundVisible && (
                <Background
                    bgSrc={background?.url}
                    bgType={background?.type}
                    bgPosition="center"
                    overlayOpacity={0.7}
                />
            )}
            <FitStage
                mode="contain"
            >
                <Outlet/>
            </FitStage>
            <TwoButtonPopup
                isOpen={refreshGuard.open}
                title="새로고침할까요?"
                subtitle="채팅 연결과 참가자 등 진행 상황이 모두 초기화되고 처음 화면으로 돌아갑니다."
                cancelText="계속하기"
                confirmText="새로고침"
                onConfirm={reloadToHome}
                onClose={refreshGuard.close}
            />
            {showSimulator && SimulatorLink && (
                <Suspense fallback={null}>
                    <SimulatorLink/>
                </Suspense>
            )}
        </>
    );
}


