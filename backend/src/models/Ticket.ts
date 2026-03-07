// models/Ticket.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  messages: Array<{
    sender: 'admin' | 'user';
    message: string;
    createdAt: Date;
  }>;
}

const TicketSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  subject: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  messages: [{
    sender: { type: String, enum: ['admin', 'user'] },
    message: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model<ITicket>('Ticket', TicketSchema);