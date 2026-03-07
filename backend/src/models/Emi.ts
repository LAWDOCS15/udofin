import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEmi extends Document {
  loanId: Types.ObjectId;
  nbfcId: Types.ObjectId;
  borrowerId: Types.ObjectId;
  applicationId: Types.ObjectId; 
  emiNumber: number;
  amount: number;
  dueDate: Date;
  status: 'upcoming' | 'paid' | 'overdue' | 'pending';
  paidDate?: Date;
  paymentDetails?: Record<string, any>;
}

const emiSchema = new Schema<IEmi>({
  loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true, index: true },
  nbfcId: { type: Schema.Types.ObjectId, ref: 'NBFC', required: true, index: true },
  borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true }, // ✅ Added
  emiNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true, index: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'paid', 'overdue', 'pending'], 
    default: 'upcoming' 
  },
  paidDate: { type: Date },
  paymentDetails: { type: Schema.Types.Mixed }
}, { timestamps: true });

emiSchema.index({ nbfcId: 1, status: 1, dueDate: 1 });

export default mongoose.model<IEmi>('Emi', emiSchema);