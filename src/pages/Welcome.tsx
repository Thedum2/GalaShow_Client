import LoginCard from "@/components/welcome/LoginCard";
import Icon from "@/components/icons/Icon";
import StepsBox from "@/components/welcome/StepsBox";
import RibbonOverlay from "@/components/RibbonOverlay";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BannersApi, PoliciesApi, SnsLinksApi } from "@/api";
import { Banner } from "@/api/model/response/banner/Banner";
import { PolicyLinks } from "@/api/model/response/policy/PolicyLinks";
import { SnsLink } from "@/api/model/response/sns/SnsLink";
import PdfViewer from "@/components/PdfViewer";
import { useNavigate } from 'react-router-dom';
import { PATHS } from "@/routes/paths";
import StartGameButton from "@/components/lobby/StartGameButton";
import LoginedCard from "@/components/welcome/LoginedCard";
import OneButtonPopup from "@/components/modals/OneButtonPopup";
import TwoButtonPopup from "@/components/modals/TwoButtonPopup";
import ImageTwoButtonPopup from "@/components/modals/ImageTwoButtonPopup";
import EmojiOneButtonPopup from "@/components/modals/EmojiOneButtonPopup";
import { usePolyChatStore } from "@/stores/polychat";
import MainProfilePopup, { MainProfileOption } from "@/components/modals/MainProfilePopup";
import type { PlatformType } from "@/types/common";
import {
    ImprovedToastContainer,
    ImprovedToastType,
} from "@/components/modals/ImprovedToast";


