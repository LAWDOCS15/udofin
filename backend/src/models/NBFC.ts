import mongoose, { Document, Schema } from 'mongoose';

export interface INBFC extends Document {
  name: string;
  registrationNumber: string;
  isActive: boolean;
}

const nbfcSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<INBFC>('NBFC', nbfcSchema);