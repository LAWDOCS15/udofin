// import mongoose, { Document, Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';

// export interface IOtp extends Document {
//   email: string;
//   otp: string;
//   createdAt: Date;
//   compareOtp(enteredOtp: string): Promise<boolean>;
// }

// const OtpSchema: Schema = new Schema({
//   email: { type: String, required: true },
//   otp: { type: String, required: true },
//   createdAt: { 
//     type: Date, 
//     default: Date.now, 
//     expires: 60 
//   }
// });

// OtpSchema.pre<IOtp>('save', async function () {
//   if (!this.isModified('otp') || !this.otp) {
//     return; 
//   }
  
//   const salt = await bcrypt.genSalt(10);
//   this.otp = await bcrypt.hash(this.otp, salt);
// });


// OtpSchema.methods.compareOtp = async function (enteredOtp: string) {
//   return await bcrypt.compare(enteredOtp, this.otp);
// };

// export default mongoose.model<IOtp>('Otp', OtpSchema);
import mongoose, {
  Schema,
  Model,
  HydratedDocument
} from 'mongoose';
import bcrypt from 'bcryptjs';

/* ============================= */
/*   Types                       */
/* ============================= */

export interface IOtp {
  email: string;
  otp: string;
  attempts: number;
  createdAt: Date;
}

export interface IOtpMethods {
  compareOtp(enteredOtp: string): Promise<boolean>;
}

type OtpDocument = HydratedDocument<IOtp, IOtpMethods>;

/* ============================= */
/*   Constants                   */
/* ============================= */

const OTP_EXPIRY_SECONDS = 300;
const SALT_ROUNDS = 12;

/* ============================= */
/*   Schema                      */
/* ============================= */

const otpSchema = new Schema<IOtp, Model<IOtp, {}, IOtpMethods>, IOtpMethods>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
      select: false,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: OTP_EXPIRY_SECONDS,
    },
  },
  { timestamps: false }
);

/* ============================= */
/*   Pre Save Hook (NO next)     */
/* ============================= */

otpSchema.pre('save', async function () {
  const doc = this as OtpDocument;

  if (!doc.isModified('otp')) return;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  doc.otp = await bcrypt.hash(doc.otp, salt);
});

/* ============================= */
/*   Instance Method             */
/* ============================= */

otpSchema.method(
  'compareOtp',
  async function (this: OtpDocument, enteredOtp: string) {
    return bcrypt.compare(enteredOtp, this.otp);
  }
);

/* ============================= */
/*   Model Export                */
/* ============================= */

const OtpModel = mongoose.model<IOtp, Model<IOtp, {}, IOtpMethods>>(
  'Otp',
  otpSchema
);

export default OtpModel;