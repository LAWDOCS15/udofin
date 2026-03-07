import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminRole: string;
  nbfcId?: mongoose.Types.ObjectId | null;
  action: string;
  details: any;
  ip: string;
}

const AuditLogSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminRole: { type: String, enum: ['NBFC_ADMIN', 'SUPER_ADMIN'], required: true },
  nbfcId: { type: Schema.Types.ObjectId, ref: 'NBFC', default: null }, // Mapped to your NBFC model
  action: { type: String, required: true },
  details: Schema.Types.Mixed,
  ip: String
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);