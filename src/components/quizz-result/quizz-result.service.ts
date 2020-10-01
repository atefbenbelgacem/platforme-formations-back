import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QUIZZRESULT_MODEL_NAME } from 'src/shared/constants/constants';
import { Model } from 'mongoose';
import { QuizzResult } from 'src/models/quizzResult.schema';
import { CreateResultDto } from './quizz-result.dto';
import { SessionService } from '../training/services/session.service';
import { Question } from 'src/models/question.schema';
import * as _ from 'lodash'

@Injectable()
export class QuizzResultService {

    constructor(@InjectModel(QUIZZRESULT_MODEL_NAME) private readonly quizzResultModel: Model<QuizzResult>, private readonly sessionService: SessionService) { }

    async create(data: CreateResultDto): Promise<QuizzResult> {
        const session = await this.sessionService.findSessionById(data.session)
        const quizz: Question[] = session.quizz
        let counter: number = 0
        data.quizzAnswers.map(answer => {
            const index = quizz.findIndex(question => {
                return answer.question === question.id
            })
            if (index > -1) {
                if (_.isEqual(_.sortBy(answer.answers), _.sortBy(quizz[index].correctAnswers))) {
                    counter += 1
                }
            }
        })
        data.score = counter
        const createdResult = new this.quizzResultModel(data)
        const result = createdResult.save()
        return result
    }

    async findSessionResults(sessionId: string): Promise<QuizzResult[]> {
        let results: QuizzResult[]
        try {
            results = await this.quizzResultModel.find({ session: sessionId }).
                populate({
                    path: 'user', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'session', select: '-__v -documents', populate: {
                        path: 'quizz', select: '-__v'
                    }
                }).
                exec()
        } catch (error) {
            throw new NotFoundException('could not find this session results', error)
        }
        return results
    }

    async findAllUserResults(userId: string): Promise<QuizzResult[]> {
        let results: QuizzResult[]
        try {
            results = await this.quizzResultModel.find({ user: userId }).
                populate({
                    path: 'user', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'session', select: '-__v -documents', populate: {
                        path: 'quizz', select: '-__v'
                    }
                }).
                exec()
        } catch (error) {
            throw new NotFoundException('could not find this user results', error)
        }
        return results
    }

    async findUserResult(userId: string, sessionId: string): Promise<QuizzResult> {
        let result: QuizzResult
        try {
            result = await this.quizzResultModel.findOne({ user: userId, session: sessionId }).
                populate({
                    path: 'user', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'session', select: '-__v -documents', populate: {
                        path: 'quizz', select: '-__v'
                    }
                }).
                exec()
        } catch (error) {
            throw new NotFoundException('could not find this user result for this session', error)
        }
        return result
    }
}
