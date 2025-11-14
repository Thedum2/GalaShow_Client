import { httpClient } from "@/api";
import { Minigame } from "@/api/model/response/minigame/Minigame";
import { MinigameListResponse } from "@/api/model/response/minigame/MinigameListResponse";
import { MinigameDetail } from "@/api/model/response/minigame/MinigameDetail";
import { SurvivalRate } from "@/api/model/response/minigame/SurvivalRate";
import { CreateMinigameRequest } from "@/api/model/request/minigame/CreateMinigameRequest";
import { UpdateMinigameRequest } from "@/api/model/request/minigame/UpdateMinigameRequest";
import { AddSurvivalRateRequest } from "@/api/model/request/minigame/AddSurvivalRateRequest";
import { UpdateSurvivalRateRequest } from "@/api/model/request/minigame/UpdateSurvivalRateRequest";

export interface MinigameQueryParams {
  scale?: string;
  difficulty?: string;
  round?: string;
  type?: string;
  survivalRate?: string;
  winCondition?: string;
}

export const MinigameApi = {
  /**
   * [6-1] 미니게임 목록 조회
   * GET /minigames
   */
  list(params?: MinigameQueryParams): Promise<MinigameListResponse> {
    const queryString = params
      ? "?" +
        Object.entries(params)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
          .join("&")
      : "";
    return httpClient.get<MinigameListResponse>(
      `/minigames${queryString}`,
      MinigameListResponse.fromJSON
    );
  },

  /**
   * [6-2] 미니게임 상세 조회
   * GET /minigames/{gameId}
   */
  get(gameId: number): Promise<MinigameDetail> {
    return httpClient.get<MinigameDetail>(
      `/minigames/${gameId}`,
      MinigameDetail.fromJSON
    );
  },

  /**
   * [6-3] 미니게임 생성 (관리자)
   * POST /minigames
   */
  create(request: CreateMinigameRequest): Promise<Minigame> {
    return httpClient.post<Minigame>("/minigames", request, Minigame.fromJSON);
  },

  /**
   * [6-4] 미니게임 수정 (관리자)
   * PUT /minigames/{gameId}
   */
  update(gameId: number, request: UpdateMinigameRequest): Promise<Minigame> {
    return httpClient.put<Minigame>(
      `/minigames/${gameId}`,
      request,
      Minigame.fromJSON
    );
  },

  /**
   * [6-5] 미니게임 삭제 (관리자)
   * DELETE /minigames/{gameId}
   */
  delete(gameId: number): Promise<void> {
    return httpClient.delete(`/minigames/${gameId}`);
  },

  /**
   * [6-6] 미니게임 생존률 조회
   * GET /minigames/{gameId}/survival-rate
   */
  getSurvivalRate(gameId: number): Promise<SurvivalRate> {
    return httpClient.get<SurvivalRate>(
      `/minigames/${gameId}/survival-rate`,
      SurvivalRate.fromJSON
    );
  },

  /**
   * [6-7] 미니게임 생존률 데이터 추가
   * POST /minigames/{gameId}/survival-rate
   */
  addSurvivalRate(
    gameId: number,
    request: AddSurvivalRateRequest
  ): Promise<SurvivalRate> {
    return httpClient.post<SurvivalRate>(
      `/minigames/${gameId}/survival-rate`,
      request,
      SurvivalRate.fromJSON
    );
  },
};
