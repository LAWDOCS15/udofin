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

const OTP_EXPIRY_SECONDS = 60; // ✅ changed to 60 seconds
const SALT_ROUNDS = 12;

/* ============================= */
/*   Schema                      */
/* ============================= */

const otpSchema = new Schema<
  IOtp,
  Model<IOtp, {}, IOtpMethods>,
  IOtpMethods
>(
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
      expires: OTP_EXPIRY_SECONDS, // ✅ Mongo TTL 60 sec
    },
  },
  { timestamps: false }
);

/* ============================= */
/*   Pre Save Hook               */
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

const OtpModel = mongoose.model<
  IOtp,
  Model<IOtp, {}, IOtpMethods>
>('Otp', otpSchema);

export default OtpModel;