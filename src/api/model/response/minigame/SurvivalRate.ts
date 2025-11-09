export class SurvivalRate {
  gameId: number;
  gameName: string;
  survivalRate: number;
  totalGames: number;
  totalPlayers: number;
  survivors: number;
  lastUpdated: string;

  private constructor(
    gameId: number,
    gameName: string,
    survivalRate: number,
    totalGames: number,
    totalPlayers: number,
    survivors: number,
    lastUpdated: string
  ) {
    this.gameId = gameId;
    this.gameName = gameName;
    this.survivalRate = survivalRate;
    this.totalGames = totalGames;
    this.totalPlayers = totalPlayers;
    this.survivors = survivors;
    this.lastUpdated = lastUpdated;
  }

  static fromJSON(j: any): SurvivalRate {
    return new SurvivalRate(
      Number(j?.gameId ?? 0),
      String(j?.gameName ?? ""),
      Number(j?.survivalRate ?? 0),
      Number(j?.totalGames ?? 0),
      Number(j?.totalPlayers ?? 0),
      Number(j?.survivors ?? 0),
      String(j?.lastUpdated ?? "")
    );
  }
}
