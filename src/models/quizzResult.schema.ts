import * as mongoose from 'mongoose';
import {
  SESSIONS_MODEL_NAME,
  USERS_MODEL_NAME,
} from 'src/shared/constants/constants';

export const QuizzResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: USERS_MODEL_NAME },
    session: { type: mongoose.Schema.Types.ObjectId, ref: SESSIONS_MODEL_NAME },
    quizzAnswers: [
      {
        question: { type: String, required: true },
        answers: { type: [String], required: true },
      },
    ],
    score: { type: Number },
  },
  { timestamps: true },
);

export interface QuizzResult extends mongoose.Document {
  id: string;
  user: any;
  session: any;
  quizzAnswers: quizzAnswer[];
  score: number;
}

export interface quizzAnswer {
  question: string;
  answers: string[];
}
