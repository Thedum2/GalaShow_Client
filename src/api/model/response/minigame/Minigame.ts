import { MinigameTags } from "./MinigameTags";
import { PhaseData } from "./PhaseData";

export class Minigame {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  logoUrl: string;
  tags: MinigameTags;
  phaseData: PhaseData;
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
    this.phaseData = phaseData;
    this.gameData = gameData;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJSON(j: any): Minigame {
    return new Minigame(
      Number(j?.id ?? 0),
      String(j?.name ?? ""),
      String(j?.description ?? ""),
      String(j?.videoUrl ?? ""),
      String(j?.logoUrl ?? ""),
      MinigameTags.fromJSON(j?.tags ?? {}),
      PhaseData.fromJSON(j?.phaseData ?? {}),
      j?.gameData ?? {},
      String(j?.createdAt ?? ""),
      String(j?.updatedAt ?? "")
    );
  }
}
