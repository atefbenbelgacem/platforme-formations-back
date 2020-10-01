import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body, Get, Param, Headers } from '@nestjs/common';
import { QuizzResultService } from './quizz-result.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateResultDto } from './quizz-result.dto';

@UseGuards(JwtAuthGuard)
@Controller('quizz-result')
export class QuizzResultController {

    constructor(private readonly quizzResultService: QuizzResultService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async addResult(@Body() data: CreateResultDto) {
        const createdResult = await this.quizzResultService.create(data)
        return createdResult
    }

    @Get(':id')
    async getAllUserResults(@Param('id') userId: string) {
        const results = await this.quizzResultService.findAllUserResults(userId)
        return results
    }

    @Get('user/:id')
    async getUserResult(@Param('id') userId: string, @Headers('sessionid') sessionId: string) {
        const results = await this.quizzResultService.findUserResult(userId, sessionId)
        return results
    }

    @Get('session/:id')
    async getSessionResults(@Param('id') sessionId: string) {
        const results = await this.quizzResultService.findSessionResults(sessionId)
        return results
    }
}
