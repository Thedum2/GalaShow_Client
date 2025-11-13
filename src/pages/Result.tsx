import {
    GameResultHeader,
    SurvivorsList,
    EliminatedList,
    RoundMVP,
    type Participant,
    type MVPData
} from "@/components/result";

export default function Result() {
    // 임시 데이터
    const survivors: Participant[] = Array(13).fill(null).map((_, i) => ({
        id: `survivor-${i}`,
        name: i % 3 === 0 ? "불친절한델시코기" : i % 3 === 1 ? "대상혁" : "가나다라마바사아자차카타파하",
        platform: (["chzzk", "youtube", "soop"] as const)[i % 3]
    }));

    const eliminated: Participant[] = Array(13).fill(null).map((_, i) => ({
        id: `eliminated-${i}`,
        name: i % 3 === 0 ? "불친절한델시코기" : i % 3 === 1 ? "대상혁" : "가나다라마바사아자차카타파하",
        platform: (["chzzk", "youtube", "soop"] as const)[i % 3]
    }));

    const mvps: MVPData[] = [
        {
            id: "mvp-1",
            name: "불친절한델시코기",
            platform: "chzzk",
            achievement: "5번의 네네코 마시로의 딜레마를 전부 맞췄습니다!"
        },
        {
            id: "mvp-2",
            name: "가나디의슬기운여행",
            platform: "youtube",
            comment: "구냥 바보",
            achievement: "5번의 네네코 마시로의 딜레마를 전부 맞췄습니다!"
        },
        {
            id: "mvp-3",
            name: "가나다라마바사아자차카타파하",
            platform: "soop",
            comment: "구루룽"
        }
    ];

    const handleGameEnd = () => {
        console.log("게임 종료");
    };

    const handleNextRound = () => {
        console.log("다음 라운드로");
    };

    return (
        <div className="flex flex-col h-full w-full pr-10 pl-10 pt-6 pb-6 gap-6">
            {/* 1.상단 */}
            <GameResultHeader
                gameTitle="트롤리 딜레마"
                gameLogoUrl="https://d1yviy8q74fot9.cloudfront.net/samplelogo.png"
                roundNumber={2}
                totalParticipants={142}
                survivors={58}
                eliminated={84}
                survivalRate={12.8}
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
