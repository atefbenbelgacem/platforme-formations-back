import * as mongoose from 'mongoose';
import { POLES_MODEL_NAME } from '../shared/constants/constants';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pole: { type: mongoose.Schema.Types.ObjectId, ref: POLES_MODEL_NAME },
    roleName: { type: String, required: true },
  },
  { timestamps: true },
);

export interface User extends mongoose.Document {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  pole: any;
  roleName: string;
}
