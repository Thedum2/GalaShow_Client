interface GameResultHeaderProps {
    gameTitle: string;
    gameLogoUrl: string;
    roundNumber: number;
    totalParticipants: number;
    survivors: number;
    eliminated: number;
    survivalRate: number;
}

export default function GameResultHeader({
    gameTitle,
    gameLogoUrl,
    roundNumber,
    totalParticipants,
    survivors,
    eliminated,
    survivalRate
}: GameResultHeaderProps) {
    return (
        <div className="flex w-full h-[235px] bg-black/80 rounded-2xl px-8 py-6 items-center justify-between">
            {/* 좌측: 게임 정보 */}
            <div className="flex items-center gap-6">
                {/* 게임 아이콘 */}
                <img
                    src={gameLogoUrl}
                    className="w-[155px] h-[155px] rounded-xl border-black"
                    alt={gameTitle}
                />

                {/* 게임 타이틀 */}
                <div className="flex flex-col">
                    <h1 className="text-8xl font-black text-white mb-2">{gameTitle}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">🎮</span>
                        <span className="text-yellow-400 text-3xl font-bold">
                            라운드 {roundNumber} 결과
                        </span>
                    </div>
                </div>
            </div>

            {/* 우측: 통계 정보 */}
            <div className="flex items-center gap-8">
                {/* 총 참가 */}
                <div className="text-center">
                    <div className="text-7xl font-black text-white">{totalParticipants}</div>
                    <div className="text-2xl text-gray-400">총 참가</div>
                </div>

                <div className="h-20 w-px bg-gray-600"></div>

                {/* 생존 */}
                <div className="text-center">
                    <div className="text-7xl font-black text-green-500">{survivors}</div>
                    <div className="text-2xl text-gray-400">✓ 생존</div>
                </div>

                <div className="h-20 w-px bg-gray-600"></div>

                {/* 탈락 */}
                <div className="text-center">
                    <div className="text-7xl font-black text-red-500">{eliminated}</div>
                    <div className="text-2xl text-gray-400">✗ 탈락</div>
                </div>

                <div className="h-20 w-px bg-gray-600"></div>

                {/* 생존률 */}
                <div className="text-center">
                    <div className="text-7xl font-black text-yellow-400">{survivalRate}%</div>
                    <div className="text-2xl text-gray-400">📊 생존률</div>
                </div>
            </div>
        </div>
    );
}
