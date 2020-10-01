import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QUESTIONS_MODEL_NAME } from 'src/shared/constants/constants';
import { Model } from 'mongoose';
import { Question } from 'src/models/question.schema';
import { CreateQuestionDto } from './Dtos/createQuestion.dto';
import { CreateQuestionsDto } from './Dtos/createQuestions.dto';

@Injectable()
export class QuestionsService {

    constructor(@InjectModel(QUESTIONS_MODEL_NAME) private readonly questionsModel: Model<Question>) { }

    async create(createQuestionData: CreateQuestionDto): Promise<Question> {
        const createdQuestion = new this.questionsModel(createQuestionData)
        const result = await createdQuestion.save()
        return result
    }

    async createMany(createQuestionsData: CreateQuestionsDto): Promise<Question[]> {
        let result: Question[]

        try {
            result = await this.questionsModel.insertMany(createQuestionsData.questions)
        } catch (error) {
            throw new InternalServerErrorException('could not insert many questions', error)
        }
        return result
    }

    async findAll(): Promise<Question[]> {
        const questions = await this.questionsModel.find().exec()
        return questions
    }

    async findQuestionById(id: string): Promise<Question> {
        let question: Question
        try {
            question = await this.questionsModel.findById(id).exec()
        } catch (error) {
            throw new InternalServerErrorException('could not find question, invalid Id provided')
        }
        if (!question) {
            throw new NotFoundException('could not find question, question does not exist')
        }
        return question
    }

    async updateQuestion(id: string, updateData: Question): Promise<Question> {
        const question = await this.findQuestionById(id)
        const updatedQuestion = question.set(updateData)
        const result = await question.save()
        return result
    }

    async deleteQuestion(id: string): Promise<Question> {
        let question: Question

        try {
            question = await this.questionsModel.findByIdAndDelete(id).exec()
        } catch (error) {
            throw new InternalServerErrorException('could not find the question, invalid Id provided')
        }
        if (question) {
            return question
        } else {
            throw new NotFoundException('could not find the question, question does not exist')
        }
    }
}
