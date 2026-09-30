import { MinigameTags } from "./MinigameTags";
import { PhaseData } from "./PhaseData";

export class TutorialStep {
  step: number;
  description: string;

  private constructor(step: number, description: string) {
    this.step = step;
    this.description = description;
  }

  static fromJSON(j: any): TutorialStep {
    return new TutorialStep(Number(j?.step ?? 0), String(j?.description ?? ""));
  }
}

export class ControlKey {
  keyName: string;
  key: string[];

  private constructor(keyName: string, key: string[]) {
    this.keyName = keyName;
    this.key = key;
  }

  static fromJSON(j: any): ControlKey {
    return new ControlKey(
      String(j?.keyName ?? ""),
      Array.isArray(j?.key) ? j.key : []
    );
  }
}

export class MinigameDetail {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  logoUrl: string;
  tags: MinigameTags;
  tutorial: TutorialStep[];
  controls: ControlKey[];
  /** 단계 시간(ms). Unity StartRound phaseDuration으로 변환해 쓴다 */
  phaseData: PhaseData;
  /** 게임별 데이터 (pluginId 등) */
  gameData: any;
  createdAt: string;
  updatedAt: string;

  private constructor(
    id: number,
    name: string,
    description: string,
    videoUrl: string,
    logoUrl: string,
    tags: MinigameTags,
    tutorial: TutorialStep[],
    controls: ControlKey[],
    phaseData: PhaseData,
    gameData: any,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.videoUrl = videoUrl;
    this.logoUrl = logoUrl;
    this.tags = tags;
    this.tutorial = tutorial;
    this.controls = controls;
    this.phaseData = phaseData;
    this.gameData = gameData;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJSON(j: any): MinigameDetail {
    const tutorial = Array.isArray(j?.tutorial) ? j.tutorial.map(TutorialStep.fromJSON) : [];
    const controls = Array.isArray(j?.controls) ? j.controls.map(ControlKey.fromJSON) : [];

    return new MinigameDetail(
      Number(j?.id ?? 0),
      String(j?.name ?? ""),
      String(j?.description ?? ""),
      String(j?.videoUrl ?? ""),
      String(j?.logoUrl ?? ""),
      MinigameTags.fromJSON(j?.tags ?? {}),
      tutorial,
      controls,
      PhaseData.fromJSON(j?.phaseData ?? {}),
      j?.gameData ?? {},
      String(j?.createdAt ?? ""),
      String(j?.updatedAt ?? "")
    );
  }
}
