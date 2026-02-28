// import mongoose, { Document, Schema } from 'mongoose';

// export interface INBFC extends Document {
//   name: string;
//   registrationNumber: string;
//   isActive: boolean;
// }

// const nbfcSchema: Schema = new Schema(
//   {
//     name: { type: String, required: true },
//     registrationNumber: { type: String, required: true, unique: true },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<INBFC>('NBFC', nbfcSchema);





import mongoose, {
  Document,
  Schema,
  Model,
} from 'mongoose';

/* =========================================
   Interface
========================================= */

export interface INBFC extends Document {
  name: string;
  registrationNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* =========================================
   Schema
========================================= */

const nbfcSchema = new Schema<INBFC>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 50,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

/* =========================================
   INDEXES (Defined ONLY Here)
========================================= */

// Unique registration number (case-safe because uppercase:true)
nbfcSchema.index({ registrationNumber: 1 }, { unique: true });

// Fast filtering by active status
nbfcSchema.index({ isActive: 1 });

// Fast admin queries (active + recent)
nbfcSchema.index({ isActive: 1, createdAt: -1 });

/* =========================================
   Model Export
========================================= */

const NBFC: Model<INBFC> =
  mongoose.model<INBFC>('NBFC', nbfcSchema);

export default NBFC;