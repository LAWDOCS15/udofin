import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  nbfcId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: 'relationship-manager' | 'underwriter' | 'collection-agent' | 'operations';
  status: 'active' | 'inactive';
  assignedCustomers: number;
  joinedAt: Date;
}

const StaffSchema: Schema = new Schema({
  nbfcId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['relationship-manager', 'underwriter', 'collection-agent', 'operations'],
    default: 'relationship-manager' 
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedCustomers: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IStaff>('Staff', StaffSchema);