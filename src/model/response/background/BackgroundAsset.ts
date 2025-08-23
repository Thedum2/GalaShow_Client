export type BackgroundType = "image" | "video";
export class BackgroundAsset {
  id:number; title:string; type:BackgroundType; url:string;
  private constructor(id:number, title:string, type:BackgroundType, url:string){ this.id=id; this.title=title; this.type=type; this.url=url; }
  static fromJSON(j:any):BackgroundAsset{ const t=String(j?.type??"image"); return new BackgroundAsset(Number(j?.id??0), String(j?.title??""), (t as BackgroundType), String(j?.url??"")); }
}
