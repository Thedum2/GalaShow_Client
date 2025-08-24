import {useState} from "react";
import {HelpCircle, Users, Star} from "lucide-react";
import Ribbon from "@/components/Ribbon";
import LoginCard from "@/components/LoginCard";
import Icon from "@/components//icons/Icon"
function Steps() {
    const steps = [
        {
            icon: <HelpCircle className="h-6 w-6" />,
            title: "매 라운드 선택지 중 하나를 고르세요",
            desc: "방장(스트리머)의 선택을 맞추면 생존!",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "다수결/소수결/특정 플레이어에 따라 생존이 결정",
            desc: "라운드마다 규칙이 달라져요.",
        },
        {
            icon: <Star className="h-6 w-6" />,
            title: "마지막까지 살아남으면 승리!",
            desc: "점수와 랭크로 보상 획득.",
        },
    ];

    const [active, setActive] = useState(0);

    return (
        <div className="relative z-10 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8">
            <h4 className="text-center text-lg sm:text-xl font-bold text-white mb-6">
                플레이 방법
            </h4>

            <div className="grid gap-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-4 border transition-all duration-300
              ${i === active ? "border-white/30 bg-white/5" : "border-white/10 bg-white/[0.03]"}
            `}
                    >
                        <div className="flex items-center gap-3 text-white">
                            <div className={`h-10 w-10 flex items-center justify-center rounded-full
                ${i === active ? "bg-indigo-600" : "bg-white/10"}
              `}>
                                {s.icon}
                            </div>
                            <div className="font-semibold">{s.title}</div>
                        </div>
                        <p className="mt-3 text-sm text-white/70">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* 점 네비게이터 */}
            <div className="mt-6 flex items-center justify-center gap-2">
                {steps.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Step ${i + 1}`}
                        onClick={() => setActive(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-200
              ${i === active ? "w-6 bg-indigo-500" : "bg-white/30 hover:bg-white/60"}
            `}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Welcome() {
    return (
        <div className="relative min-h-screen w-full bg-neutral-950 text-white overflow-hidden">
            <Ribbon
                text={"방송 중 속마음이 들린다면? 가장 충격적이었던 순간은? 방송 장비 중 가장 불만스러운 점은? "}
                rotate={-12}
                top="8%"
                width="140%"
                speedSec={30}
                theme="dark"
            />
            <Ribbon
                text={"스트리머의 흑역사? 방송 시작 전 항상 까먹는 한 가지는? 갑자기 정전되면 가장 먼저 할 행동은? "}
                rotate={8}
                top="28%"
                width="140%"
                speedSec={24}
                theme="light"
            />
            <Ribbon
                text={"가장 기억에 남는 팬과의 순간은? 가장 좋아하는 밈은? 오늘의 TMI는? "}
                rotate={-6}
                top="48%"
                width="140%"
                speedSec={28}
                theme="dark"
            />
            <Ribbon
                text={"친구들이랑 하려면? 준비 중! 조금만 기다려 주세요 🙏 "}
                rotate={10}
                top="68%"
                width="140%"
                speedSec={26}
                theme="light"
            />


            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
                <div className="text-center mb-10 sm:mb-14">
                    <div className="inline-block rounded-full border border-white/10 px-4 py-1 text-xs text-white/70 mb-3">
                        <Icon name="logo" size="50" mode="eager"/>
                        갈라쇼
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        스트리머도, 시청자도 <span className="text-indigo-400">선택의 순간</span>
                    </h1>
                    <p className="mt-3 text-white/70">
                        로그인하고 바로 시작하세요. 같이 즐기면 더 재밌어요!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                    <LoginCard
                        title="SOOP"
                        subtitle="스트리머라면?"
                        color="blue"
                        buttonText="SOOP 로그인"
                        onClick={() => console.log("SOOP 로그인")}
                        glow="ring-blue-500/40"
                        logo={
                            <div className="font-extrabold text-2xl tracking-tight">SOOP</div>
                        }
                    />
                    <LoginCard
                        title="네이버"
                        subtitle="스트리머라면?"
                        color="green"
                        buttonText="네이버 로그인"
                        onClick={() => console.log("NAVER 로그인")}
                        glow="ring-green-500/40"
                        logo={
                            <div className="font-extrabold text-2xl tracking-tight">N</div>
                        }
                    />
                    <LoginCard
                        title="친구들이랑 하려면?"
                        subtitle="준비중입니다"
                        color="gray"
                        buttonText="준비중입니다"
                        disabled
                        glow="ring-gray-400/30"
                        logo={<Users className="text-white/80" />}
                    />
                </div>

                {/* 플레이 방법 */}
                <div className="mt-10 sm:mt-14">
                    <Steps />
                </div>

                {/* 푸터 */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
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

            {/* keyframes 정의 */}
            <style>{`
        @keyframes ribbon-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}