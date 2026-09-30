import {
    GameResultHeader,
    SurvivorsList,
    EliminatedList,
    RoundMVP,
    type Participant,
    type MVPData
} from "@/components/result";
import {useNavigate} from "react-router-dom";
import {PATHS} from "@/routes/paths";
import fallbackLogoUrl from "@/assets/svg/logo.svg?url";
import {selectLastResult, useSessionStore} from "@/stores/session";
import type {LobbyParticipant} from "@/stores/lobby";

const toParticipant = (p: LobbyParticipant): Participant => ({id: p.id, name: p.nickname, platform: p.platform});

/**
 * 게임별 결과 상세에서 한 줄 요약을 만든다 (트롤리: 호스트가 지킨 쪽)
 */
function achievementText(detail: any): string | undefined {
    if (detail?.hostChoiceNumber || detail?.hostChoice) {
        return `호스트가 지킨 ${detail.hostChoiceNumber ? `${detail.hostChoiceNumber}번` : detail.hostChoice}을 맞혔습니다!`;
    }
    return undefined;
}

export default function Result() {
    const navigate = useNavigate();
    const result = useSessionStore(selectLastResult);
    const nextRound = useSessionStore((s) => s.nextRound);

    if (!result) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-white">
                <span className="text-4xl font-black">아직 확정된 라운드 결과가 없습니다</span>
                <button
                    onClick={() => navigate(PATHS.select)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl"
                >
                    게임 선택으로
                </button>
            </div>
        );
    }

    const survivors = result.survivors.map(toParticipant);
    const eliminated = result.eliminated.map(toParticipant);
    const total = result.participants.length;
    const survivalRate = total > 0 ? Math.round((survivors.length / total) * 1000) / 10 : 0;

    // 이번 라운드 생존자 중 앞의 3명을 소개한다 (MVP 선정 기준은 PRD 미정)
    const achievement = achievementText(result.detail);
    const mvps: MVPData[] = survivors.slice(0, 3).map((p) => ({...p, achievement}));

    // 최후의 1인: 생존자가 1명 이하이면 최종 결과로
    const isFinal = survivors.length <= 1;

    const handleGameEnd = () => navigate(PATHS.winner);

    const handleNextRound = () => {
        if (isFinal) {
            navigate(PATHS.winner);
            return;
        }
        nextRound();
        navigate(PATHS.select, {viewTransition: true});
    };

    return (
        <div className="flex flex-col h-full w-full pr-10 pl-10 pt-6 pb-6 gap-6">
            {/* 1.상단 */}
            <GameResultHeader
                gameTitle={result.gameName}
                gameLogoUrl={result.gameLogoUrl || fallbackLogoUrl}
                roundNumber={result.round}
                totalParticipants={total}
                survivors={survivors.length}
                eliminated={eliminated.length}
                survivalRate={survivalRate}
            />

            {/* 2.하단 */}
            <div className="flex flex-1 w-full gap-3 min-h-0">
                {/* 2-1. 생존자 목록 */}
                <SurvivorsList survivors={survivors} />

                {/* 2-2. 탈락자 목록 */}
                <EliminatedList eliminated={eliminated} />

                {/* 2-3. 라운드 MVP */}
                <RoundMVP
                    mvps={mvps}
                    onGameEnd={handleGameEnd}
                    onNextRound={handleNextRound}
                />

                {/* 2-4. 빈 영역 */}
                <div className="flex-[1] border-2 border-yellow-500 rounded-3xl flex text-2xl items-center justify-center text-white">
                    <span>CAM / CHAT BOX AREA</span>
                </div>
            </div>
        </div>
    );
}
