import mongoose, {
  Document,
  Schema,
  Model,
  Types,
} from 'mongoose';




export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED', 
}


export interface IAiChatData {
  score?: number;
  riskCategory?: string;
  requestedAmount?: number;
  summary?: string;
  raw?: Record<string, unknown>;
}


export interface IApplication extends Document {
  borrowerId: Types.ObjectId;
  nbfcId: Types.ObjectId;
  aiChatData: IAiChatData;
  documents: {
    panCardUrl: string;
    aadhaarCardUrl: string;
    selfieUrl: string;
  };
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


const applicationSchema = new Schema<IApplication>(
  {
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    nbfcId: {
      type: Schema.Types.ObjectId,
      ref: 'NBFC',
      required: true,
      index: true,
    },

    aiChatData: {
      type: Schema.Types.Mixed,
      default: {},
    },

    documents: {
      panCardUrl: {
        type: String,
        required: true,
        trim: true,
      },
      aadhaarCardUrl: {
        type: String,
        required: true,
        trim: true,
      },
      selfieUrl: {
        type: String,
        required: true,
        trim: true,
      },
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true, 
  }
);


applicationSchema.index({ nbfcId: 1, createdAt: -1 });

applicationSchema.index({ borrowerId: 1, createdAt: -1 });


const Application: Model<IApplication> =
  mongoose.model<IApplication>('Application', applicationSchema);

export default Application;