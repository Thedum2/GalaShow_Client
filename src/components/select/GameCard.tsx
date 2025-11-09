import React from 'react';
import {Icon} from '@/components/icons/Icon';

export interface OptionItem {
    label: string;
    bgColor: string;
    textColor: string;
}

export interface GameCardProps {
    title: string;
    description: string;
    options?: OptionItem[];
    votePercentage?: number;
    totalVotes?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
                                                      title,
                                                      description,
                                                      options,
                                                      votePercentage,
                                                      totalVotes,
                                                  }) => {
    return (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
        }}>

            {/* 카드 내용 */}
            <div className="relative flex flex-col h-full">
                {/* 상단: 아이콘과 제목 */}
                <div className="flex h-30 items-center bg-gray-400 justify-center py-2">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvTOXhxA0qyte9tARIwfAiWi5GB0gvWwr3ug&s"
                        className={"w-16 h-16 rounded-full border-black"}
                    />
                </div>
                <div className="h-[180px] bg-black overflow-hidden">
                    <video
                        key='https://d1yviy8q74fot9.cloudfront.net/samplevideo2.mp4'
                        src='https://d1yviy8q74fot9.cloudfront.net/samplevideo2.mp4'
                        className="w-full h-full object-fill"
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-hidden
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
                    {votePercentage !== undefined && (
                        <div className="w-full space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                                    <Icon name="Vote" type="lucide" size={26} className="text-white"/>
                                </div>
                                <span className="text-white text-2xl font-bold">{votePercentage}%</span>
                                <span className="text-gray-400 text-lg ml-auto">
                                            {totalVotes}명 투표
                                        </span>
                            </div>
                            <div className="w-full h-3.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                                    style={{width: `${votePercentage}%`}}
                                />
                            </div>
                            <div className="text-red-400 text-lg font-semibold">
                                생존율 34%
                                <span className="text-gray-400 text-sm ml-2">
                                            158명 중 53명 생존 예상입니다
                                        </span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                                <div className="w-[34%] h-full bg-red-500 rounded-full"/>
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단: 선택하기 버튼 */}
                <div className="mt-4">
                    <button
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                        <Icon name="ChevronDown" type="lucide" size={20}/>
                        선택하기
                    </button>
                </div>
            </div>
        </div>
    );
};
