import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Delete, Param, Headers, UseGuards, Put } from '@nestjs/common';
import { TrainingService } from './services/training.service';
import { CreateTrainingDto } from './Dtos/createTraining.dto';
import { CreateSessionDto } from './Dtos/createSession.dto';
import { SessionService } from './services/session.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/shared/gards/admin.gard';
import { Session } from 'src/models/session.schema';
import { Training } from 'src/models/training.schema';

@UseGuards(JwtAuthGuard)
@Controller('training')
export class TrainingController {

    constructor(private readonly trainingsService: TrainingService, private readonly sessionService: SessionService) { }

    /* trainings routes */

    @Post()
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    async addTrainings(@Body() data: CreateTrainingDto) {
        const newTraining = await this.trainingsService.create(data)
        return newTraining
    }

    @UseGuards(AdminGuard)
    @Get()
    async getAllTrainings() {
        const result = await this.trainingsService.findAll()
        return result
    }

    @Get(':id')
    async getTraining(@Param('id') trainingId: string) {
        const result = await this.trainingsService.findTrainingById(trainingId)
        return result
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async updateTraining(@Param('id') trainingId: string, @Body() updateData: Training) {
        const result = await this.trainingsService.updateTraining(trainingId, updateData)
        return result
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async deleteTraining(@Param('id') trainingId: string) {
        const result = await this.trainingsService.deleteTraining(trainingId)
        return result
    }

    @Get('/teacher/:id')
    async findTeacherTraining(@Param('id') teacherId: string) {
        const result = await this.trainingsService.findTeacherTraining(teacherId)
        return result
    }

    @Get('/student/:id')
    async findStudentTraining(@Param('id') studentId: string) {
        const result = await this.trainingsService.findStudentTraining(studentId)
        return result
    }

    /* sessions routes */

    @Post('session')
    @UsePipes(new ValidationPipe())
    async addSession(@Body() data: CreateSessionDto, @Headers('trainingid') id: string) {
        const result = await this.sessionService.create(id, data)
        return result
    }


    /*here was a modification , removed the header attribute */
    @Get('session/:id')
    async getSessionById(@Param('id') sessionId: string) {
        const result = await this.sessionService.findSessionById(sessionId)
        return result
    }

    @Put('session/:id')
    async updateSession(@Param('id') sessionId: string, @Headers('trainingid') trainingId: string, @Body() updateData: Session) {
        const result = await this.sessionService.updateSession(trainingId, sessionId, updateData)
        return result
    }

    @Delete('session/:id')
    async deleteSession(@Param('id') sessionId: string, @Headers('trainingid') trainingId: string) {
        const result = await this.sessionService.deleteSession(trainingId, sessionId)
        return result
    }

    @Put('session/addDocument/:id')
    async addSessionDocument(@Param('id') sessionId: string, @Headers('trainingid') trainingId: string, @Body() newDocument: any) {
        const result = await this.sessionService.addDocument(trainingId, sessionId, newDocument)
        return result
    }

    @Put('session/deleteDocuments/:id')
    async deleteSessionDocuments(@Param('id') sessionId: string, @Headers('trainingid') trainingId: string, @Body() documentsToDelete: any[]) {
        const result = await this.sessionService.deleteDocument(trainingId, sessionId, documentsToDelete)
        return result
    }

    /* quizzs routes */

    @Post('session/quizz/:id')
    async addQuizz(@Param('id') sessionId: string, @Headers('trainingid') trainingId: string, @Body() questionsToAdd: string[]) {
        const result = await this.sessionService.addQuizzQuestions(trainingId, sessionId, questionsToAdd)
        return result
    }

    @Put('session/quizz/:id')
    async deleteQuizz(@Param('id') sessionId: string, @Headers('trainingid') trainingId: string, @Body() questionsToDelete: string[]) {
        const result = await this.sessionService.deleteQuizzQuestions(trainingId, sessionId, questionsToDelete)
        return result
    }

}
