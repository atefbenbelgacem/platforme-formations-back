import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema } from 'src/models/question.schema';
import { QUESTIONS_MODEL_NAME } from 'src/shared/constants/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QUESTIONS_MODEL_NAME, schema: QuestionSchema }])
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [
    MongooseModule.forFeature([{ name: QUESTIONS_MODEL_NAME, schema: QuestionSchema }]),
    QuestionsService
  ]
})
export class QuestionsModule {}
