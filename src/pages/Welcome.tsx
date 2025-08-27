import {HelpCircle, Users, Star, Gamepad2, Mic, Heart} from "lucide-react";
import LoginCard from "@/components/LoginCard";
import Icon from "@/components/icons/Icon";
import StepsBox from "@/components/StepsBox";
import RibbonOverlay from "@/components/RibbonOverlay";

const stepSets = [
    [
        {
            icon: <HelpCircle className="h-[72px] w-[72px] p-4"/>,
            title: "매 라운드 선택지 중 하나를 고르세요",
            desc: "방장(스트리머)의 선택을 맞추세요!",
            iconBgColor: "#0545B1",
            badge: 'NEW',
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Users className="h-[72px] w-[72px] p-4"/>,
            title: "선택에 따라 생존자가 결정됩니다",
            desc: "다수결, 소수결 또는 특별 규칙!",
            iconBgColor: "#03C75A",
            badge: 'NEW',
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Star className="h-[72px] w-[72px] p-4"/>,
            title: "마지막까지 살아남으면 승리!",
            desc: "너가 이겼다....",
            iconBgColor: "#EAB308",
            badge: 'NEW',
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
    ],
    [
        {
            icon: <Gamepad2 className="h-[72px] w-[72px] p-4"/>,
            title: "새로운 게임 모드",
            desc: "전혀 다른 방식의 게임을 즐겨보세요.",
            iconBgColor: "#0545B1",
            badge: 'NEW',
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Mic className="h-[72px] w-[72px] p-4"/>,
            title: "채팅으로 참여하기",
            desc: "채팅으로 직접 게임에 참여할 수 있습니다.",
            iconBgColor: "#03C75A",
            badge: 'NEW',
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
        {
            icon: <Heart className="h-[72px] w-[72px] p-4"/>,
            title: "팬들을 위한 특별 라운드",
            desc: "스트리머와 팬이 함께 만드는 특별한 순간!",
            iconBgColor: "#707070",
            badge: 'NEW',
            mediaUrl: 'https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/vendor_inventory/4fd8/97064bfaf334573c27a0537766d3d4b49349a698c9053645a7b0fbe2557f.jpg',
            progress: 60,
            accent: 'rgba(56,189,248,0.14)',
        },
    ]
];

export default function Welcome() {
    return (
        <div className="relative flex flex-col w-full h-full text-white overflow-hidden">
            {/* Background Ribbons */}
            <RibbonOverlay
                text={"방송 중 속마음었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은? "}
                rotate={-12}
                top={"8%"}
                speedSec={10}
                theme={"dark"}
            />

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col flex-grow w-full h-full p-2 sm:p-4 md:p-8">

                {/* Flex container for vertical distribution */}
                <div className="flex flex-col flex-grow justify-center h-full">

                    {/* 1. Logo Area */}
                    <div className="grow-[2] basis-0 flex justify-center items-center overflow-hidden">
                        <Icon name="logo" size={260} mode="eager"/>
                    </div>

                    {/* 2. Login Cards Area */}
                    <div className="grow-[2] basis-0 flex flex-col justify-center items-center overflow-hidden">
                        <div className="flex flex-row justify-center items-center gap-[50px]">
                            <LoginCard
                                title="스트리머라면?"
                                color="#0545B1"
                                buttonText="SOOP 로그인"
                                buttonIcon={<Icon name="soopmini" size={28} mode="eager"/>}
                                onClick={() => console.log("SOOP 로그인")}
                                glow="#3b82f6"
                                logo={<Icon name="soop" size={250} mode="eager"/>}
                            />
                            <LoginCard
                                title="스트리머라면?"
                                color="#03C75A"
                                buttonText="네이버 로그인"
                                buttonIcon={<Icon name="naver" size={16} mode="eager"/>}
                                onClick={() => console.log("NAVER 로그인")}
                                glow="#22c55e"
                                logo={<Icon name="chzzk" size={250} mode="eager"/>}
                            />
                            <LoginCard
                                title="친구들이랑 하려면?"
                                color="#707070"
                                buttonText="준비중입니다"
                                disabled
                                glow="#6b7280"
                                logo={<Icon name="user" size={90} mode="eager"/>}
                            />
                        </div>
                    </div>

                    {/* 3. StepsBox Area */}
                    <div className="grow-[3] basis-0 flex justify-center items-center overflow-hidden">
                        <StepsBox title="플레이 방법" stepSets={stepSets}/>
                    </div>
                </div>

                {/* 4. Policy Area - Absolutely Positioned */}
                <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-shrink-0 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 py-2">
                    <a className="hover:text-white/80 transition-colors" href="#">서비스 약관</a>
                    <span>·</span>
                    <a className="hover:text-white/80 transition-colors" href="#">개인정보 처리방침</a>
                    <span>·</span>
                    <span className="opacity-80">© 2025 갈라쇼</span>
                </footer>
            </div>
        </div>
    );
}