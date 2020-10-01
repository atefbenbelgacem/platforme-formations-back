import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EVENT_MODEL_NAME } from 'src/shared/constants/constants';
import { baseEventSchema } from 'src/models/baseEvent.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: EVENT_MODEL_NAME, schema: baseEventSchema }])
    ],
    exports: [
        MongooseModule.forFeature([{ name: EVENT_MODEL_NAME, schema: baseEventSchema }])
    ],
    providers: [EventService],
    controllers: [EventController]
})
export class EventModule { }
