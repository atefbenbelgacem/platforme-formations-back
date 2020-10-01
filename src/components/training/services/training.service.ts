import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Training } from 'src/models/training.schema';
import { CreateTrainingDto } from '../Dtos/createTraining.dto';
import { NodeMailerService } from 'src/shared/services/node-mailer.service';
import { TRAININGS_MODEL_NAME } from 'src/shared/constants/constants';
import { Session } from 'src/models/session.schema';

@Injectable()
export class TrainingService {

    constructor(@InjectModel(TRAININGS_MODEL_NAME) private readonly trainingsModel: Model<Training>, private readonly nodeMailer: NodeMailerService) { }

    async create(createTrainingDto: CreateTrainingDto): Promise<Training> {
        const createdTraining = new this.trainingsModel(createTrainingDto)
        const msg: string = 'a new training with the name ' + createdTraining.title + ' has been posted'
        const mailerResult = await this._sendEmails(createdTraining.students, msg)
        if (mailerResult) {
            const result = await createdTraining.save()
            return result
        }
    }

    async findAll(): Promise<Training[]> {
        let trainings: Training[]
        try {
            trainings = await this.trainingsModel.find().
                populate({
                    path: 'teacher', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'students', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'sessions', select: '-__v'
                }).exec()
        } catch (error) {
            throw new NotFoundException('could not find the trainings')
        }
        return trainings
    }

    async findTrainingById(id: string): Promise<Training> {
        let training: Training
        try {
            training = await this.trainingsModel.findById(id).
                populate({
                    path: 'teacher', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'students', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'sessions', select: '-__v'
                }).exec()
        } catch (error) {
            throw new NotFoundException('could not find the training, invalid id provided')
        }

        if (!training) {
            throw new NotFoundException('could not find the training, training does not exist')
        }
        return training
    }

    async findTeacherTraining(userId: string): Promise<Training[]> {
        let trainings: Training[]
        try {
            trainings = await this.trainingsModel.find({ teacher: userId }).
                populate({
                    path: 'teacher', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'students', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'sessions', select: '-__v'
                }).exec()
        } catch (error) {
            throw new NotFoundException('could not find the training, invalid teacherId provided')
        }
        return trainings
    }

    async findStudentTraining(userId: string): Promise<Training[]> {
        let trainings: Training[]
        try {
            trainings = await this.trainingsModel.find({ students: userId }).
                populate({
                    path: 'teacher', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'students', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'sessions', select: '-__v'
                }).exec()
        } catch (error) {
            throw new NotFoundException('could not find the training, invalid studentId provided')
        }
        return trainings
    }

    async updateTraining(id: string, updateData: Training): Promise<Training> {
        let training = await this.findTrainingById(id)
        const updatedTraining = training.set(updateData)
        const msg: string = 'the training with the name ' + updatedTraining.title + ' has been updated'
        const mailerResult = await this._sendEmails(updatedTraining.students, msg)
        if (mailerResult) {
            const result = await training.save()
            return result
        }
    }

    async deleteTraining(id: string): Promise<Training> {
        let deletedTraining: Training
        try {
            deletedTraining = await this.trainingsModel.findByIdAndDelete(id)
        } catch (error) {
            throw new NotFoundException('could not find the training, invalid Id provided')
        }
        if (deletedTraining) {
            const msg: string = 'the training with the name ' + deletedTraining.title + ' has been deleted'
            const mailerResult = await this._sendEmails(deletedTraining.students, msg)
            if (mailerResult) {
                return deletedTraining
            }
        } else {
            throw new NotFoundException('could not find the training, training does not exist')
        }

    }
    
    async addSession(id: string, session: Session): Promise<Training>{
        let training = await this._getTrainingById(id)
        training.sessions.push(session.id)
        const msg: string = 'a new session with the name ' + session.title + ' has been added to the training ' + training.title
        const mailerResult = await this._sendEmails(training.students, msg)
        if (mailerResult) {
            const result = await training.save()
            return result
        }
    }

    async updateSession(id: string, session: Session): Promise<Training>{
        let training = await this._getTrainingById(id)
        const msg: string = 'the session with the name ' + session.title + ' in the training ' + training.title + ', has been updated'
        const mailerResult = await this._sendEmails(training.students, msg)
        if (mailerResult) {
            return training
        }
    }

    async deleteSession(id: string, session: Session): Promise<Training>{
        let training = await this._getTrainingById(id)
        const index = training.sessions.indexOf(session.id)
        if (index > -1) {
            training.sessions.splice(index, 1)
        }else {
            throw new NotFoundException('session does not belong to this training')
        }
        const msg: string = 'the session with the name ' + session.title + ' has been deleted from the training ' + training.title
        const mailerResult = await this._sendEmails(training.students, msg)
        if (mailerResult) {
            const result = await training.save()
            return result
        }
    }

    private async _sendEmails(usersIds: string[], msg: string) {
        await this.nodeMailer.sendEmail(usersIds, msg)
        return true
    }

    private async _getTrainingById(id: string) {
        let training: Training
        try {
            training = await this.trainingsModel.findById(id).exec()
        } catch (error) {
            throw new NotFoundException('could not find the training, invalid id provided')
        }
        if (!training) {
            throw new NotFoundException('could not find the training, training does not exist')
        }
        return training
    }

}
