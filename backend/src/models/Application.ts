import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  borrowerId: mongoose.Types.ObjectId;
  nbfcId: mongoose.Types.ObjectId;
  aiChatData: any; 
  documents: {
    panCardUrl: string;
    aadhaarCardUrl: string;
    selfieUrl: string;
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const applicationSchema: Schema = new Schema(
  {
    borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nbfcId: { type: mongoose.Schema.Types.ObjectId, ref: 'NBFC', required: true },
    aiChatData: { type: Schema.Types.Mixed },
    documents: {
      panCardUrl: { type: String, required: true },
      aadhaarCardUrl: { type: String, required: true },
      selfieUrl: { type: String, required: true },
    },
    verificationStatus: { 
      type: String, 
      enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
      default: 'PENDING' 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', applicationSchema);