import { Minigame } from "./Minigame";

export class MinigameListResponse {
  total: number;
  items: Minigame[];

  private constructor(total: number, items: Minigame[]) {
    this.total = total;
    this.items = items;
  }

  static fromJSON(j: any): MinigameListResponse {
    const items = Array.isArray(j?.items) ? j.items.map(Minigame.fromJSON) : [];
    return new MinigameListResponse(Number(j?.total ?? 0), items);
  }
}
