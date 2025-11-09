export class UpdateSurvivalRateRequest {
  survivalRate: number;
  totalGames: number;
  totalPlayers: number;
  survivors: number;

  constructor(
    survivalRate: number,
    totalGames: number,
    totalPlayers: number,
    survivors: number
  ) {
    this.survivalRate = survivalRate;
    this.totalGames = totalGames;
    this.totalPlayers = totalPlayers;
    this.survivors = survivors;
  }
}
