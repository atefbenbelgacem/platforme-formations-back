import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConstants } from "./constants";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('access_token'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserById(payload.sub)
    return { userId: payload.sub, email: payload.email, user: user }
  }
}