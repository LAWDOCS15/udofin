import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILoan extends Document {
  borrowerId: Types.ObjectId;
  nbfcId: Types.ObjectId;
  applicationId: Types.ObjectId; 
  amount: number;
  interestRate: number;
  tenure: number;
  status: string;
}

const loanSchema = new Schema<ILoan>({
  borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nbfcId: { type: Schema.Types.ObjectId, ref: 'NBFC', required: true },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true }, 
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true },
  status: { type: String, default: 'DISBURSED' }
}, { timestamps: true });

export default mongoose.model<ILoan>('Loan', loanSchema);