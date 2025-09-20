export class SnsLink {
  title:string; url:string; iconUrl:string; order:number;
  private constructor(t:string,u:string,i:string,o:number){ this.title=t; this.url=u; this.iconUrl=i; this.order=o; }
  static fromJSON(j:any):SnsLink{ return new SnsLink(String(j?.title??""), String(j?.url??""), String(j?.iconUrl??""), Number(j?.order??0)); }
}
