export class UpdateMinigameRequest {
  name: string;
  description: string;
  videoUrl: string;
  logoUrl: string;
  tags: {
    scale: string[];
    difficulty: string[];
    round: string[];
    type: string[];
    survivalRate: string[];
    winCondition: string[];
  };
  phaseData: {
    READY: number;
    SETUP: number;
    PRESENT: number;
    INPUT: number;
    WAIT: number;
    EXECUTE: number;
    REVEAL: number;
    CLEANUP: number;
  };
  gameData: any;
  tutorial: Array<{ step: number; description: string }>;
  controls: Array<{ keyName: string; key: string[] }>;

  constructor(
    name: string,
    description: string,
    videoUrl: string,
    logoUrl: string,
    tags: {
      scale: string[];
      difficulty: string[];
      round: string[];
      type: string[];
      survivalRate: string[];
      winCondition: string[];
    },
    phaseData: {
      READY: number;
      SETUP: number;
      PRESENT: number;
      INPUT: number;
      WAIT: number;
      EXECUTE: number;
      REVEAL: number;
      CLEANUP: number;
    },
    gameData: any,
    tutorial: Array<{ step: number; description: string }>,
    controls: Array<{ keyName: string; key: string[] }>
  ) {
    this.name = name;
    this.description = description;
    this.videoUrl = videoUrl;
    this.logoUrl = logoUrl;
    this.tags = tags;
    this.phaseData = phaseData;
    this.gameData = gameData;
    this.tutorial = tutorial;
    this.controls = controls;
  }
}
