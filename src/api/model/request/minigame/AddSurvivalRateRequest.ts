export class AddSurvivalRateRequest {
  totalPlayers: number;
  survivors: number;

  constructor(totalPlayers: number, survivors: number) {
    this.totalPlayers = totalPlayers;
    this.survivors = survivors;
  }
}
