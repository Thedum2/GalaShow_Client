import React from "react";
import { Icon } from "@/components/icons";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { PlatformType } from "@/types/common";

export interface RoundResult {
    id: string;
    name: string;
    percentage: number;
    survived: boolean;
    logoUrl: string;
}

export interface WinnerStats {
    totalRounds: number;
    playTime: string;
    accuracyRate: number;
}

export interface WinnerPanelProps {
    winnerName: string;
    winnerPlatform: PlatformType;
    stats: WinnerStats;
    roundResults: RoundResult[];
    onNewGame: () => void;
}

export const WinnerPanel: React.FC<WinnerPanelProps> = ({
    winnerName,
    winnerPlatform,
    stats,
    roundResults,
    onNewGame,
}) => {
    return (
        <div className="    absolute left-8 top-1/2 -translate-y-1/2 z-20 w-[465px] h-[95%] flex flex-col shadow-2xl rounded-3xl overflow-hidden animate-slide-in-left border-4 border-white">
            {/* 상단 우승 섹션 */}
            <div className="relative bg-gradient-to-b from-[#FFE98F] via-[#F4D03F] to-[#F9C700] p-6">
                {/* 색종이 효과 (선택사항) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* 색종이 애니메이션을 여기에 추가할 수 있습니다 */}
                </div>

                {/* 우승 텍스트 */}
                <div className="text-center flex justify-center items-center gap-1.5 flex-col">
                    <Icon name="crown" size={110} />
                    <h1 className="text-5xl font-black text-black mb-1">우승!</h1>
                    <p className="text-xl font-bold text-black">최후의 1인</p>
                </div>
            </div>

            {/* 하단 정보 섹션 */}
            <div className="flex-1 bg-black/70 px-6 py-6 flex flex-col overflow-hidden">
                {/* 우승자 정보 */}
                <div className="mb-6">
                    <div className="bg-[#2a2a2a] border-4 border-yellow-500 rounded-2xl px-6 py-4 flex items-center justify-center gap-3">
                        <PlatformIcon platform={winnerPlatform} size={40} />
                        <span className="text-white text-2xl font-bold truncate">{winnerName}</span>
                    </div>
                </div>

                {/* 최종 통계 */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 bg-yellow-400"></div>
                        <span className="text-yellow-400 font-bold text-lg">최종 통계</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {/* 총 라운드 */}
                        <div className="bg-[#2a2a2a] border-2 border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center">
                            <Icon name="gamecontroller" size={32} color="#9CA3AF" className="mb-2" />
                            <div className="text-yellow-400 text-4xl font-bold mb-1">{stats.totalRounds}</div>
                            <div className="text-gray-400 text-sm font-medium">총 라운드</div>
                        </div>

                        {/* 플레이 시간 */}
                        <div className="bg-[#2a2a2a] border-2 border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center">
                            <Icon name="redclock" size={32} color="#9CA3AF" className="mb-2" />
                            <div className="text-yellow-400 text-4xl font-bold mb-1">{stats.playTime}</div>
                            <div className="text-gray-400 text-sm font-medium">플레이 시간</div>
                        </div>

                        {/* 정답률 */}
                        <div className="bg-[#2a2a2a] border-2 border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center">
                            <Icon name="dart" size={32} color="#9CA3AF" className="mb-2" />
                            <div className="text-yellow-400 text-4xl font-bold mb-1">{stats.accuracyRate}%</div>
                            <div className="text-gray-400 text-sm font-medium">정답률</div>
                        </div>
                    </div>
                </div>

                {/* 라운드 결과 */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 bg-yellow-400"></div>
                        <span className="text-yellow-400 font-bold text-lg">라운드 결과</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {roundResults.map((round) => (
                            <div
                                key={round.id}
                                className="bg-[#3E3E3E] border-2 border-gray-200 rounded-xl p-3 flex items-center gap-3"
                            >
                                {/* 게임 로고 */}
                                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    <img src={round.logoUrl} alt={round.name} className="w-full h-full object-cover" />
                                </div>

                                {/* 게임 이름 */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-bold text-2xl truncate">{round.name}</div>
                                    <div className="text-green-400 text-lg flex items-center gap-1">
                                        <Icon name="ArrowBigRight" type="lucide" size={12} />
                                        <span>생존 (100 {'>'} 78회)</span>
                                    </div>
                                </div>

                                {/* 퍼센티지 */}
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-2xl font-bold"
                                        style={{
                                            color: round.percentage > 50 ? '#22C55E' :
                                                   round.percentage > 10 ? '#F59E0B' : '#EF4444'
                                        }}
                                    >
                                        {round.percentage}%
                                    </span>
                                    <Icon name="BadgeAlert" type="lucide" size={20} color="#22C55E" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 새로운 게임 시작 버튼 */}
                <div className="mt-6">
                    <button
                        onClick={onNewGame}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        새로운 게임 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
};
