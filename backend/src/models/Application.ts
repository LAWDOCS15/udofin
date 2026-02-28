// import mongoose, { Document, Schema } from 'mongoose';

// export interface IApplication extends Document {
//   borrowerId: mongoose.Types.ObjectId;
//   nbfcId: mongoose.Types.ObjectId;
//   aiChatData: any; 
//   documents: {
//     panCardUrl: string;
//     aadhaarCardUrl: string;
//     selfieUrl: string;
//   };
//   verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
// }

// const applicationSchema: Schema = new Schema(
//   {
//     borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     nbfcId: { type: mongoose.Schema.Types.ObjectId, ref: 'NBFC', required: true },
//     aiChatData: { type: Schema.Types.Mixed },
//     documents: {
//       panCardUrl: { type: String, required: true },
//       aadhaarCardUrl: { type: String, required: true },
//       selfieUrl: { type: String, required: true },
//     },
//     verificationStatus: { 
//       type: String, 
//       enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
//       default: 'PENDING' 
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IApplication>('Application', applicationSchema);





import mongoose, {
  Document,
  Schema,
  Model,
  Types,
} from 'mongoose';

/* =========================================
   ENUM (Single Source of Truth)
========================================= */

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

/* =========================================
   AI Chat Data Type (No more any)
========================================= */

export interface IAiChatData {
  score?: number;
  riskCategory?: string;
  summary?: string;
  raw?: Record<string, unknown>;
}

/* =========================================
   Application Interface
========================================= */

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
  createdAt: Date;
  updatedAt: Date;
}

/* =========================================
   Schema
========================================= */

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

    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true, // 🔐 Prevent unwanted fields
  }
);

/* =========================================
   Compound Index (Performance Boost)
========================================= */

// Faster NBFC dashboard queries
applicationSchema.index({ nbfcId: 1, createdAt: -1 });

// Faster borrower history queries
applicationSchema.index({ borrowerId: 1, createdAt: -1 });

/* =========================================
   Model Export
========================================= */

const Application: Model<IApplication> =
  mongoose.model<IApplication>('Application', applicationSchema);

export default Application;