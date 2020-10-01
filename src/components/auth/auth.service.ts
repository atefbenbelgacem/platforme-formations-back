import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findUserByEmail(email)
        if (user) {
            const hashedPassword = await bcrypt.compare(password, user.password)
            if (hashedPassword) {
                user.password = ""
                return user
            }

        }
        return null
    }

    async login(user: any) {
        const payload = { email: user._doc.email, sub: user._doc._id }
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
            user: user
        }
    }
}
