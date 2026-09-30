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
    /** 채팅 투표 번호(!번호). 카드 좌측 상단에 표시한다. */
    number?: number;
    /** 이 게임이 받은 표 */
    votes?: number;
    /** 전체 투표 수 */
    totalVotes?: number;
    /** 가장 많은 표를 받은 카드 */
    isLeading?: boolean;
    /** 현재 생존자 수. 생존율로 예상 생존 인원을 계산한다. */
    survivorCount?: number;
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
                                                      number,
                                                      votes = 0,
                                                      totalVotes = 0,
                                                      isLeading = false,
                                                      survivorCount,
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

    const votePercentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    const rate = survivalRate?.survivalRate ?? 0;
    // 생존율은 소수 첫째 자리까지만 보여준다(예: 14.655172 → 14.7).
    const rateLabel = Number.isInteger(rate) ? String(rate) : rate.toFixed(1);
    const expectedSurvivors = survivorCount !== undefined ? Math.round((survivorCount * rate) / 100) : null;

    return (
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-200 ${
            isSelected ? 'ring-4 ring-yellow-500' : ''
        }`} style={{
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
        }}>

            {number !== undefined && (
                <div className="absolute left-3 top-3 z-10 flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-black bg-yellow-400 px-2 text-xl font-black text-black shadow-lg">
                    {number}
                </div>
            )}

            {/* 카드 내용 */}
            <div className="relative flex flex-col h-full">
                {/* 상단: 아이콘과 제목 */}
                <div className="flex h-30 items-center bg-cyan-600 justify-center py-2">
                    <img
                        src={logoUrl}
                        className={"w-16 h-16 rounded-xl border-black object-cover"}
                        alt={title}
                        onError={(e) => {

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
                    {/* 채팅 투표(민심) */}
                    {number !== undefined && (
                        <div className="w-full space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLeading ? 'bg-yellow-500' : 'bg-purple-600'}`}>
                                    <Icon name={isLeading ? "Crown" : "Vote"} type="lucide" size={isLeading ? 22 : 26} className={isLeading ? "text-black" : "text-white"}/>
                                </div>
                                <span className="text-white text-2xl font-bold">{totalVotes > 0 ? `${votePercentage}%` : '--%'}</span>
                                <span className="text-gray-400 text-lg ml-auto">
                                    {totalVotes > 0 ? `${votes}표` : `!${number} 입력`}
                                </span>
                            </div>
                            <div className="w-full h-3.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isLeading ? 'bg-yellow-500' : 'bg-purple-600'}`}
                                    style={{width: `${votePercentage}%`}}
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
                                생존율 {rateLabel}%
                                {expectedSurvivors !== null && (
                                    <span className="text-gray-400 text-sm ml-2">
                                        {survivorCount}명 중 {expectedSurvivors}명 생존 예상
                                    </span>
                                )}
                            </div>
                            <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                                    style={{width: `${Math.min(rate, 100)}%`}}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* 하단: 선택하기 버튼 */}
                <div className="mt-4">
                    <button
                        onClick={onSelect}
                        className={`focus:outline-none focus:ring-0 w-full font-black text-lg py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
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
