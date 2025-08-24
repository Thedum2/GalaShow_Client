export class SnsLink {
  title:string; url:string; icon_url:string; order:number;
  private constructor(t:string,u:string,i:string,o:number){ this.title=t; this.url=u; this.icon_url=i; this.order=o; }
  static fromJSON(j:any):SnsLink{ return new SnsLink(String(j?.title??""), String(j?.url??""), String(j?.icon_url??""), Number(j?.order??0)); }
}
