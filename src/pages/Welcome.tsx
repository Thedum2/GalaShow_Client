import LoginCard from "@/components/welcome/LoginCard";
import Icon from "@/components/icons/Icon";
import StepsBox from "@/components/welcome/StepsBox";
import RibbonOverlay from "@/components/RibbonOverlay";
import React, { useEffect, useState } from "react";
import { BannersApi, PoliciesApi, SnsLinksApi } from "@/api";
import { Banner } from "@/api/model/response/banner/Banner";
import { PolicyLinks } from "@/api/model/response/policy/PolicyLinks";
import { SnsLink } from "@/api/model/response/sns/SnsLink";
import PdfViewer from "@/components/PdfViewer";
import { useNavigate } from 'react-router-dom';
import { PATHS } from "@/routes/paths";
import StartGameButton from "@/components/lobby/StartGameButton";
import LoginedCard from "@/components/welcome/LoginedCard";


const stepSets = [
    [
        {
            icon: <Icon name="HelpCircle" type="lucide" size={100} className="p-4" />,
            title: "매 라운드 선택지 중 하나를 고르세요",
            desc: "방장(스트리머)의 선택을 맞추세요!",
            iconBgColor: "#0545B1",
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Users" type="lucide" size={100} className="p-4" />,
            title: "선택에 따라 생존자가 결정됩니다",
            desc: "다수결, 소수결 또는 특별 규칙!",
            iconBgColor: "#03C75A",
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Star" type="lucide" size={100} className="p-4" />,
            title: "마지막까지 살아남으면 승리!",
            desc: "너가 이겼다....",
            iconBgColor: "#EAB308",
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
    ],
    [
        {
            icon: <Icon name="Gamepad2" type="lucide" size={100} className="p-4" />,
            title: "새로운 게임 모드",
            desc: "전혀 다른 방식의 게임을 즐겨보세요.",
            iconBgColor: "#0545B1",
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Mic" type="lucide" size={100} className="p-4" />,
            title: "채팅으로 참여하기",
            desc: "채팅으로 직접 게임에 참여할 수 있습니다.",
            iconBgColor: "#03C75A",
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Icon name="Heart" type="lucide" size={100} className="p-4" />,
            title: "팬들을 위한 특별 라운드",
            desc: "스트리머와 팬이 함께 만드는 특별한 순간!",
            iconBgColor: "#707070",
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
    ]
];

export default function Welcome() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [policyLinks, setPolicyLinks] = useState<PolicyLinks | null>(null);
    const [snsLinks, setSnsLinks] = useState<SnsLink[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
    const [pdfTitle, setPdfTitle] = useState("");
    const [isSoopLogined, setIsSoopLogined] = useState(false);
    const [isNaverLogined, setIsNaverLogined] = useState(false);
    const [isGoogleLogined, setIsGoogleLogined] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        BannersApi.get().then(setBanners).catch(console.error);
        PoliciesApi.get().then(setPolicyLinks).catch(console.error);
        SnsLinksApi.get().then(setSnsLinks).catch(console.error);
    }, []);

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
    

    return (
        <div className="relative flex flex-col w-full h-full text-white overflow-hidden">
            {isPdfViewerOpen && pdfUrl && <PdfViewer title={pdfTitle} url={pdfUrl} onClose={closePdfViewer} />}

            {banners.slice(0, 5).map((banner, index) => (
                <RibbonOverlay
                    key={banner.id}
                    text={banner.message}
                    rotate={getRandomValue(-15, 15)}
                    top={`${getRandomValue(5, 85)}%`}
                    speedSec={getRandomValue(15, 30)}
                    theme={index % 2 === 0 ? 'dark' : 'light'}
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
                                {
                                    isSoopLogined ? (
                                        <LoginedCard
                                            borderWidth="8px"
                                            borderColor="#0545B1"
                                            title="네네코 마시로"
                                            loginedIcon={<Icon name="neneko" size={83} mode="eager" />}
                                            onClick={() =>
                                                // navigate(PATHS.lobby)
                                                setIsSoopLogined(true)
                                            }
                                            glow="#3b82f6"
                                            logo={<Icon name="soop" size={188} mode="eager" />}
                                        />
                                    ) : (
                                        <LoginCard
                                            title="스트리머라면?"
                                            subtext="SOOP 계정으로 연동"
                                            subtextColor="#6E6E6E"
                                            color="#0545B1"
                                            buttonText="SOOP 로그인"
                                            buttonIcon={<Icon name="soopmini" size={28} mode="eager" />}
                                            onClick={() =>
                                                // navigate(PATHS.lobby)
                                                setIsSoopLogined(true)
                                            }
                                            glow="#3b82f6"
                                            logo={<Icon name="soop" size={230} mode="eager" />}
                                        />
                                    )
                                }
                                {
                                    isNaverLogined ? (
                                        <LoginedCard
                                            borderWidth="8px"
                                            borderColor="#03C75A"
                                            title="네네코 마시로"
                                            loginedIcon={<Icon name="neneko" size={83} mode="eager" />}
                                            onClick={() =>
                                                // navigate(PATHS.lobby)
                                                setIsNaverLogined(true)
                                            }
                                            glow="#3b82f6"
                                            logo={<Icon name="chzzk" size={188} mode="eager" />}
                                        />
                                    ) : (
                                        <LoginCard
                                            title="스트리머라면?"
                                            subtext="NAVER 계정으로 연동"
                                            subtextColor="#6E6E6E"
                                            color="#03C75A"
                                            buttonText="네이버 로그인"
                                            buttonIcon={<Icon name="naver" size={16} mode="eager" />}
                                            onClick={() =>
                                                // navigate(PATHS.lobby)
                                                setIsNaverLogined(true)
                                            }
                                            glow="#22c55e"
                                            logo={<Icon name="chzzk" size={230} mode="eager" />}
                                        />
                                    )
                                }
                                {
                                    isGoogleLogined ? (
                                        <LoginedCard
                                            borderWidth="8px"
                                            borderColor="#FF0000"
                                            title="네네코 마시로"
                                            logo={<Icon name="youtube" size={90} mode="eager" />}
                                            loginedIcon={<Icon name="neneko" size={83} mode="eager" />}
                                        />
                                    ) : (
                                        <LoginCard
                                            title="크리에이터라면?"
                                            subtext="GOOGLE 계정으로 연동"
                                            subtextColor="#6E6E6E"
                                            color="#707070"
                                            buttonText="준비중입니다"
                                            onClick={() =>
                                                // navigate(PATHS.lobby)
                                                setIsGoogleLogined(true)
                                            }
                                            glow="#3f3f46"
                                            logo={<Icon name="youtube" size={90} mode="eager" />}
                                        />
                                    )
                                }
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
                                    console.log("Reset button clicked");
                                }}
                            />
                            <StartGameButton
                                text="N개의 계정으로 시작하기"
                                disabled={!isSoopLogined && !isNaverLogined && !isGoogleLogined}
                                icon={<Icon name="bookmark" size={35} mode="eager" />}
                                backgroundColor="#FFDE59"
                                textColor="#000000"
                                onClick={() => {
                                    navigate(PATHS.lobby)
                                }}
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
        </div>
    );
}
