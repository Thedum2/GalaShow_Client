export class Banner {
  id:number; message:string; order:number;
  private constructor(id:number, message:string, order:number){ this.id=id; this.message=message; this.order=order; }
  static fromJSON(j:any):Banner{ return new Banner(Number(j?.id??0), String(j?.message??""), Number(j?.order??0)); }
}
