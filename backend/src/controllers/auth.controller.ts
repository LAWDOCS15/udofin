// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';
// import Otp from '../models/Otp';
// import {
//   sendEmailOtp,
//   sendPasswordResetEmail,
//   sendRegistrationSuccessEmail,
//   sendLoginAlertEmail,
//   sendPasswordResetSuccessEmail,
// } from '../utils/emailService';
// import { sendSmsOtp } from '../utils/smsService';


//   //  CONSTANTS


// const OTP_EXPIRY_MS = 5 * 60 * 1000;
// const MAX_LOGIN_ATTEMPTS = 5;
// const LOCK_TIME_MS = 15 * 60 * 1000;

//   //  UTILITIES

// const generateOTP = (): string =>
//   Math.floor(100000 + Math.random() * 900000).toString();

// const normalizeEmail = (email: string): string =>
//   email.trim().toLowerCase();

// const isStrongPassword = (password: string): boolean => {
//   const strongRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
//   return strongRegex.test(password);
// };

// const setTokenCookie = (res: Response, userId: string): void => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error('JWT_SECRET not configured');
//   }

//   const token = jwt.sign(
//     { id: userId },
//     process.env.JWT_SECRET,
//     { expiresIn: '30m' }
//   );

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', 
//     maxAge: 30 * 60 * 1000,
//     path: '/',
//   });
// };

//   //  REGISTER

// export const registerUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { name, email, phoneNumber, password, otpMethod } = req.body;

//     if (!name || !email || !phoneNumber || !password) {
//       res.status(400).json({ message: 'All fields required.' });
//       return;
//     }

//     if (!isStrongPassword(password)) {
//       res.status(400).json({
//         message:
//           'Password must be 8+ chars, include uppercase, lowercase and number.',
//       });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);

//     let user = await User.findOne({ email: normalizedEmail });

//     if (user && user.isVerified) {
//       res.status(400).json({ message: 'User already exists.' });
//       return;
//     }

//     if (!user) {
//       user = await User.create({
//         name,
//         email: normalizedEmail,
//         phoneNumber,
//         password,
//       });
//     } else {
//       user.password = password;
//       user.name = name;
//       user.phoneNumber = phoneNumber;
//       await user.save();
//     }

//     const otp = generateOTP();

//     await Otp.deleteMany({ email: normalizedEmail });
//     await Otp.create({ email: normalizedEmail, otp });

//     if (otpMethod === 'sms') {
//       await sendSmsOtp(user.phoneNumber, otp);
//     } else {
//       await sendEmailOtp(normalizedEmail, otp);
//     }

//     res.status(200).json({
//       message: 'Registration initiated. OTP sent.',
//     });

//   } catch (error) {
//     console.error('Register Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

//   //  VERIFY REGISTRATION

// export const verifyRegistration = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       res.status(400).json({ message: 'Email and OTP required.' });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);

//     const otpRecord = await Otp.findOne({ email: normalizedEmail }).select('+otp');

//     if (!otpRecord) {
//       res.status(400).json({ message: 'OTP expired.' });
//       return;
//     }

//     const isMatch = await otpRecord.compareOtp(otp);

//     if (!isMatch) {
//       res.status(400).json({ message: 'Invalid OTP.' });
//       return;
//     }

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       res.status(404).json({ message: 'User not found.' });
//       return;
//     }

//     user.isVerified = true;
//     await user.save();

//     await Otp.deleteMany({ email: normalizedEmail });

//     await sendRegistrationSuccessEmail(user.email, user.name);

//     res.status(200).json({ message: 'Registration successful.' });

//   } catch (error) {
//     console.error('Verify Registration Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

//   //  LOGIN


// export const loginUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { email, password, otpMethod } = req.body;

//     if (!email || !password) {
//       res.status(400).json({ message: 'Email and password required.' });
//       return;
//     }
// console.log("Login body:", req.body);

//     const normalizedEmail = normalizeEmail(email);

//     const user = await User.findOne({ email: normalizedEmail }).select('+password');

