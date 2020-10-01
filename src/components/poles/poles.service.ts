import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pole } from '../../models/pole.schema';
import { CreatePoleDto } from './createPole.dto';

@Injectable()
export class PolesService {

    constructor(@InjectModel('Poles') private readonly polesModel: Model<Pole>) { }

    async create(createPoleDto: CreatePoleDto): Promise<Pole> {
        const createdPole = new this.polesModel(createPoleDto);
        const result = await createdPole.save()
        return result
    }

    async findAll(): Promise<Pole[]> {
        const poles = await this.polesModel.find().exec()
        return poles
    }

    async findSinglePole(poleId: string): Promise<Pole> {
        const pole = await this.findPole(poleId)
        return pole
    }

    async updatePole(id: string, updateData: Pole): Promise<Pole> {
        let pole = await this.findPole(id)
        const newPole = pole.set(updateData)
        const result = await pole.save()
        return result
    }

    async deletePole(id: string): Promise<Pole> {
        let pole = await this.findPole(id)
        const newPole = await this.polesModel.findByIdAndDelete(pole.id).exec()
        return newPole
    }


    private async findPole(id: string): Promise<Pole> {
        let pole: Pole
        try {
            pole = await this.polesModel.findById(id).exec()
        } catch (error) {
            throw new NotFoundException('could not find your pole')
        }

        if (!pole) {
            throw new NotFoundException('could not find your pole')
        }
        return pole
    }
}
