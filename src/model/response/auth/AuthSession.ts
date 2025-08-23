import { AuthUser } from "./AuthUser";
export class AuthSession {
  accessToken:string; expiresIn:number; accessExpiresAt:string;
  refreshToken:string; refreshExpiresIn:number; refreshExpiresAt:string;
  user: AuthUser;
  private constructor(a:string, ei:number, aea:string, r:string, rei:number, rea:string, u:AuthUser){
    this.accessToken=a; this.expiresIn=ei; this.accessExpiresAt=aea; this.refreshToken=r; this.refreshExpiresIn=rei; this.refreshExpiresAt=rea; this.user=u;
  }
  static fromJSON(j:any):AuthSession{
    return new AuthSession(String(j?.accessToken??""), Number(j?.expiresIn??0), String(j?.accessExpiresAt??""),
                           String(j?.refreshToken??""), Number(j?.refreshExpiresIn??0), String(j?.refreshExpiresAt??""),
                           AuthUser.fromJSON(j?.user??{}));
  }
}
