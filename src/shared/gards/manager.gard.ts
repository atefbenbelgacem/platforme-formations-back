import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ManagerGuard implements CanActivate {

  constructor() { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false
    }
    return this.matchRoles(user.user);
  }
  matchRoles(user: any): boolean | Promise<boolean> | Observable<boolean> {
    return user.roleName === "Manager" ? true : false
  }
}