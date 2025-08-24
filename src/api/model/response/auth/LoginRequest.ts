export class LoginRequest {
  id: string; password: string;
  constructor(id:string, password:string){ this.id=id; this.password=password; }
  toPlain(){ return { id: this.id, password: this.password }; }
}