//     if (!user) {
//       res.status(401).json({ message: 'Invalid credentials.' });
//       return;
//     }

//     if (user.lockUntil && user.lockUntil > new Date()) {
//       res.status(403).json({ message: 'Account locked. Try later.' });
//       return;
//     }

//     const isPasswordValid = await user.comparePassword(password);

//     if (!isPasswordValid) {
//       user.loginAttempts += 1;

//       if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
//         user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
//         user.loginAttempts = 0;
//       }

//       await user.save();

//       res.status(401).json({ message: 'Invalid credentials.' });
//       return;
//     }

//     user.loginAttempts = 0;
//     user.lockUntil = undefined;
//     await user.save();

//     if (!user.isVerified) {
//       res.status(403).json({ message: 'Please verify account.' });
//       return;
//     }

//     const otp = generateOTP();

//     await Otp.deleteMany({ email: normalizedEmail });
//     await Otp.create({ email: normalizedEmail, otp });
// if (otpMethod === 'sms') {
//   if (user.phoneNumber) {
//     await sendSmsOtp(user.phoneNumber, otp);
//   } else {
//     console.log('\n===== OTP (No Phone Number - Console Fallback) =====');
//     console.log(`Email: ${user.email}`);
//     console.log(`OTP: ${otp}`);
//     console.log('Valid for 60 seconds');
//     console.log('=====================================\n');
//   }
// } else {
//   await sendEmailOtp(user.email, otp);
// }

//     res.status(200).json({
//       message: 'OTP sent successfully.',
//       requiresOtp: true,
//     });

//   }catch (error) {
//   console.error("LOGIN ERROR:", error);
//   res.status(500).json({ message: "Server error" });
// }
// };

//   //  VERIFY LOGIN OTP

// export const verifyLoginOtp = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       res.status(400).json({ message: 'Email and OTP required.' });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);

//     const otpRecord = await Otp.findOne({ email: normalizedEmail }).select('+otp');

//     if (!otpRecord) {
//       res.status(400).json({ message: 'OTP expired.' });
//       return;
//     }

//     if (Date.now() - otpRecord.createdAt.getTime() > OTP_EXPIRY_MS) {
//       await Otp.deleteMany({ email: normalizedEmail });
//       res.status(400).json({ message: 'OTP expired.' });
//       return;
//     }

//     const isMatch = await otpRecord.compareOtp(otp);

//     if (!isMatch) {
//       otpRecord.attempts += 1;
//       await otpRecord.save();
//       res.status(400).json({ message: 'Invalid OTP.' });
//       return;
//     }

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       res.status(404).json({ message: 'User not found.' });
//       return;
//     }

//     await Otp.deleteMany({ email: normalizedEmail });

