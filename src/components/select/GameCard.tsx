import React, { useState, useEffect } from 'react';
import {Icon} from '@/components/icons/Icon';
import { MinigameApi } from '@/api/modules/MinigameApi';
import { SurvivalRate } from '@/api/model/response/minigame/SurvivalRate';

export interface OptionItem {
    label: string;
    bgColor: string;
    textColor: string;
}

export interface GameCardProps {
    gameId: number;
    title: string;
    description: string;
    logoUrl: string;
    videoUrl: string;
    options?: OptionItem[];
    votePercentage?: number;
    totalVotes?: number;
    isSelected?: boolean;
    onSelect?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
                                                      gameId,
                                                      title,
                                                      description,
                                                      logoUrl,
                                                      videoUrl,
                                                      options,
                                                      votePercentage,
                                                      totalVotes,
                                                      isSelected = false,
                                                      onSelect,
                                                  }) => {
    const [survivalRate, setSurvivalRate] = useState<SurvivalRate | null>(null);
    const [isLoadingSurvival, setIsLoadingSurvival] = useState(true);

    // 생존률 데이터 로드
    useEffect(() => {
        const loadSurvivalRate = async () => {
            try {
                setIsLoadingSurvival(true);
                const data = await MinigameApi.getSurvivalRate(gameId);
                setSurvivalRate(data);
            } catch (error) {
                console.error(`Failed to load survival rate for game ${gameId}:`, error);
                setSurvivalRate(null);
            } finally {
                setIsLoadingSurvival(false);
            }
        };

        loadSurvivalRate();
    }, [gameId]);

    return (
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-200 ${
            isSelected ? 'ring-4 ring-yellow-500' : ''
        }`} style={{
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
        }}>

            {/* 카드 내용 */}
            <div className="relative flex flex-col h-full">
                {/* 상단: 아이콘과 제목 */}
                <div className="flex h-30 items-center bg-cyan-600 justify-center py-2">
                    <img
                        src={logoUrl}
                        className={"w-16 h-16 rounded-xl border-black object-cover"}
                        alt={title}
                        onError={(e) => {
                            e.currentTarget.src = "https://d1yviy8q74fot9.cloudfront.net/samplelogo.png";
                        }}
                    />
                </div>
                <div className="h-[180px] bg-black overflow-hidden">
                    <video
                        key={videoUrl}
                        src={videoUrl}
                        className="w-full h-full object-fill"
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-hidden
                        onError={(e) => {
                            e.currentTarget.src = "https://d1yviy8q74fot9.cloudfront.net/samplevideo2.mp4";
                        }}
                    />
                </div>

                {/* 중간: 내용 영역 */}
                <div className="flex-1 flex flex-col items-center justify-between gap-4 py-2 px-3">
                    <div className="flex flex-col gap-1">
                    <p className="text-white font-bold text-2xl text-left leading-relaxed">
                        {title}
                    </p>
                    <p className="text-gray-300 text-sm text-left leading-relaxed">
                        {description}
                    </p>
                    </div>
                    {options && (
                        <div className="w-full flex flex-wrap gap-2">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-1.5 rounded-full text-sm font-semibold"
                                    style={{
                                        backgroundColor: option.bgColor,
                                        color: option.textColor
                                    }}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* 투표율 섹션 - 현재 비워둠 */}
                    {votePercentage !== undefined && (
                        <div className="w-full space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                                    <Icon name="Vote" type="lucide" size={26} className="text-white"/>
                                </div>
                                <span className="text-white text-2xl font-bold">--%</span>
                                <span className="text-gray-400 text-lg ml-auto">
                                    투표 준비중
                                </span>
                            </div>
                            <div className="w-full h-3.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                                    style={{width: '0%'}}
                                />
                            </div>
                        </div>
                    )}

                    {/* 생존률 섹션 */}
                    {isLoadingSurvival ? (
                        <div className="w-full text-gray-400 text-sm">
                            생존률 로딩 중...
                        </div>
                    ) : survivalRate ? (
                        <div className="w-full space-y-1">
                            <div className="text-red-400 text-lg font-semibold">
                                생존율 {survivalRate.survivalRate}%
                                <span className="text-gray-400 text-sm ml-2">
                                    NNN명 중 NN명 생존 예상
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                                    style={{width: `${survivalRate.survivalRate}%`}}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* 하단: 선택하기 버튼 */}
                <div className="mt-4">
                    <button
                        onClick={onSelect}
                        className={`w-full font-black text-lg py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                            isSelected
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                        }`}
                    >
                        <Icon name={isSelected ? "Check" : "ChevronDown"} type="lucide" size={20}/>
                        {isSelected ? '선택됨' : '선택하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};
