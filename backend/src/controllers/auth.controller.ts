// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';
// import Otp from '../models/Otp';
// import { 
//   sendEmailOtp, 
//   sendPasswordResetEmail, 
//   sendRegistrationSuccessEmail, 
//   sendLoginAlertEmail,          
//   sendPasswordResetSuccessEmail 
// } from '../utils/emailService';
// import { sendSmsOtp } from '../utils/smsService';

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const setTokenCookie = (res: Response, userId: string) => {
//   const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '30m' });
//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 30 * 60 * 1000, 
//   });
// };

// // 1. Register & Send Email OTP
// // export const registerUser = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { name, email, password } = req.body;

// //     let user = await User.findOne({ email });
// //     if (user && user.isVerified) {
// //       res.status(400).json({ message: 'User already exists and is verified. Please login.' });
// //       return;
// //     }

// //     if (!user) {
// //       user = await User.create({ name, email, password });
// //     } else {
// //       user.password = password; 
// //       user.name = name;
// //       await user.save();
// //     }

// //     const otp = generateOTP();
// //     await Otp.deleteMany({ email }); 
// //     await Otp.create({ email, otp });
    
// //     await sendEmailOtp(email, otp);

// //     res.status(200).json({ message: 'Registration initiated. OTP sent to your email.' });
// //   } catch (error) {
// //     if (!res.headersSent) {
// //       res.status(500).json({ message: 'Server error', error });
// //     }
// //   }
// // };

// export const registerUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, phoneNumber, password, otpMethod } = req.body;

//     let user = await User.findOne({ email });
//     if (user && user.isVerified) {
//       res.status(400).json({ message: 'User already exists and is verified. Please login.' });
//       return;
//     }

//     if (!user) {
//       user = await User.create({ name, email, phoneNumber, password });
//     } else {
//       user.password = password; 
//       user.name = name;
//       user.phoneNumber = phoneNumber;
//       await user.save();
//     }

//     const otp = generateOTP();
//     await Otp.deleteMany({ email }); 
//     await Otp.create({ email, otp });
    
//     if (otpMethod === 'sms') {
//       await sendSmsOtp(user.phoneNumber, otp);
//     } else {
//       await sendEmailOtp(email, otp);
//     }

//     res.status(200).json({ message: `Registration initiated. OTP sent to ${otpMethod}.` });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };

// // 2. Verify OTP & Complete Registration
// export const verifyRegistration = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, otp } = req.body;   

//     const otpRecord = await Otp.findOne({ email });
//     if (!otpRecord) {
//       res.status(400).json({ message: 'OTP expired or not found.' });
//       return;
//     }

//     const isMatch = await otpRecord.compareOtp(otp);

//     if (!isMatch) {
//       res.status(400).json({ message: 'Invalid OTP' });
//       return;
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     user.isVerified = true;
//     await user.save();    
//     await Otp.deleteMany({ email });

//     setTokenCookie(res, user._id.toString());
    
//     await sendRegistrationSuccessEmail(user.email, user.name);

//     res.status(200).json({ message: 'Registration complete!', user: { id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   }
// };








// // 3. Normal Login 
// // export const loginUser = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email }).select('+password');

// //     if (!user || !(await user.comparePassword(password))) {
// //       res.status(401).json({ message: 'Invalid email or password' });
// //       return;
// //     }

// //     if (!user.isVerified) {
// //       res.status(403).json({ message: 'Please verify your email first.' });
// //       return;
// //     }

// //     // Step 1: Generate Login OTP
// //     const otp = generateOTP();
// //     await Otp.deleteMany({ email }); 
// //     await Otp.create({ email, otp });

// //     // Step 2: Send OTP via Email
// //     await sendEmailOtp(user.email, otp);

// //     // Step 3: Send OTP via SMS (COMMENTED FOR FUTURE)
// //     await sendSmsOtp(user.phoneNumber, otp); 

// //     res.status(200).json({ 
// //       message: 'Credentials verified. OTP sent to email (and phone).',
// //       requiresOtp: true, 
// //       email: user.email
// //     });

// //   } catch (error) {
// //     if (!res.headersSent) {
// //       res.status(500).json({ message: 'Server error', error });
// //     }
// //   }
// // };



// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//   try {
    
//     const { email, password, otpMethod } = req.body; 
//     const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.comparePassword(password))) {
//       res.status(401).json({ message: 'Invalid email or password' });
//       return;
//     }
//     if (!user.isVerified) {
//       res.status(403).json({ message: 'Please verify your email first.' });
//       return;
//     }

//     const otp = generateOTP();
//     await Otp.deleteMany({ email });
//     await Otp.create({ email, otp });

    
//     if (otpMethod === 'sms') {
//       await sendSmsOtp(user.phoneNumber, otp);
//     } else {
//       await sendEmailOtp(user.email, otp);
//     }

//     res.status(200).json({ 
//       message: `Credentials verified. OTP sent to ${otpMethod}.`,
//       requiresOtp: true,
//       email: user.email
//     });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };










// // 3.1 Verify Login OTP and Finalize Login
// export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, otp } = req.body;

//     const otpRecord = await Otp.findOne({ email });
//     if (!otpRecord) {
//       res.status(400).json({ message: 'OTP expired or not found.' });
//       return;
//     }

//     const isMatch = await otpRecord.compareOtp(otp);
//     if (!isMatch) {
//       res.status(400).json({ message: 'Invalid OTP' });
//       return;
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

    
//     await Otp.deleteMany({ email });

//     // Final Login: Set Token
//     setTokenCookie(res, user._id.toString());
//     await sendLoginAlertEmail(user.email, user.name);

//     res.status(200).json({ 
//       message: 'Login successful', 
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         email: user.email,
//         role: user.role 
//       } 
//     });

//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   }
// };

// // 4. Logout (Destroys Token)
// export const logoutUser = (req: Request, res: Response) => {
//   res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
//   res.status(200).json({ message: 'Logged out successfully' });
// };

// // 5. Forgot Password - Generate OTP and Send to Email
// export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(404).json({ message: 'No user found with this email address.' });
//       return;
//     }

//     const otp = generateOTP();

//     await Otp.deleteMany({ email });
//     await Otp.create({ email, otp });

//     await sendPasswordResetEmail(email, otp);

//     res.status(200).json({ message: 'Password reset OTP has been sent to your email.' });
//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Server error during forgot password', error });
//     }
//   }
// };

// // 6. Reset Password - Verify OTP and Update Password
// export const resetPassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;

//     if (!email || !otp || !newPassword || !confirmPassword) {
//       res.status(400).json({ message: 'Email, OTP, new password, and confirm password are required.' });
//       return;
//     }

//     // Add check to ensure passwords match
//     if (newPassword !== confirmPassword) {
//       res.status(400).json({ message: 'New password and confirm password do not match.' });
//       return;
//     }

//     const otpRecord = await Otp.findOne({ email });
//     if (!otpRecord) {
//       res.status(400).json({ message: 'OTP has expired or does not exist. Please request a new one.' });
//       return;
//     }

//     const isMatch = await otpRecord.compareOtp(otp);
//     if (!isMatch) {
//       res.status(400).json({ message: 'Invalid OTP. Please try again.' });
//       return;
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(404).json({ message: 'User not found.' });
//       return;
//     }

//     user.password = newPassword;
//     await user.save();

//     await Otp.deleteMany({ email });

//     await sendPasswordResetSuccessEmail(user.email);

//     res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Server error during password reset', error });
//     }
//   }
// };

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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


  //  CONSTANTS


const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

  //  UTILITIES

const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

const isStrongPassword = (password: string): boolean => {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

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

  //  REGISTER

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phoneNumber, password, otpMethod } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      res.status(400).json({ message: 'All fields required.' });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({
        message:
          'Password must be 8+ chars, include uppercase, lowercase and number.',
      });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    let user = await User.findOne({ email: normalizedEmail });

    if (user && user.isVerified) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        phoneNumber,
        password,
      });
    } else {
      user.password = password;
      user.name = name;
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    const otp = generateOTP();

    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({ email: normalizedEmail, otp });

    if (otpMethod === 'sms') {
      await sendSmsOtp(user.phoneNumber, otp);
    } else {
      await sendEmailOtp(normalizedEmail, otp);
    }

    res.status(200).json({
      message: 'Registration initiated. OTP sent.',
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  //  VERIFY REGISTRATION

export const verifyRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP required.' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    const otpRecord = await Otp.findOne({ email: normalizedEmail }).select('+otp');

    if (!otpRecord) {
      res.status(400).json({ message: 'OTP expired.' });
      return;
    }

    const isMatch = await otpRecord.compareOtp(otp);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid OTP.' });
      return;
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteMany({ email: normalizedEmail });

    await sendRegistrationSuccessEmail(user.email, user.name);

    res.status(200).json({ message: 'Registration successful.' });

  } catch (error) {
    console.error('Verify Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  //  LOGIN


export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, otpMethod } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required.' });
      return;
    }
console.log("Login body:", req.body);

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      res.status(403).json({ message: 'Account locked. Try later.' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.loginAttempts = 0;
      }

      await user.save();

      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify account.' });
      return;
    }

    const otp = generateOTP();

    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({ email: normalizedEmail, otp });
if (otpMethod === 'sms') {
  if (user.phoneNumber) {
    await sendSmsOtp(user.phoneNumber, otp);
  } else {
    console.log('\n===== OTP (No Phone Number - Console Fallback) =====');
    console.log(`Email: ${user.email}`);
    console.log(`OTP: ${otp}`);
    console.log('Valid for 60 seconds');
    console.log('=====================================\n');
  }
} else {
  await sendEmailOtp(user.email, otp);
}

    res.status(200).json({
      message: 'OTP sent successfully.',
      requiresOtp: true,
    });

  }catch (error) {
  console.error("LOGIN ERROR:", error);
  res.status(500).json({ message: "Server error" });
}
};

  //  VERIFY LOGIN OTP

