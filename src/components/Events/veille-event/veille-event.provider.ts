import { Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { EVENT_MODEL_NAME, VEILLETECHNO_MODEL_NAME } from 'src/shared/constants/constants';
import { VeilleEventSchema } from 'src/models/veille-event.schema';

export const VeilleProviders: Provider[] = [
    {
        provide: getModelToken(VEILLETECHNO_MODEL_NAME),
        useFactory: (eventModel) => eventModel.discriminator(VEILLETECHNO_MODEL_NAME, VeilleEventSchema),
        inject: [getModelToken(EVENT_MODEL_NAME)]
    }
];