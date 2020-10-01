import * as mongoose from 'mongoose';
import { QUESTIONS_MODEL_NAME } from '../shared/constants/constants';

export const SessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    duration: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
    },
    documents: [
      {
        link: { type: String, required: true },
        docTitle: { type: String, required: true },
      },
    ],
    quizz: [
      { type: mongoose.Schema.Types.ObjectId, ref: QUESTIONS_MODEL_NAME },
    ],
  },
  { timestamps: true },
);

export interface Session extends mongoose.Document {
  id: string;
  title: string;
  date: Date;
  duration: sessionDuration;
  documents: Document[];
  quizz: any[];
}

export interface sessionDuration {
  hours: number;
  minutes: number;
}

export interface Document {
  link: string;
  docTitle: string;
}
