import * as mongoose from 'mongoose';
import { POLES_MODEL_NAME } from '../shared/constants/constants';
import { BaseEvent } from './baseEvent.schema';

export const VeilleEventSchema = new mongoose.Schema(
  {
    pole: { type: mongoose.Schema.Types.ObjectId, ref: POLES_MODEL_NAME },
  },
  { discriminatorKey: 'type' },
);

export interface VeilleEvent extends BaseEvent {
  pole: any;
}
