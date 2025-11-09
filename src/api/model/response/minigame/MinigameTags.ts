export class MinigameTags {
  scale: string[];
  difficulty: string[];
  round: string[];
  type: string[];
  survivalRate: string[];
  winCondition: string[];

  private constructor(
    scale: string[],
    difficulty: string[],
    round: string[],
    type: string[],
    survivalRate: string[],
    winCondition: string[]
  ) {
    this.scale = scale;
    this.difficulty = difficulty;
    this.round = round;
    this.type = type;
    this.survivalRate = survivalRate;
    this.winCondition = winCondition;
  }

  static fromJSON(j: any): MinigameTags {
    return new MinigameTags(
      Array.isArray(j?.scale) ? j.scale : [],
      Array.isArray(j?.difficulty) ? j.difficulty : [],
      Array.isArray(j?.round) ? j.round : [],
      Array.isArray(j?.type) ? j.type : [],
      Array.isArray(j?.survivalRate) ? j.survivalRate : [],
      Array.isArray(j?.winCondition) ? j.winCondition : []
    );
  }
}
