import React from "react";
import {HelpCircle, Users, Star} from "lucide-react";
import LoginCard from "@/components/LoginCard";
import Icon from "@/components/icons/Icon";
import StepsBox from "@/components/StepsBox";
import RibbonOverlay from "@/components/RibbonOverlay";

const steps = [
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
];

export default function Welcome() {
    return (
        <div className="relative min-h-screen w-full text-white overflow-y-auto">
            <RibbonOverlay
                text={"방송 중 속마음었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은? "}
                rotate={-12}
                top={"8%"}
                speedSec={10}
                theme={"dark"}
            />
            <RibbonOverlay
                text={"스트리머의 흑역사? 방송 시작 전 항상 까먹는 한 가지는? 갑자기 정전되면 가장 먼 흑역사? 방송 시작 전 항상 까먹는 한 가지는? 갑자기 정전되면 가장 먼 흑역사? 방송 시작 전 항상 까먹는 한 가지는? 갑자기 정전되면 가장 먼저 할 행동은? "}
                rotate={8}
                top={"28%"}
                speedSec={24}
                theme={"light"}
            />
            <RibbonOverlay
                text={"가장 기억에 남는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 밈은? 오늘의 TMI는? "}
                rotate={-62}
                top={"48%"}
                speedSec={28}
                theme={"dark"}
            />
            <RibbonOverlay
                text={"가장 기억에 남는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 밈은? 오늘의 TMI는? "}
                rotate={-6}
                top={"90%"}
                speedSec={28}
                theme={"light"}
            />
            <RibbonOverlay
                text={"가장 기억에 남는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 팬과의 순간은? 가장 좋아하는 밈은? 오늘의 TMI는? "}
                rotate={-36}
                top={"20%"}
                speedSec={28}
                theme={"dark"}
            />
            <RibbonOverlay
                text={"친구들이랑 하려면? 준비 중! 조금만 기다려 주세요 🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏 "}
                rotate={10}
                top={"68%"}
                speedSec={26}
                theme={"light"}
            />

            {/* MAIN CONTENT AREA */}
            <div className="relative z-10 flex flex-col items-center justify-between h-full w-full p-4 sm:p-8">

                {/* Flex container for the three main sections - now vertical */}
                <div className="flex flex-col items-stretch justify-center gap-8 w-full max-w-5xl flex-1 my-8">

                    {/* 1. Logo Area */}
                    <div className="flex-1 flex flex-col justify-center items-center p-8 rounded-2xl">
                        <Icon name="logo" size="200" mode="eager"/>
                    </div>

                    {/* 2. Login Cards Area */}
                    <div className="flex-1 flex flex-col justify-center items-center p-8 rounded-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full">
                            <LoginCard
                                title="SOOP"
                                subtitle="스트리머라면?"
                                color="blue"
                                buttonText="SOOP 로그인"
                                onClick={() => console.log("SOOP 로그인")}
                                glow="ring-blue-500/40"
                                logo={ <div className="font-extrabold text-2xl tracking-tight">SOOP</div> }
                            />
                            <LoginCard
                                title="네이버"
                                subtitle="스트리머라면?"
                                color="green"
                                buttonText="네이버 로그인"
                                onClick={() => console.log("NAVER 로그인")}
                                glow="ring-green-500/40"
                                logo={ <div className="font-extrabold text-2xl tracking-tight">N</div> }
                            />
                            <LoginCard
                                title="친구들이랑 하려면?"
                                subtitle="준비중입니다"
                                color="gray"
                                buttonText="준비중입니다"
                                disabled
                                glow="ring-gray-400/30"
                                logo={<Users className="text-white/80"/>}
                            />
                        </div>
                    </div>

                    {/* 3. StepsBox Area */}
                    <div className="flex-1 flex flex-col justify-center items-center p-8 rounded-2xl">
                        <StepsBox steps={steps}/>
                    </div>
                </div>

                {/* 4. Policy Area */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
                    <a className="hover:text-white/80 transition-colors" href="#">
                        서비스 약관
                    </a>
                    <span>·</span>
                    <a className="hover:text-white/80 transition-colors" href="#">
                        개인정보 처리방침
                    </a>
                    <span>·</span>
                    <span className="opacity-80">© 2025 갈라쇼</span>
                </div>
            </div>
        </div>
    );
}