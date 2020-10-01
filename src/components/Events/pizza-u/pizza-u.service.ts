import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PIZZAU_MODEL_NAME } from 'src/shared/constants/constants';
import { Model } from 'mongoose';
import { PizzaUEvent } from 'src/models/pizza-u.schema';
import { CreatePizzaUDto } from '../DTOs/createPizzaU.dto';
import { NodeMailerService } from 'src/shared/services/node-mailer.service';

@Injectable()
export class PizzaUService {

    constructor(@InjectModel(PIZZAU_MODEL_NAME) private readonly pizzaU_Model: Model<PizzaUEvent>, private readonly nodeMailer: NodeMailerService) { }

    async create(createPizzaDto: CreatePizzaUDto) {
        const newPizza = new this.pizzaU_Model(createPizzaDto)
        const result = await newPizza.save()
        return result
    }

    async findAll(): Promise<PizzaUEvent[]> {
        const pizzas = await this.pizzaU_Model.find().
            populate({
                path: 'presenter', select: '-password -__v', populate: {
                    path: 'pole', model: 'Poles', select: '-__v'
                }
            }).
            populate({
                path: 'subscribers', select: '-password -__v', populate: {
                    path: 'pole', model: 'Poles', select: '-__v'
                }
            }).
            populate({
                path: 'waitingList', select: '-password -__v', populate: {
                    path: 'pole', model: 'Poles', select: '-__v'
                }
            }).exec()
        return pizzas
    }

    async findPizzaUById(id: string): Promise<PizzaUEvent> {
        let pizza: PizzaUEvent
        try {
            pizza = await this.pizzaU_Model.findById(id).
                populate({
                    path: 'presenter', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'subscribers', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).
                populate({
                    path: 'waitingList', select: '-password -__v', populate: {
                        path: 'pole', model: 'Poles', select: '-__v'
                    }
                }).exec()
        } catch (error) {
            throw new InternalServerErrorException('the id of the pizza is invalid', error)
        }

        if (!pizza) {
            throw new NotFoundException('could not find your pizza')
        }
        return pizza
    }

    async subscribe(pizzaId: string, userId: string) {
        const pizza = await this.getPizzaById(pizzaId)
        if (pizza.placesLeft <= 0) {
            await this.waitingListSubscription(pizza, userId)
        } else {
            const msg = 'you have been subscribed to the pizzaU event with the name ' + pizza.title
            const mailerResult = await this._sendEmails([userId], msg)
            if (mailerResult) {
                try {
                    pizza.placesLeft -= 1
                    pizza.subscribers.push(userId)
                    await pizza.save()
                } catch (error) {
                    throw new InternalServerErrorException('could not save this subscription', error)
                }
                return true
            }
        }

    }

    async unSubscribe(pizzaId: string, userId: string) {
        const pizza = await this.getPizzaById(pizzaId)
        const msg = 'you have been unsubscribed from the pizzaU event with the name ' + pizza.title
        if (pizza.waitingList.length == 0) {

            const index = pizza.subscribers.indexOf(userId)
            if (index > -1) {
                const mailerResult = await this._sendEmails([userId], msg)
                if (mailerResult) {
                    try {
                        pizza.placesLeft += 1
                        pizza.subscribers.splice(index, 1)
                        await pizza.save()
                    } catch (error) {
                        throw new InternalServerErrorException('could not unSubscribe this user', error)
                    }
                    return true
                }
            }
            return false
        }

        const index = pizza.subscribers.indexOf(userId)
        if (index > -1) {
            const mailerResult = await this._sendEmails([userId], msg)
            if (mailerResult) {
                try {
                    const userToAdd = pizza.waitingList.shift()
                    pizza.subscribers.splice(index, 1, userToAdd)
                    await pizza.save()
                } catch (error) {
                    throw new InternalServerErrorException('could not unSubscribe this user', error)
                }
                return true
            }
        } else {
            await this.waitingListUnsubscription(pizza, userId)
        }
    }

    private async waitingListUnsubscription(pizza: PizzaUEvent, userId: string) {
        const index = pizza.waitingList.indexOf(userId)
        if (index > -1) {
            const msg = 'you have been removed from the waitingList of the pizzaU event with the name ' + pizza.title
            const mailerResult = await this._sendEmails([userId], msg)
            if (mailerResult) {
                try {
                    pizza.waitingList.splice(index, 1)
                    await pizza.save()
                } catch (error) {
                    throw new InternalServerErrorException('could not remove you from the waiting lis', error)
                }
                return true
            }
        }
        return false
    }


    private async waitingListSubscription(pizza: PizzaUEvent, userId: string) {
        const msg = 'you have been added to the waitingList of the pizzaU event with the name ' + pizza.title
        const mailerResult = await this._sendEmails([userId], msg)
        if (mailerResult) {
            try {
                pizza.waitingList.push(userId)
                await pizza.save()
            } catch (error) {
                throw new InternalServerErrorException('could not add you to the waiting lis', error)
            }
            return true
        }
    }

    async updatePizza(id: string, updateData: PizzaUEvent): Promise<PizzaUEvent> {
        let pizza = await this.findPizzaUById(id)
        const updatedPizza = pizza.set(updateData)
        const msg: string = 'the pizzaU event with the name ' + updatedPizza.title + ' has been updated'
        const collabs = updatedPizza.subscribers.concat(updatedPizza.waitingList)
        if (collabs.length > 0) {
            const mailerResult = await this._sendEmails(collabs, msg)
            if (mailerResult) {
                const result = pizza.save()
                return result
            }
        } else {
            const result = pizza.save()
            return result
        }

    }

    async deletePizza(id: string): Promise<PizzaUEvent> {
        let deletedPizza: PizzaUEvent
        try {
            deletedPizza = await this.pizzaU_Model.findByIdAndDelete(id)
        } catch (error) {
            throw new NotFoundException('could not find the event, invalid Id provided')
        }
        if (deletedPizza) {
            const msg: string = 'the pizzaU event with the name ' + deletedPizza.title + ' has been deleted'
            const collabs = deletedPizza.subscribers.concat(deletedPizza.waitingList)
            if (collabs.length > 0) {
                const mailerResult = await this._sendEmails(collabs, msg)
                if (mailerResult) {
                    return deletedPizza
                }
            } else {
                return deletedPizza
            }

        } else {
            throw new NotFoundException('could not find the event, pizza does not exist')
        }
    }


    private async getPizzaById(id: string) {
        let pizza: PizzaUEvent
        try {
            pizza = await this.pizzaU_Model.findById(id).exec()
        } catch (error) {
            throw new InternalServerErrorException('the id of the pizza is invalid', error)
        }

        if (!pizza) {
            throw new NotFoundException('could not find your pizza')
        }
        return pizza
    }

    private async _sendEmails(usersIds: string[], msg: string) {
        await this.nodeMailer.sendEmail(usersIds, msg)
        return true
    }
}
