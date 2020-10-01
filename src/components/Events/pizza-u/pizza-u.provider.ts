import { Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PIZZAU_MODEL_NAME, EVENT_MODEL_NAME } from 'src/shared/constants/constants';
import { PizzaUEventSchema } from 'src/models/pizza-u.schema';

export const pizzaUProviders: Provider[] = [
    {
        provide: getModelToken(PIZZAU_MODEL_NAME),
        useFactory: (eventModel) => eventModel.discriminator(PIZZAU_MODEL_NAME, PizzaUEventSchema),
        inject: [getModelToken(EVENT_MODEL_NAME)]
    }
];