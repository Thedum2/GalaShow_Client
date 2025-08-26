import {HelpCircle, Users, Star, Gamepad2, Mic, Heart, LogIn} from "lucide-react";
import LoginCard from "@/components/LoginCard";
import Icon from "@/components/icons/Icon";
import StepsBox from "@/components/StepsBox";
import RibbonOverlay from "@/components/RibbonOverlay";

const stepSets = [
    [
        {
            icon: <HelpCircle className="h-6 w-6"/>,
            title: "매 라운드 선택지 중 하나를 고르세요",
            desc: "방장(스트리머)의 선택을 맞추면 생존!",
        },
        {
            icon: <Users className="h-6 w-6"/>,
            title: "다수결/소수결/특정 플레이어에 따라 생존이 결정",
            desc: "라운드마다 규칙이 달라져요.",
        },
        {
            icon: <Star className="h-6 w-6"/>,
            title: "마지막까지 살아남으면 승리!",
            desc: "점수와 랭크로 보상 획득.",
        },
    ],
    [
        {
            icon: <Gamepad2 className="h-6 w-6"/>,
            title: "새로운 게임 모드",
            desc: "전혀 다른 방식의 게임을 즐겨보세요.",
        },
        {
            icon: <Mic className="h-6 w-6"/>,
            title: "음성으로 참여하기",
            desc: "목소리로 직접 게임에 참여할 수 있습니다.",
        },
        {
            icon: <Heart className="h-6 w-6"/>,
            title: "팬들을 위한 특별 라운드",
            desc: "스트리머와 팬이 함께 만드는 특별한 순간!",
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
                        <StepsBox stepSets={stepSets}/>
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