export const verifyLoginOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP required.' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    const otpRecord = await Otp.findOne({ email: normalizedEmail }).select('+otp');

    if (!otpRecord) {
      res.status(400).json({ message: 'OTP expired.' });
      return;
    }

    if (Date.now() - otpRecord.createdAt.getTime() > OTP_EXPIRY_MS) {
      await Otp.deleteMany({ email: normalizedEmail });
      res.status(400).json({ message: 'OTP expired.' });
      return;
    }

    const isMatch = await otpRecord.compareOtp(otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      res.status(400).json({ message: 'Invalid OTP.' });
      return;
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    await Otp.deleteMany({ email: normalizedEmail });

    setTokenCookie(res, user._id.toString());
    await sendLoginAlertEmail(user.email, user.name);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Verify Login OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  //  LOGOUT

export const logoutUser = (
  req: Request,
  res: Response
): void => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully.' });
};

  //  RESET PASSWORD

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: 'All fields required.' });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      res.status(400).json({
        message:
          'Password must be 8+ chars, include uppercase, lowercase and number.',
      });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    const otpRecord = await Otp.findOne({ email: normalizedEmail }).select('+otp');

    if (!otpRecord) {
      res.status(400).json({ message: 'OTP expired.' });
      return;
    }

    const isMatch = await otpRecord.compareOtp(otp);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid OTP.' });
      return;
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email: normalizedEmail });

    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({
      message: 'Password reset successful.',
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔄 5. RESEND OTP (STRICT METHOD)
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otpMethod } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email required.' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const otp = generateOTP();
    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({ email: normalizedEmail, otp });


    if (otpMethod === 'sms') {
      if (user.phoneNumber) {
        await sendSmsOtp(user.phoneNumber, otp);
      } else {
        console.log('\n===== RESEND OTP (No Phone Number - Console Fallback) =====');
        console.log(`Email: ${user.email} | OTP: ${otp} | Valid for 60 seconds`);
        console.log('=====================================\n');
      }
    } else {
      await sendEmailOtp(normalizedEmail, otp);
    }

    res.status(200).json({ message: `New OTP sent successfully via ${otpMethod.toUpperCase()}.` });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔑 7. FORGOT PASSWORD (STRICT METHOD)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otpMethod } = req.body; 
    if (!email) {
      res.status(400).json({ message: 'Email required.' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(200).json({ message: 'If account exists, OTP sent.' });
      return;
    }

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

    res.status(200).json({ message: `If account exists, OTP sent via ${otpMethod ? otpMethod.toUpperCase() : 'EMAIL'}.` });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// 9. CHECK CURRENT USER SESSION (For Page Refresh)
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    // protect middleware already checks the cookie and attaches req.user
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};