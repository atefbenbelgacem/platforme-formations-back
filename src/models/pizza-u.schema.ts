import * as mongoose from 'mongoose';
import { USERS_MODEL_NAME } from '../shared/constants/constants';
import { BaseEvent } from './baseEvent.schema';

export const PizzaUEventSchema = new mongoose.Schema(
  {
    placesLeft: { type: Number, required: true },
    subscribers: [
      { type: mongoose.Schema.Types.ObjectId, ref: USERS_MODEL_NAME },
    ],
    waitingList: [
      { type: mongoose.Schema.Types.ObjectId, ref: USERS_MODEL_NAME },
    ],
  },
  { discriminatorKey: 'type' },
);

export interface PizzaUEvent extends BaseEvent {
    placesLeft: number;
    subscribers: any[]
    waitingList: any[]
}