//     setTokenCookie(res, user._id.toString());
//     await sendLoginAlertEmail(user.email, user.name);

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error('Verify Login OTP Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

//   //  LOGOUT

// export const logoutUser = (
//   req: Request,
//   res: Response
// ): void => {
//   res.cookie('token', '', {
//     httpOnly: true,
//     expires: new Date(0),
//     path: '/',
//   });

//   res.status(200).json({ message: 'Logged out successfully.' });
// };

//   //  RESET PASSWORD

// export const resetPassword = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     if (!email || !otp || !newPassword) {
//       res.status(400).json({ message: 'All fields required.' });
//       return;
//     }

//     if (!isStrongPassword(newPassword)) {
//       res.status(400).json({
//         message:
//           'Password must be 8+ chars, include uppercase, lowercase and number.',
//       });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);

//     const otpRecord = await Otp.findOne({ email: normalizedEmail }).select('+otp');

//     if (!otpRecord) {
//       res.status(400).json({ message: 'OTP expired.' });
//       return;
//     }

//     const isMatch = await otpRecord.compareOtp(otp);

//     if (!isMatch) {
//       res.status(400).json({ message: 'Invalid OTP.' });
//       return;
//     }

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       res.status(404).json({ message: 'User not found.' });
//       return;
//     }

//     user.password = newPassword;
//     await user.save();

//     await Otp.deleteMany({ email: normalizedEmail });

//     await sendPasswordResetSuccessEmail(user.email);

//     res.status(200).json({
//       message: 'Password reset successful.',
//     });

//   } catch (error) {
//     console.error('Reset Password Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // 🔄 5. RESEND OTP (STRICT METHOD)
// export const resendOtp = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, otpMethod } = req.body;

//     if (!email) {
//       res.status(400).json({ message: 'Email required.' });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);
//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       res.status(404).json({ message: 'User not found.' });
//       return;
//     }

//     const otp = generateOTP();
//     await Otp.deleteMany({ email: normalizedEmail });
//     await Otp.create({ email: normalizedEmail, otp });


//     if (otpMethod === 'sms') {
//       if (user.phoneNumber) {
//         await sendSmsOtp(user.phoneNumber, otp);
//       } else {
//         console.log('\n===== RESEND OTP (No Phone Number - Console Fallback) =====');
//         console.log(`Email: ${user.email} | OTP: ${otp} | Valid for 60 seconds`);
//         console.log('=====================================\n');
//       }
//     } else {
//       await sendEmailOtp(normalizedEmail, otp);
//     }

//     res.status(200).json({ message: `New OTP sent successfully via ${otpMethod.toUpperCase()}.` });
//   } catch (error) {
//     console.error('Resend OTP Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // 🔑 7. FORGOT PASSWORD (STRICT METHOD)
// export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, otpMethod } = req.body; 
//     if (!email) {
//       res.status(400).json({ message: 'Email required.' });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);
//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       res.status(200).json({ message: 'If account exists, OTP sent.' });
//       return;
//     }

//     const otp = generateOTP();
//     await Otp.deleteMany({ email: normalizedEmail });
//     await Otp.create({ email: normalizedEmail, otp });

//     if (otpMethod === 'sms') {
//       if (user.phoneNumber) {
//         await sendSmsOtp(user.phoneNumber, otp);
//       } else {
//         console.log('\n===== FORGOT PWD OTP (No Phone Number) =====');
//         console.log(`Email: ${user.email} | OTP: ${otp}`);
//         console.log('=====================================\n');
//       }
//     } else {
//       await sendPasswordResetEmail(normalizedEmail, otp);
//     }

//     res.status(200).json({ message: `If account exists, OTP sent via ${otpMethod ? otpMethod.toUpperCase() : 'EMAIL'}.` });
//   } catch (error) {
//     console.error('Forgot Password Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
// // 9. CHECK CURRENT USER SESSION (For Page Refresh)
// export const getMe = async (req: any, res: Response): Promise<void> => {
//   try {
//     // protect middleware already checks the cookie and attaches req.user
//     if (!req.user) {
//       res.status(401).json({ message: 'Not authenticated' });
//       return;
//     }
    
//     res.status(200).json({
//       user: req.user
//     });
//   } catch (error) {
//     console.error('Get Me Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.service';

// ── UTILITIES ──

const setTokenCookie = (res: Response, userId: string): void => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 30 * 60 * 1000,
    path: '/',
  });
};

const handleControllerError = (error: any, res: Response, logMessage: string) => {
  if (error.status) {
    res.status(error.status).json({ message: error.message });
  } else {
    console.error(`${logMessage}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ── CONTROLLERS ──

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.registerUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Register Error');
  }
};

export const verifyRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.verifyRegistrationService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Verify Registration Error');
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Login body:", req.body);
    const result = await authService.loginUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'LOGIN ERROR');
  }
};

export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.verifyLoginOtpService(req.body);
    
    // Set cookie after successful OTP verification
    setTokenCookie(res, result.user.id.toString());
    
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Verify Login OTP Error');
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully.' });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.resetPasswordService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Reset Password Error');
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.resendOtpService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Resend OTP Error');
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.forgotPasswordService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Forgot Password Error');
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    res.status(200).json({ user: req.user });
  } catch (error) {
    handleControllerError(error, res, 'Get Me Error');
  }
};