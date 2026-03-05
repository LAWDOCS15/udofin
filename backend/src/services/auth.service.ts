import { Document } from 'mongoose';
import User from '../models/User';
import Otp from '../models/Otp';
import {
  sendEmailOtp,
  sendPasswordResetEmail,
  sendRegistrationSuccessEmail,
  sendLoginAlertEmail,
  sendPasswordResetSuccessEmail,
} from '../utils/emailService';
import { sendSmsOtp } from '../utils/smsService';

// ── UTILITIES ──
const throwError = (status: number, message: string): never => {
  throw { status, message };
};

const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();
const normalizeEmail = (email: string): string => email.trim().toLowerCase();
const isStrongPassword = (password: string): boolean => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

// ── SERVICES ──

export const registerUserService = async (data: any) => {
  const { name, email, phoneNumber, password, otpMethod } = data;
  if (!name || !email || !phoneNumber || !password) throwError(400, 'All fields required.');
  if (!isStrongPassword(password)) throwError(400, 'Password must be 8+ chars, include uppercase, lowercase and number.');

  const normalizedEmail = normalizeEmail(email);
  let user: any = await User.findOne({ email: normalizedEmail });

  if (user && user.isVerified) throwError(400, 'User already exists.');

  if (!user) {
    user = await User.create({ name, email: normalizedEmail, phoneNumber, password });
  } else {
    user.password = password;
    user.name = name;
    user.phoneNumber = phoneNumber;
    await user.save();
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({ email: normalizedEmail, otp });

  if (otpMethod === 'sms' && user.phoneNumber) {
    await sendSmsOtp(user.phoneNumber, otp);
  } else {
    await sendEmailOtp(normalizedEmail, otp);
  }

  return { message: 'Registration initiated. OTP sent.' };
};

export const verifyRegistrationService = async (data: any) => {
  const { email, otp } = data;
  if (!email || !otp) throwError(400, 'Email and OTP required.');

  const normalizedEmail = normalizeEmail(email);
  const otpRecord: any = await Otp.findOne({ email: normalizedEmail }).select('+otp');

  if (!otpRecord) throwError(400, 'OTP expired.');
  const isMatch = await otpRecord.compareOtp(otp);
  if (!isMatch) throwError(400, 'Invalid OTP.');

  const user: any = await User.findOne({ email: normalizedEmail });
  if (!user) throwError(404, 'User not found.');

  user.isVerified = true;
  await user.save();
  await Otp.deleteMany({ email: normalizedEmail });
  await sendRegistrationSuccessEmail(user.email, user.name);

  return { message: 'Registration successful.' };
};

export const loginUserService = async (data: any) => {
  const { email, password, otpMethod } = data;
  if (!email || !password) throwError(400, 'Email and password required.');

  const normalizedEmail = normalizeEmail(email);
  const user: any = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) throwError(401, 'Invalid credentials.');
  if (user.lockUntil && user.lockUntil > new Date()) throwError(403, 'Account locked. Try later.');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      user.loginAttempts = 0;
    }
    await user.save();
    throwError(401, 'Invalid credentials.');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  if (!user.isVerified) throwError(403, 'Please verify account.');

  const otp = generateOTP();
  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({ email: normalizedEmail, otp });

  if (otpMethod === 'sms') {
    if (user.phoneNumber) {
      await sendSmsOtp(user.phoneNumber, otp);
    } else {
      console.log('\n===== OTP (No Phone Number - Console Fallback) =====');
      console.log(`Email: ${user.email} | OTP: ${otp}`);
      console.log('=====================================\n');
    }
  } else {
    await sendEmailOtp(user.email, otp);
  }

  return { message: 'OTP sent successfully.', requiresOtp: true };
};

export const verifyLoginOtpService = async (data: any) => {
  const { email, otp } = data;
  if (!email || !otp) throwError(400, 'Email and OTP required.');

  const normalizedEmail = normalizeEmail(email);
  const otpRecord: any = await Otp.findOne({ email: normalizedEmail }).select('+otp');

  if (!otpRecord) throwError(400, 'OTP expired.');
  if (Date.now() - otpRecord.createdAt.getTime() > OTP_EXPIRY_MS) {
    await Otp.deleteMany({ email: normalizedEmail });
    throwError(400, 'OTP expired.');
  }

  const isMatch = await otpRecord.compareOtp(otp);
  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throwError(400, 'Invalid OTP.');
  }

  const user: any = await User.findOne({ email: normalizedEmail });
  if (!user) throwError(404, 'User not found.');

  await Otp.deleteMany({ email: normalizedEmail });
  await sendLoginAlertEmail(user.email, user.name);

  return {
    message: 'Login successful',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const resetPasswordService = async (data: any) => {
  const { email, otp, newPassword } = data;
  if (!email || !otp || !newPassword) throwError(400, 'All fields required.');
  if (!isStrongPassword(newPassword)) throwError(400, 'Password must be 8+ chars.');

  const normalizedEmail = normalizeEmail(email);
  const otpRecord: any = await Otp.findOne({ email: normalizedEmail }).select('+otp');

  if (!otpRecord) throwError(400, 'OTP expired.');
  const isMatch = await otpRecord.compareOtp(otp);
  if (!isMatch) throwError(400, 'Invalid OTP.');

  const user: any = await User.findOne({ email: normalizedEmail });
  if (!user) throwError(404, 'User not found.');

  user.password = newPassword;
  await user.save();
  await Otp.deleteMany({ email: normalizedEmail });
  await sendPasswordResetSuccessEmail(user.email);

  return { message: 'Password reset successful.' };
};

export const resendOtpService = async (data: any) => {
  const { email, otpMethod } = data;
  if (!email) throwError(400, 'Email required.');

  const normalizedEmail = normalizeEmail(email);
  const user: any = await User.findOne({ email: normalizedEmail });

  if (!user) throwError(404, 'User not found.');

  const otp = generateOTP();
  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({ email: normalizedEmail, otp });

  if (otpMethod === 'sms') {
    if (user.phoneNumber) {
      await sendSmsOtp(user.phoneNumber, otp);
    } else {
      console.log('\n===== RESEND OTP (No Phone Number - Console Fallback) =====');
      console.log(`Email: ${user.email} | OTP: ${otp}`);
      console.log('=====================================\n');
    }
  } else {
    await sendEmailOtp(normalizedEmail, otp);
  }

  // ✅ FIX: Safely handling otpMethod for TypeScript
  const methodStr = otpMethod ? String(otpMethod).toUpperCase() : 'EMAIL';
  return { message: `New OTP sent successfully via ${methodStr}.` };
};

export const forgotPasswordService = async (data: any) => {
  const { email, otpMethod } = data;
  if (!email) throwError(400, 'Email required.');

  const normalizedEmail = normalizeEmail(email);
  const user: any = await User.findOne({ email: normalizedEmail });

  const methodStr = otpMethod ? String(otpMethod).toUpperCase() : 'EMAIL';

  if (!user) return { message: `If account exists, OTP sent via ${methodStr}.` };

  const otp = generateOTP();
  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({ email: normalizedEmail, otp });

  if (otpMethod === 'sms') {
    if (user.phoneNumber) {
      await sendSmsOtp(user.phoneNumber, otp);
    } else {
      console.log('\n===== FORGOT PWD OTP (No Phone Number) =====');
      console.log(`Email: ${user.email} | OTP: ${otp}`);
      console.log('=====================================\n');
    }
  } else {
    await sendPasswordResetEmail(normalizedEmail, otp);
  }

  return { message: `If account exists, OTP sent via ${methodStr}.` };
};