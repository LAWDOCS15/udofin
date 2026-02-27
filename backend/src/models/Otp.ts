import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  compareOtp(enteredOtp: string): Promise<boolean>;
}

const OtpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 60 
  }
});

OtpSchema.pre<IOtp>('save', async function () {
  if (!this.isModified('otp') || !this.otp) {
    return; 
  }
  
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});


OtpSchema.methods.compareOtp = async function (enteredOtp: string) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

export default mongoose.model<IOtp>('Otp', OtpSchema);