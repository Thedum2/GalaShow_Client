import { MinigameApi } from "@/api/modules/MinigameApi";
import { MinigameDetail } from "@/api/model/response/minigame/MinigameDetail";
import { findLocalMinigame, isLocalMinigameId } from "./localMinigames";

/**
 * 미니게임 상세 (phaseData·gameData 포함). 개발용 로컬 게임(음수 ID)은 내장 데이터를 쓴다.
 */
export async function loadMinigameDetail(gameId: number): Promise<MinigameDetail> {
    const local = isLocalMinigameId(gameId) ? findLocalMinigame(gameId) : null;
    return local ? MinigameDetail.fromJSON(local) : MinigameApi.get(gameId);
}
