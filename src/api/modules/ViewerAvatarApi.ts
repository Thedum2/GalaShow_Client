import { httpClient } from "@/api";
import { ViewerAvatar } from "@/api/model/response/minigame/ViewerAvatar";
import { UpdateViewerAvatarsRequest } from "@/api/model/request/minigame/UpdateViewerAvatarsRequest";

export const ViewerAvatarApi = {
  /**
   * [6-9] 시청자 아바타 목록 조회
   * GET /viewer-avatars
   */
  list(): Promise<ViewerAvatar[]> {
    return httpClient.getList<ViewerAvatar>(
      "/viewer-avatars",
      ViewerAvatar.fromJSON
    );
  },

  /**
   * [6-10] 시청자 아바타 목록 수정 (관리자)
   * PUT /viewer-avatars
   */
  update(request: UpdateViewerAvatarsRequest): Promise<void> {
    return httpClient.put<void>("/viewer-avatars", request, () => undefined);
  },
};
