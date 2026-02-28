// import mongoose, { Document, Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   phoneNumber: string; 
//   password?: string;
//   isVerified: boolean;
//   role: 'BORROWER' | 'NBFC_ADMIN' | 'SUPER_ADMIN';
//   nbfcId?: mongoose.Types.ObjectId; 
//   comparePassword(enteredPassword: string): Promise<boolean>;
// }

// const userSchema: Schema = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phoneNumber: { type: String, required: true, unique: true },
//     password: { type: String, select: false },
//     isVerified: { type: Boolean, default: false },
//     role: { 
//       type: String, 
//       enum: ['BORROWER', 'NBFC_ADMIN', 'SUPER_ADMIN'], 
//       default: 'BORROWER' 
//     },
//     nbfcId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: 'NBFC',
//       default: null 
//     }
//   },
//   { timestamps: true }
// );

// userSchema.pre<IUser>('save', async function () {
//   if (!this.isModified('password') || !this.password) {
//     return;
//   }
  
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
//   if (!this.password) return false;
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model<IUser>('User', userSchema);



import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  isVerified: boolean;
  role: 'BORROWER' | 'NBFC_ADMIN' | 'SUPER_ADMIN';
  nbfcId?: mongoose.Types.ObjectId | null;

  loginAttempts: number;
  lockUntil?: Date;

  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  phoneNumber: {
  type: String,
   unique: true,
   required:false,
   trim: true,
},

    password: {
      type: String,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ['BORROWER', 'NBFC_ADMIN', 'SUPER_ADMIN'],
      default: 'BORROWER',
    },

    nbfcId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NBFC',
      default: null,
    },

    // 🔐 Brute-force protection
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔐 Hash password
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password') || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 Compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);