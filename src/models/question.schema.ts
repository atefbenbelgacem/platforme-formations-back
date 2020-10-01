import * as mongoose from 'mongoose';

export const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctAnswers: [{ type: String, required: true }],
  },
  { timestamps: true },
);

export interface Question extends mongoose.Document {
  id: string;
  question: string;
  choices: string[];
  correctAnswers: string[];
}
