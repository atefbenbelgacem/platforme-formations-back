import * as mongoose from 'mongoose';
import {
  SESSIONS_MODEL_NAME,
  USERS_MODEL_NAME,
} from '../shared/constants/constants';

export const TrainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: USERS_MODEL_NAME },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: USERS_MODEL_NAME }],
    sessions: [
      { type: mongoose.Schema.Types.ObjectId, ref: SESSIONS_MODEL_NAME },
    ],
  },
  { discriminatorKey: 'type' },
);

export interface Training extends mongoose.Document {
  id: string;
  title: string;
  subject: string;
  teacher: any;
  students: any[];
  sessions: any[];
}
