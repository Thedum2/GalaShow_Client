import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurvivorPanel } from '@/components/common/SurvivorPanel';
import SelectionFooter from '@/components/select/SelectionFooter';
import { GameCard } from '@/components/select/GameCard';
import { MinigameApi } from '@/api/modules/MinigameApi';
import { Minigame } from '@/api/model/response/minigame/Minigame';
import { translateTags } from '@/utils/tagTranslation';
import { PATHS } from '@/routes/paths';

export default function Select() {
    const avatarUrl = 'https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj';
    const navigate = useNavigate();

    const participants = [
        { id: '1', name: '불친절한쉘시고기', platform: 'chzzk' as const },
        { id: '2', name: '삼광', platform: 'soop' as const },
        { id: '3', name: '불친절한쉘시고기', platform: 'youtube' as const },
        { id: '4', name: '대상 혁', platform: 'chzzk' as const },
        { id: '5', name: '대상 혁', platform: 'soop' as const },
        { id: '6', name: '가너다라마사아자차카타파하', platform: 'youtube' as const },
        { id: '7', name: '가니다', platform: 'soop' as const },
        { id: '8', name: '쀼뀨아', platform: 'soop' as const },
        { id: '9', name: '치지지지', platform: 'soop' as const },
        { id: '10', name: '수수수수수', platform: 'soop' as const },
        { id: '11', name: '유유유유유유마그네릭', platform: 'soop' as const },
    ];

    const [minigames, setMinigames] = useState<Minigame[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

    // 미니게임 목록 로드
    useEffect(() => {
        const loadMinigames = async () => {
            try {
                setIsLoading(true);
                const response = await MinigameApi.list();
                // 순서대로 4개만 가져오기
                const games = response.items.slice(0, 4);
                setMinigames(games);
            } catch (error) {
                console.error('Failed to load minigames:', error);
                setMinigames([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadMinigames();
    }, []);

    // 게임 선택 핸들러
    const handleSelectGame = (gameId: number) => {
        setSelectedGameId(gameId);
    };

    // 게임 시작 핸들러
    const handleStartGame = () => {
        if (selectedGameId !== null) {
            // Tutorial 페이지로 이동 (gameId를 state로 전달)
            navigate(PATHS.tutorial, { state: { gameId: selectedGameId } });
        }
    };

        return (

        <div className="flex h-full w-full pr-10 pl-10 pt-3 pb-3 gap-6">
            {/* 1. 좌측 영역 */}
            <div className="flex flex-1 flex-col gap-3">
                {/* 1-1. 상단 */}
                <div className="h-[165px] w-full flex items-center justify-between px-8">
                    <div className="text-red-500 text-[105px] font-black leading-none text-left whitespace-nowrap" style={{ letterSpacing: '115px' ,marginRight: '-115px'}}>
                        첫번째
                    </div>

                    <div className="relative h-[135px] w-[135px] rounded-full ring-4 ring-red-500 overflow-hidden">
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="text-white text-[105px] font-black leading-none text-right whitespace-nowrap" style={{ letterSpacing: '115px', marginRight: '-115px' }}>
                        라운드
                    </div>
                </div>

                {/* 1-2. 중간 */}
                <div className="flex-1 w-full grid grid-cols-4 gap-4">
                    {isLoading ? (
                        <div className="col-span-4 flex items-center justify-center text-white text-2xl">
                            미니게임 로딩 중...
                        </div>
                    ) : minigames.length === 0 ? (
                        <div className="col-span-4 flex items-center justify-center text-white text-2xl">
                            미니게임이 없습니다
                        </div>
                    ) : (
                        minigames.map((game) => {
                            const tags = translateTags(game.tags);
                            return (
                                <GameCard
                                    key={game.id}
                                    gameId={game.id}
                                    title={game.name}
                                    description={game.description}
                                    logoUrl={game.logoUrl}
                                    videoUrl={game.videoUrl}
                                    options={tags}
                                    votePercentage={0}
                                    totalVotes={0}
                                    isSelected={selectedGameId === game.id}
                                    onSelect={() => handleSelectGame(game.id)}
                                />
                            );
                        })
                    )}
                </div>

                {/* 1-3. 하단 */}
                <SelectionFooter
                    onStartGame={handleStartGame}
                    isDisabled={selectedGameId === null}
                />
            </div>

            {/* 2. 우측 영역 */}
            <div className="flex flex-col w-[350px] gap-3 min-h-0">
                {/* 2-1. 상단 */}
                <SurvivorPanel survivorCount={156} participants={participants} />

                {/* 2-2. 하단 */}
                <div className="flex-1 w-full border-2 flex border-purple-500 justify-center items-center text-white text-2xl font-black">
                    CAM / CHAT BOX AREA
                </div>
            </div>
        </div>
    );
}
