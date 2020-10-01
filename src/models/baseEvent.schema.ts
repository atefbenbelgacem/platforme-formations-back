import * as mongoose from 'mongoose';
import { USERS_MODEL_NAME } from '../shared/constants/constants';
import { User } from './user.schema';

export const baseEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    presenter: { type: mongoose.Schema.Types.ObjectId, ref: USERS_MODEL_NAME },
    duration: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
    },
  },
  { timestamps: true, discriminatorKey: 'type' },
);

export interface BaseEvent extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  date: Date;
  presenter: any;
  duration: eventDuration;
}

export interface eventDuration {
    hours: number
    minutes: number
}
