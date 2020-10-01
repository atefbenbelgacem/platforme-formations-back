import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EVENT_MODEL_NAME } from 'src/shared/constants/constants';
import { Model } from 'mongoose';
import { BaseEvent } from 'src/models/baseEvent.schema';

@Injectable()
export class EventService {

    constructor(@InjectModel(EVENT_MODEL_NAME) private readonly eventModel: Model<BaseEvent>) { }


    async findAll() {
        const events = await this.eventModel.find().
            populate({
                path: 'presenter', select: '-password -__v', populate: {
                    path: 'pole', model: 'Poles', select: '-__v'
                }
            }).exec()
        return events
    }

    async findEventById(id: string) {
        const event = await this.findEvent(id)
        return event
    }

    private async findEvent(id: string) {
        let event: any
        try {
            event = await this.eventModel.findById(id).
                populate({
                    path: 'presenter', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).exec()
        } catch (error) {
            throw new InternalServerErrorException('the id of the event is invalid', error)
        }

        if (!event) {
            throw new NotFoundException('could not find your event')
        }
        return event
    }
}
