import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateQuestionDto } from './Dtos/createQuestion.dto';
import { CreateQuestionsDto } from './Dtos/createQuestions.dto';
import { Question } from 'src/models/question.schema';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionService: QuestionsService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async addQuestion(@Body() data: CreateQuestionDto) {
        const createdQuestion = await this.questionService.create(data)
        return createdQuestion
    }

    @Post('many')
    @UsePipes(new ValidationPipe())
    async createMany(@Body() data: CreateQuestionsDto) {
        const createdQuestions = await this.questionService.createMany(data)
        return createdQuestions
    }

    @Get()
    async getAllQuestions() {
        const questions = await this.questionService.findAll()
        return questions
    }

    @Get(':id')
    async getQuestionById(@Param('id') questionId: string) {
        const question = await this.questionService.findQuestionById(questionId)
        return question
    }

    @Put(':id')
    async updateQuestion(@Param('id') questionId: string, @Body() updateData: Question) {
        const result = await this.questionService.updateQuestion(questionId, updateData)
        return result
    }

    @Delete(':id')
    async deleteQuestion(@Param('id') questionId: string) {
        const result = await this.questionService.deleteQuestion(questionId)
        return result
    }
}
