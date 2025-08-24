export class AuthUser {
  id: string; role: string;
  private constructor(id:string, role:string){ this.id=id; this.role=role; }
  static fromJSON(j:any):AuthUser{ return new AuthUser(String(j?.id??""), String(j?.role??"")); }
}
