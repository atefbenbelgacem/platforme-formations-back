import { Module } from '@nestjs/common';
import { TrainingService } from './services/training.service';
import { TrainingController } from './training.controller';
import { SessionService } from './services/session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSchema } from 'src/models/training.schema';
import { UsersModule } from 'src/components/users/users.module';
import { TRAININGS_MODEL_NAME, SESSIONS_MODEL_NAME } from 'src/shared/constants/constants';
import { NodeMailerService } from 'src/shared/services/node-mailer.service';
import { SessionSchema } from 'src/models/session.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: TRAININGS_MODEL_NAME, schema: TrainingSchema }]),
    MongooseModule.forFeature([{ name: SESSIONS_MODEL_NAME, schema: SessionSchema }])
  ],
  providers: [TrainingService, SessionService, NodeMailerService],
  controllers: [TrainingController],
  exports: [
    MongooseModule.forFeature([{ name: TRAININGS_MODEL_NAME, schema: TrainingSchema }]),
    MongooseModule.forFeature([{ name: SESSIONS_MODEL_NAME, schema: SessionSchema }]),
    SessionService
  ]
})
export class TrainingModule { }