const stepSets = [
    [
        {
            icon: <Icon name="Radio" type="lucide" size={100} className="p-4" />,
            title: "방송을 연결하고 게임방을 여세요",
            desc: "스트리머가 방을 만들고 진행을 이끌어요.",
            iconBgColor: "#0545B1",
            mediaUrl: '/intro/connect.svg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="MessageSquareText" type="lucide" size={100} className="p-4" />,
            title: "시청자는 채팅으로 참가!",
            desc: "설치도, 복잡한 가입도 필요 없어요.",
            iconBgColor: "#03C75A",
            mediaUrl: '/intro/chat-join.svg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Gamepad2" type="lucide" size={100} className="p-4" />,
            title: "짧고 쉬운 미니게임이 이어져요",
            desc: "규칙은 짧게, 판단은 빠르게!",
            iconBgColor: "#0545B1",
            mediaUrl: '/intro/minigames.svg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
    ],
    [
        {
            icon: <Icon name="Timer" type="lucide" size={100} className="p-4" />,
            title: "제한 시간 안에 선택하세요",
            desc: "다른 사람의 선택이 판을 뒤집을 수도 있어요!",
            iconBgColor: "#FF0000",
            mediaUrl: '/intro/choice.svg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Users" type="lucide" size={100} className="p-4" />,
            title: "라운드마다 생존자가 줄어들어요",
            desc: "판정 이유와 결과를 모두 함께 확인해요.",
            iconBgColor: "#03C75A",
            mediaUrl: '/intro/survivors.svg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Crown" type="lucide" size={100} className="p-4" />,
            title: "최후의 1인이 우승!",
            desc: "마지막까지 살아남아 왕관을 차지하세요.",
            iconBgColor: "#EAB308",
            mediaUrl: '/intro/winner.svg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
    ]
];

// 홈 로그인 카드. 각 플랫폼은 PolyChat으로 로그인 → 채팅 연결까지 한 번에 진행한다.
const LOGIN_CARDS: {
    platform: PlatformType;
    name: string;
    title: string;
    subtext: string;
    color: string;
    glow: string;
    buttonText: string;
    buttonIcon?: React.ReactNode;
    logo: React.ReactNode;
    loginedLogo: React.ReactNode;
}[] = [
    {
        platform: "soop",
        name: "SOOP",
        title: "스트리머라면?",
        subtext: "SOOP 계정으로 연동",
        color: "#0545B1",
        glow: "#3b82f6",
        buttonText: "SOOP 로그인",
        buttonIcon: <Icon name="soopmini" size={28} mode="eager" />,
        logo: <Icon name="soop" size={230} mode="eager" />,
        loginedLogo: <Icon name="soop" size={188} mode="eager" />,
    },
    {
        platform: "chzzk",
        name: "CHZZK",
        title: "스트리머라면?",
        subtext: "NAVER 계정으로 연동",
        color: "#03C75A",
        glow: "#22c55e",
        buttonText: "네이버 로그인",
        buttonIcon: <Icon name="naver" size={16} mode="eager" />,
        logo: <Icon name="chzzk" size={230} mode="eager" />,
        loginedLogo: <Icon name="chzzk" size={188} mode="eager" />,
    },
    {
        platform: "youtube",
        name: "YouTube",
        title: "크리에이터라면?",
        subtext: "GOOGLE 계정으로 연동",
        color: "#FF0000",
        glow: "#ef4444",
        buttonText: "구글 로그인",
        logo: <Icon name="youtube" size={90} mode="eager" />,
        loginedLogo: <Icon name="youtube" size={90} mode="eager" />,
    },
];

interface Toast {
    id: string;
    type: ImprovedToastType;
    message: string;
    duration?: number;
}

export default function Welcome() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [policyLinks, setPolicyLinks] = useState<PolicyLinks | null>(null);
    const [snsLinks, setSnsLinks] = useState<SnsLink[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
    const [pdfTitle, setPdfTitle] = useState("");
    const platforms = usePolyChatStore((state) => state.platforms);
    const connectPlatform = usePolyChatStore((state) => state.connect);
    const disconnectPlatform = usePolyChatStore((state) => state.disconnect);
    const mainPlatform = usePolyChatStore((state) => state.mainPlatform);
    const setMainPlatform = usePolyChatStore((state) => state.setMainPlatform);
    const resetConnections = usePolyChatStore((state) => state.reset);
    const connectedCount = Object.values(platforms).filter((p) => p.status === "connected").length;
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const profileOptions: MainProfileOption[] = LOGIN_CARDS
        .filter((card) => platforms[card.platform].status === "connected")
        .map((card) => ({
            platform: card.platform,
            name: card.name,
            nickname: platforms[card.platform].broadcaster?.nickname ?? card.name,
            imageUrl: platforms[card.platform].broadcaster?.profileImageUrl,
            color: card.color,
        }));
    const navigate = useNavigate();
    // 선택 연출이 끝나면 View Transition으로 교차 페이드하며 로비로 넘어간다.
    const goToLobby = useCallback(() => navigate(PATHS.lobby, { viewTransition: true }), [navigate]);

    // Popup states
    const [showOneButton, setShowOneButton] = useState(false);
    const [showTwoButton, setShowTwoButton] = useState(false);
    const [showImageTwoButton, setShowImageTwoButton] = useState(false);
    const [showEmojiOneButton, setShowEmojiOneButton] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [toastTypeIndex, setToastTypeIndex] = useState(0);

    useEffect(() => {
        BannersApi.get().then(setBanners).catch(console.error);
        PoliciesApi.get().then(setPolicyLinks).catch(console.error);
        SnsLinksApi.get().then(setSnsLinks).catch(console.error);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Shift+1: 원버튼 팝업
            if (e.ctrlKey && e.shiftKey && e.key === '!') {
                e.preventDefault();
                setShowOneButton(true);
            }
            // Ctrl+Shift+2: 투버튼 팝업
            else if (e.ctrlKey && e.shiftKey && e.key === '@') {
                e.preventDefault();
                setShowTwoButton(true);
            }
            // Ctrl+Shift+3: 사진 투버튼 팝업
            else if (e.ctrlKey && e.shiftKey && e.key === '#') {
                e.preventDefault();
                setShowImageTwoButton(true);
            }
            // Ctrl+Shift+4: 이모지 원버튼 팝업
            else if (e.ctrlKey && e.shiftKey && e.key === '$') {
                e.preventDefault();
                setShowEmojiOneButton(true);
            }
            // Ctrl+Shift+5: 토스트 순환
            else if (e.ctrlKey && e.shiftKey && e.key === '%') {
                e.preventDefault();
                const toastTypes: ImprovedToastType[] = ['success', 'error', 'warning', 'info'];
                const messages = [
                    'Changes applied successfully!',
                    'Something went wrong!',
                    'Please check your input!',
                    'New update available!'
                ];
                addToast(toastTypes[toastTypeIndex], messages[toastTypeIndex]);
                setToastTypeIndex((prev) => (prev + 1) % toastTypes.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toastTypeIndex]);

    const addToast = (type: ImprovedToastType, message: string) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message }]);
    };

    const handleLogin = async (platform: PlatformType) => {
        const card = LOGIN_CARDS.find((c) => c.platform === platform)!;
        if (await connectPlatform(platform)) {
            addToast("success", `${card.name} 채팅이 연결되었습니다.`);
        } else {
            const error = usePolyChatStore.getState().platforms[platform].error;
            if (error) addToast("error", `${card.name} 로그인 실패: ${error}`);
        }
    };

    const handleLogout = async (platform: PlatformType) => {
        await disconnectPlatform(platform);
        addToast("info", `${LOGIN_CARDS.find((c) => c.platform === platform)!.name} 연결을 해제했습니다.`);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const openPdfViewer = (title: string, url: string) => {
        if (!url) {
            console.error('PDF URL is invalid:', url);
            return;
        }
        setPdfTitle(title);
        setPdfUrl(url);
        setIsPdfViewerOpen(true);
    };

    const closePdfViewer = () => {
        setIsPdfViewerOpen(false);
        setPdfUrl(null);
    };

    const getRandomValue = (min: number, max: number) => Math.random() * (max - min) + min;

    // Memoize ribbon properties to prevent re-randomization on re-renders
    const ribbonConfigs = useMemo(() => {
        return banners.filter(banner => banner.message.trim()).slice(0, 5).map((banner, index) => ({
            id: banner.id,
            message: banner.message,
            rotate: getRandomValue(-15, 15),
            top: `${getRandomValue(5, 85)}%`,
            speedSec: getRandomValue(15, 30),
            theme: index % 2 === 0 ? 'dark' : 'light' as 'dark' | 'light',
        }));
    }, [banners]);
    

    return (
        <div className="relative flex flex-col w-full h-full text-white overflow-hidden">
            {isPdfViewerOpen && pdfUrl && <PdfViewer title={pdfTitle} url={pdfUrl} onClose={closePdfViewer} />}

            {ribbonConfigs.map((config) => (
                <RibbonOverlay
                    key={config.id}
                    text={config.message}
                    rotate={config.rotate}
                    top={config.top}
                    speedSec={config.speedSec}
                    theme={config.theme}
                />
            ))}

            <div className="relative z-10 flex flex-col flex-grow w-full h-full p-2 sm:p-4 md:p-8">

                <div className="flex flex-row gap-4 flex-grow h-full">

                    {/* CONTENT AREA*/}
                    <div className="flex flex-col flex-grow justify-center h-full">

                        <div className="grow-[2] basis-0 flex justify-center items-center overflow-hidden">
                            <Icon name="logo" size={260} mode="eager" />
                        </div>

                        <div className="grow-[3] basis-0 flex flex-col justify-center items-center overflow-hidden">
                            <div className="flex flex-row justify-center items-center gap-[50px]">
                                {LOGIN_CARDS.map((card) => {
                                    const connection = platforms[card.platform];
                                    return connection.status === "connected" ? (
                                        <LoginedCard
                                            key={card.platform}
                                            borderWidth="8px"
                                            borderColor={card.color}
                                            title={connection.broadcaster?.nickname ?? card.name}
                                            loginedIcon={connection.broadcaster?.profileImageUrl ? (
                                                <img
                                                    src={connection.broadcaster.profileImageUrl}
                                                    alt={connection.broadcaster.nickname}
                                                    className="w-[83px] h-[83px] rounded-full object-cover"
                                                />
                                            ) : undefined}
                                            onDisconnect={() => handleLogout(card.platform)}
                                            glow={card.glow}
                                            logo={card.loginedLogo}
                                        />
                                    ) : (
                                        <LoginCard
                                            key={card.platform}
                                            title={card.title}
                                            subtext={card.subtext}
                                            subtextColor="#D4D4D4"
                                            color={card.color}
                                            buttonText={connection.status === "loggingIn" ? "로그인 중…" : card.buttonText}
                                            buttonIcon={card.buttonIcon}
                                            disabled={connection.status === "loggingIn"}
                                            onClick={() => handleLogin(card.platform)}
                                            glow={card.glow}
                                            logo={card.logo}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grow-[2] basis-0 flex justify-center items-center overflow-hidden ">
                            <StepsBox title="플레이 방법" stepSets={stepSets} />
                        </div>

                        <div className="overflow-hidden flex justify-center items-center gap-4 p-2">
                            <StartGameButton
                                text="초기화"
                                icon={<Icon name="reset" size={35} mode="eager"/>}
                                backgroundColor="#000000"
                                textColor="#F3F4F6"
                                onClick={() => {
                                    void resetConnections();
                                }}
                            />
                            <StartGameButton
                                text={`${connectedCount}개의 계정으로 시작하기`}
                                disabled={connectedCount === 0}
                                icon={<Icon name="bookmark" size={35} mode="eager" />}
                                backgroundColor="#FFDE59"
                                textColor="#000000"
                                onClick={() => setShowProfilePopup(true)}
                            />
                        </div>
                    </div>

                    {/* STREAMING BOX AREA*/}
                    <div className="w-[320px] h-full flex-shrink-0 border-4 border-purple-500 justify-center content-center items-center text-center text-2xl font-bold">
                        THIS IS STREAMING BOX
                    </div>

                </div>

                <footer className="flex flex-wrap items-center justify-center gap-4 text-s text-white/50 py-0 mt-5">
                    {policyLinks && (
                        <>
                            <button onClick={() => openPdfViewer("서비스 약관", policyLinks.termsOfService)} className="bg-transparent text-purple-400 hover:text-white transition-colors">서비스 약관</button>
                            <span>·</span>
                            <button onClick={() => openPdfViewer("개인정보 처리방침", policyLinks.privacyPolicy)} className="bg-transparent text-purple-400 hover:text-white transition-colors">개인정보 처리방침</button>
                            <span>·</span>
                        </>
                    )}
                    <span className="opacity-80">© 2025 갈라쇼</span>
                    {snsLinks.length > 0 && <span className="mx-1">·</span>}
                    <div className="flex items-center gap-3">
                        {snsLinks.map(link => (
                            <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                <img src={link.iconUrl} alt={link.title} className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </footer>
            </div>

            {/* Popups for testing - keyboard shortcuts */}
            <OneButtonPopup
                title="정말 진행 하실건가요?"
                subtitle="진행하면 되돌릴 수 없습니다"
                buttonText="확인하기"
                isOpen={showOneButton}
                onClose={() => setShowOneButton(false)}
                onConfirm={() => {
                    console.log("원버튼 팝업 - 확인");
                    addToast("success", "확인 버튼이 클릭되었습니다!");
                }}
            />

            <TwoButtonPopup
                title="정말 진행 하실건가요?"
                subtitle="진행하면 되돌릴 수 없습니다"
                cancelText="거절하기"
                confirmText="확인하기"
                isOpen={showTwoButton}
                onClose={() => setShowTwoButton(false)}
                onCancel={() => {
                    console.log("투버튼 팝업 - 거절");
                    addToast("info", "거절하기 버튼이 클릭되었습니다!");
                }}
                onConfirm={() => {
                    console.log("투버튼 팝업 - 확인");
                    addToast("success", "확인하기 버튼이 클릭되었습니다!");
                }}
            />

            <ImageTwoButtonPopup
                title="정말 진행 하실건가요?"
                subtitle="진행하면 되돌릴 수 없습니다"
                image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&h=300&fit=crop"
                cancelText="거절하기"
                confirmText="확인하기"
                isOpen={showImageTwoButton}
                onClose={() => setShowImageTwoButton(false)}
                onCancel={() => {
                    console.log("사진 투버튼 팝업 - 거절");
                    addToast("info", "거절하기 버튼이 클릭되었습니다!");
                }}
                onConfirm={() => {
                    console.log("사진 투버튼 팝업 - 확인");
                    addToast("success", "확인하기 버튼이 클릭되었습니다!");
                }}
            />

            <EmojiOneButtonPopup
                title="Your order has been placed!"
                emoji="🎉"
                buttonText="Thanks!"
                isOpen={showEmojiOneButton}
                onClose={() => setShowEmojiOneButton(false)}
                onConfirm={() => {
                    console.log("이모지 원버튼 팝업 - 확인");
                    addToast("success", "주문이 완료되었습니다!");
                }}
            />

            <MainProfilePopup
                isOpen={showProfilePopup}
                profiles={profileOptions}
                initialPlatform={mainPlatform}
                onSelect={setMainPlatform}
                onComplete={goToLobby}
                onClose={() => setShowProfilePopup(false)}
            />

            {/* Toast Container */}
            <ImprovedToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
