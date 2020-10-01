import { Module } from '@nestjs/common';
import { QuizzResultService } from './quizz-result.service';
import { QuizzResultController } from './quizz-result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QUIZZRESULT_MODEL_NAME } from 'src/shared/constants/constants';
import { QuizzResultSchema } from 'src/models/quizzResult.schema';
import { TrainingModule } from '../training/training.module';

@Module({
  imports: [
    TrainingModule,
    MongooseModule.forFeature([{ name: QUIZZRESULT_MODEL_NAME, schema: QuizzResultSchema }])
  ],
  providers: [QuizzResultService],
  controllers: [QuizzResultController],
  exports: [
    MongooseModule.forFeature([{ name: QUIZZRESULT_MODEL_NAME, schema: QuizzResultSchema }]),
    QuizzResultService
  ]
})
export class QuizzResultModule {}
