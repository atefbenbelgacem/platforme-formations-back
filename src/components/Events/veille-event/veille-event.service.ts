import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VEILLETECHNO_MODEL_NAME } from 'src/shared/constants/constants';
import { Model } from 'mongoose';
import { VeilleEvent } from 'src/models/veille-event.schema';
import { CreateVeilleDto } from '../DTOs/createVeille.dto';
import { NodeMailerService } from 'src/shared/services/node-mailer.service';
import { UsersService } from 'src/components/users/users.service';

@Injectable()
export class VeilleEventService {
    constructor(@InjectModel(VEILLETECHNO_MODEL_NAME) private readonly veille_Model: Model<VeilleEvent>, private readonly nodeMailer: NodeMailerService, private readonly userService: UsersService) { }

    async create(createVeilleDto: CreateVeilleDto) {
        const newVeille = new this.veille_Model(createVeilleDto)
        const msg: string = 'a new veille event with the name ' + newVeille.title + ' has been posted'
        const Ids = await this._getUsersIds(newVeille.pole)
        const mailerResult = await this._sendEmails(Ids, msg)
        if (mailerResult) {
            const result = await newVeille.save()
            return result
        }
    }

    async findAll(): Promise<VeilleEvent[]> {
        const veilles = await this.veille_Model.find().
            populate({
                path: 'presenter', select: '-password -__v', populate: {
                    path: 'pole', model: 'Poles', select: '-__v'
                }
            }).populate({
                path: 'pole', select: '-__v'
            }).exec()
        return veilles
    }

    async findById(id: string): Promise<VeilleEvent> {
        let veille: VeilleEvent
        try {
            veille = await this.veille_Model.findById(id).
                populate({
                    path: 'presenter', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).populate({
                    path: 'pole', select: '-__v'
                }).exec()
        } catch (error) {
            throw new InternalServerErrorException('the id of the veille_event is invalid', error)
        }

        if (!veille) {
            throw new NotFoundException('could not find your veille_event')
        }
        return veille
    }

    async findByPoleId(poleId: string): Promise<VeilleEvent[]> {
        let veilles: VeilleEvent[]
        try {
            veilles = await this.veille_Model.find({ pole: poleId }).
                populate({
                    path: 'presenter', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).populate({
                    path: 'pole', select: '-__v'
                }).exec()
        } catch (error) {
            throw new InternalServerErrorException('the id of the veille_event is invalid', error)
        }
        return veilles
    }

    async updateVeille(id: string, updateData: VeilleEvent): Promise<VeilleEvent> {
        let veille = await this.findById(id)
        const updatedVeille = veille.set(updateData)
        const msg: string = 'The veille event with the name ' + updatedVeille.title + ' has been updated'
        const Ids = await this._getUsersIds(updatedVeille.pole)
        const mailerResult = await this._sendEmails(Ids, msg)
        if (mailerResult) {
            const result = veille.save()
            return result
        }
    }

    async deleteVeille(id: string): Promise<VeilleEvent> {
        let deletedVeille: VeilleEvent
        try {
            deletedVeille = await this.veille_Model.findByIdAndDelete(id)
        } catch (error) {
            throw new NotFoundException('could not find the event, invalid Id provided')
        }
        if (deletedVeille) {
            const msg: string = 'The veille event with the name ' + deletedVeille.title + ' has been deleted'
            const Ids = await this._getUsersIds(deletedVeille.pole)
            const mailerResult = await this._sendEmails(Ids, msg)
            if (mailerResult) {
                return deletedVeille
            }
        } else {
            throw new NotFoundException('could not find the event, veille does not exist')
        }
    }

    private async _sendEmails(usersIds: string[], msg: string) {
        await this.nodeMailer.sendEmail(usersIds, msg)
        return true
    }

    private async _getUsersIds(poleId: string) {
        let Ids: string[] = []
        const users = await this.userService.findUsersByPoleId(poleId)
        users.map(user => {
            Ids.push(user.id)
        })
        return Ids
    }

}
