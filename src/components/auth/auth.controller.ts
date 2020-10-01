import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authSerivce: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return await this.authSerivce.login(req.user)
    }

    @Get('/logout')
    logout(@Request() req) {
        req.logout();
    }
}
