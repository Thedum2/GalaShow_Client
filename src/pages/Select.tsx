import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurvivorPanel } from '@/components/common/SurvivorPanel';
import SelectionFooter from '@/components/select/SelectionFooter';
import { GameCard } from '@/components/select/GameCard';
import HostAvatar from '@/components/common/HostAvatar';
import { MinigameApi } from '@/api/modules/MinigameApi';
import { Minigame } from '@/api/model/response/minigame/Minigame';
import { translateTags } from '@/utils/tagTranslation';
import { PATHS } from '@/routes/paths';
import { polyChat } from '@/stores/polychat';
import { roundLabel, useSessionStore } from '@/stores/session';
import type { ChatMessage } from 'polychat-bridge';
import { LOCAL_MINIGAMES, LOCAL_MINIGAMES_ENABLED, isLocalMinigameId } from '@/game/localMinigames';

/** 한 번에 보여줄 후보 게임 수(카드 칸 수) */
const CANDIDATE_COUNT = 4;

/** 채팅 투표: "!1", "!투표1", "! 2" 처럼 번호만 받는다. */
const VOTE_PATTERN = /^!\s*(?:투표)?\s*(\d+)$/;

const shuffle = <T,>(items: T[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

/**
 * 후보 게임을 무작위로 고른다. 이미 진행한 게임은 가능하면 빼고, 재추첨이면 직전 후보가 아닌 게임을 먼저 고른다.
 * PRD에서 직접/무작위 선택 정책은 미정이며, 현재는 무작위 후보 + 스트리머의 최종 선택이다.
 */
function pickCandidates(all: Minigame[], playedIds: number[], previousIds: number[] = []) {
    const fresh = all.filter((g) => !playedIds.includes(g.id));
    const pool = fresh.length >= Math.min(CANDIDATE_COUNT, all.length) ? fresh : all;
    const shuffled = shuffle(pool);
    return [
        ...shuffled.filter((g) => !previousIds.includes(g.id)),
        ...shuffled.filter((g) => previousIds.includes(g.id)),
    ].slice(0, CANDIDATE_COUNT);
}

export default function Select() {
    const navigate = useNavigate();
    const { round, survivors, playedGameIds, selectGame } = useSessionStore();

    const [allGames, setAllGames] = useState<Minigame[]>([]);
    const [candidates, setCandidates] = useState<Minigame[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    // 시청자(플랫폼:닉네임)별 마지막 투표. 값은 후보 카드 번호(0부터).
    const [votes, setVotes] = useState<Map<string, number>>(new Map());
    const candidateCount = useRef(0);
    candidateCount.current = candidates.length;

    // 미니게임 목록 로드
    useEffect(() => {
        const loadMinigames = async () => {
            try {
                setIsLoading(true);
                // 개발 빌드: DB에 없는 Unity 게임(로컬)을 후보 맨 앞에 둔다
                const localAll = LOCAL_MINIGAMES_ENABLED ? LOCAL_MINIGAMES.map((g) => Minigame.fromJSON(g)) : [];
                let items: Minigame[] = [];
                try {
                    items = (await MinigameApi.list()).items;
                } catch (error) {
                    if (localAll.length === 0) throw error;
                    console.warn('Failed to load minigames, using local games only:', error);
                }
                // DB에 같은 이름의 게임이 등록되면 DB 쪽을 쓴다
                const local = localAll.filter((l) => !items.some((g) => g.name === l.name));
                const all = [...local, ...items];
                setAllGames(all);
                const picked = pickCandidates(all, useSessionStore.getState().playedGameIds);
                const pinned = local.filter((g) => !useSessionStore.getState().playedGameIds.includes(g.id));
                setCandidates([...pinned, ...picked.filter((g) => !isLocalMinigameId(g.id))].slice(0, CANDIDATE_COUNT));
            } catch (error) {
                console.error('Failed to load minigames:', error);
                setAllGames([]);
                setCandidates([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadMinigames();
    }, []);

    // 채팅 투표(민심 확인). 시청자 1명당 1표이며 다시 투표하면 마지막 표로 바뀐다.
    useEffect(() => {
        const handleMessage = ({ platform, message }: { platform: string; message: ChatMessage }) => {
            const match = VOTE_PATTERN.exec(message.content.trim());
            if (!match || message.nickname === 'SYSTEM') return;
            const index = Number(match[1]) - 1;
            if (index < 0 || index >= candidateCount.current) return;
            setVotes((prev) => new Map(prev).set(`${platform}:${message.nickname}`, index));
        };
        polyChat.on('message', handleMessage);
        return () => {
            polyChat.off('message', handleMessage);
        };
    }, []);

    const voteCounts = useMemo(() => {
        const counts = candidates.map(() => 0);
        votes.forEach((index) => {
            if (index < counts.length) counts[index]++;
        });
        return counts;
    }, [votes, candidates]);
    const totalVotes = voteCounts.reduce((sum, n) => sum + n, 0);
    const maxVotes = Math.max(0, ...voteCounts);

    // 후보를 바꿀 수 있는 게임이 더 있을 때만 재추첨한다. 투표와 선택은 초기화한다.
    const redrawPool = allGames.filter((g) => !playedGameIds.includes(g.id));
    const canRedraw = (redrawPool.length >= Math.min(CANDIDATE_COUNT, allGames.length) ? redrawPool : allGames).length > CANDIDATE_COUNT;
    const handleRedraw = () => {
        setCandidates((current) => pickCandidates(allGames, playedGameIds, current.map((g) => g.id)));
        setVotes(new Map());
        setSelectedGameId(null);
    };

    const handleStartGame = () => {
        if (selectedGameId === null) return;
        selectGame(selectedGameId);
        // Tutorial 페이지로 이동 (gameId를 state로 전달)
        navigate(PATHS.tutorial, { state: { gameId: selectedGameId }, viewTransition: true });
    };

    const label = roundLabel(round);
    // 큰 글자 사이 간격은 글자 수에 맞춰 줄인다(첫번째 3글자 기준 115px).
    const spacing = label.length <= 3 ? 115 : label.length === 4 ? 70 : 40;
    const survivorParticipants = survivors.map((p) => ({ id: p.id, name: p.nickname, platform: p.platform }));

    return (
        <div className="flex h-full w-full pr-10 pl-10 pt-3 pb-3 gap-6 animate-page-in motion-reduce:animate-none">
            {/* 1. 좌측 영역 */}
            <div className="flex flex-1 flex-col gap-3">
                {/* 1-1. 상단 */}
                <div className="h-[165px] w-full flex items-center justify-between px-8">
                    <div className="text-red-500 text-[105px] font-black leading-none text-left whitespace-nowrap" style={{ letterSpacing: `${spacing}px`, marginRight: `-${spacing}px` }}>
                        {label}
                    </div>

                    <HostAvatar size={135} />

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
                    ) : candidates.length === 0 ? (
                        <div className="col-span-4 flex items-center justify-center text-white text-2xl">
                            미니게임이 없습니다
                        </div>
                    ) : (
                        candidates.map((game, index) => (
                            <div key={game.id} className="grid min-h-0 animate-participant-in motion-reduce:animate-none" style={{ animationDelay: `${index * 70}ms` }}>
                                <GameCard
                                    gameId={game.id}
                                    title={game.name}
                                    description={game.description}
                                    logoUrl={game.logoUrl}
                                    videoUrl={game.videoUrl}
                                    options={translateTags(game.tags)}
                                    number={index + 1}
                                    votes={voteCounts[index]}
                                    totalVotes={totalVotes}
                                    isLeading={totalVotes > 0 && voteCounts[index] === maxVotes}
                                    survivorCount={survivors.length}
                                    isSelected={selectedGameId === game.id}
                                    onSelect={() => setSelectedGameId(game.id)}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* 1-3. 하단 */}
                <SelectionFooter
                    onStartGame={handleStartGame}
                    onRedraw={handleRedraw}
                    isDisabled={selectedGameId === null}
                    isRedrawDisabled={!canRedraw}
                    totalVotes={totalVotes}
                />
            </div>

            {/* 2. 우측 영역 */}
            <div className="flex flex-col w-[350px] gap-3 min-h-0">
                {/* 2-1. 상단 */}
                <SurvivorPanel survivorCount={survivors.length} participants={survivorParticipants} />

                {/* 2-2. 하단 */}
                <div className="flex-1 w-full border-2 flex border-purple-500 justify-center items-center text-white text-2xl font-black">
                    CAM / CHAT BOX AREA
                </div>
            </div>
        </div>
    );
}
