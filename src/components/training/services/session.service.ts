import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateSessionDto } from '../Dtos/createSession.dto';
import { Session, Document } from 'src/models/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SESSIONS_MODEL_NAME } from 'src/shared/constants/constants';


@Injectable()
export class SessionService {

    constructor(@InjectModel(SESSIONS_MODEL_NAME) private readonly sessionsModel: Model<Session>, private readonly trainingService: TrainingService) { }

    async create(trainingId: string, createSessionDto: CreateSessionDto) {
        const createdSession = new this.sessionsModel(createSessionDto)
        const result = await createdSession.save()
        const training = await this.trainingService.addSession(trainingId, result)
        return result
    }

    async findAll(): Promise<Session[]> {
        let result: Session[]
        try {
            result = await this.sessionsModel.find().
                populate({ path: 'quizz', select: '-__v' }).
                exec()
        } catch (error) {
            throw new NotFoundException('could not find the sessions')
        }
        return result
    }

    async findSessionById(sessionId: string): Promise<Session> {
        let result: Session
        try {
            result = await this.sessionsModel.findById(sessionId).
                populate({ path: 'quizz', select: '-__v' }).
                exec()
        } catch (error) {
            throw new NotFoundException('could not find the session, invalid Id provided')
        }
        if (!result) {
            throw new NotFoundException('could not find the session, session does not exist')
        }
        return result
    }

    async updateSession(trainingId: string, sessionId: string, updateData: Session): Promise<Session> {
        const session = await this.findSessionById(sessionId)
        const updatedSession = session.set(updateData)
        const result = await updatedSession.save()
        const training = await this.trainingService.updateSession(trainingId, result)
        return result
    }

    async deleteSession(trainingId: string, sessionId: string): Promise<Session> {
        let deletedSession: Session
        try {
            deletedSession = await this.sessionsModel.findByIdAndDelete(sessionId)
        } catch (error) {
            throw new NotFoundException('could not find the session, invalid Id provided')
        }
        if (deletedSession) {
            const training = await this.trainingService.deleteSession(trainingId, deletedSession)
            return deletedSession
        } else {
            throw new NotFoundException('could not find the training, training does not exist')
        }
    }

    async addDocument(trainingId: string, sessionId: string, newDocument: Document): Promise<Session> {
        const session = await this._getSessionById(sessionId)
        const documentsLength = session.documents.push(newDocument)
        const result = await session.save()
        const training = await this.trainingService.updateSession(trainingId, result)
        return result
    }

    async deleteDocument(trainingId: string, sessionId: string, documentsToDelete: Document[]): Promise<Session> {
        const session = await this._getSessionById(sessionId)
        documentsToDelete.map(file => {
            const index = session.documents.findIndex(doc => {
                return doc.link === file.link;
            });
            if (index > -1) {
                session.documents.splice(index, 1);
            } else {
                throw new NotFoundException('could not find the document')
            }
        })
        const result = await session.save()
        const training = await this.trainingService.updateSession(trainingId, result)
        return result
    }

    async addQuizzQuestions(trainingId: string, sessionId: string, newQuestionsIds: string[]): Promise<Session> {
        const session = await this._getSessionById(sessionId)
        newQuestionsIds.map(questionId => {
            const quizzLength = session.quizz.push(questionId)
        })
        const result = await session.save()
        const training = await this.trainingService.updateSession(trainingId, result)
        return result
    }

    async deleteQuizzQuestions(trainingId: string, sessionId: string, questionsToDelete: string[]): Promise<Session> {
        const session = await this._getSessionById(sessionId)
        questionsToDelete.map(questionId => {
            const index = session.quizz.indexOf(questionId)
            if (index > -1) {
                session.quizz.splice(index, 1);
            } else {
                throw new NotFoundException('could not find the question')
            }
        })
        const result = await session.save()
        const training = await this.trainingService.updateSession(trainingId, result)
        return result
    }

    private async _getSessionById(sessionId: string): Promise<Session> {
        let result: Session
        try {
            result = await this.sessionsModel.findById(sessionId).exec()
        } catch (error) {
            throw new NotFoundException('could not find the session, invalid Id provided')
        }
        if (!result) {
            throw new NotFoundException('could not find the session, session does not exist')
        }
        return result
    }
}
