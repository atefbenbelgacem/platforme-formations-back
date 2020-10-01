import * as mongoose from 'mongoose';

export const PoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export interface Pole extends mongoose.Document {
  id: string;
  name: string;
}
