import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Otp from '../models/Otp';
import { 
  sendEmailOtp, 
  sendPasswordResetEmail, 
  sendRegistrationSuccessEmail, 
  sendLoginAlertEmail,          
  sendPasswordResetSuccessEmail 
} from '../utils/emailService';
import { sendSmsOtp } from '../utils/smsService';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const setTokenCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '30m' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000, 
  });
};

// 1. Register & Send Email OTP
// export const registerUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password } = req.body;

//     let user = await User.findOne({ email });
//     if (user && user.isVerified) {
//       res.status(400).json({ message: 'User already exists and is verified. Please login.' });
//       return;
//     }

//     if (!user) {
//       user = await User.create({ name, email, password });
//     } else {
//       user.password = password; 
//       user.name = name;
//       await user.save();
//     }

//     const otp = generateOTP();
//     await Otp.deleteMany({ email }); 
//     await Otp.create({ email, otp });
    
//     await sendEmailOtp(email, otp);

//     res.status(200).json({ message: 'Registration initiated. OTP sent to your email.' });
//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   }
// };

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phoneNumber, password, otpMethod } = req.body;

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      res.status(400).json({ message: 'User already exists and is verified. Please login.' });
      return;
    }

    if (!user) {
      user = await User.create({ name, email, phoneNumber, password });
    } else {
      user.password = password; 
      user.name = name;
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    const otp = generateOTP();
    await Otp.deleteMany({ email }); 
    await Otp.create({ email, otp });
    
    if (otpMethod === 'sms') {
      await sendSmsOtp(user.phoneNumber, otp);
    } else {
      await sendEmailOtp(email, otp);
    }

    res.status(200).json({ message: `Registration initiated. OTP sent to ${otpMethod}.` });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};

// 2. Verify OTP & Complete Registration
export const verifyRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;   

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      res.status(400).json({ message: 'OTP expired or not found.' });
      return;
    }

    const isMatch = await otpRecord.compareOtp(otp);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.isVerified = true;
    await user.save();    
    await Otp.deleteMany({ email });

    setTokenCookie(res, user._id.toString());
    
    await sendRegistrationSuccessEmail(user.email, user.name);

    res.status(200).json({ message: 'Registration complete!', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
};








// 3. Normal Login 
// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.comparePassword(password))) {
//       res.status(401).json({ message: 'Invalid email or password' });
//       return;
//     }

//     if (!user.isVerified) {
//       res.status(403).json({ message: 'Please verify your email first.' });
//       return;
//     }

//     // Step 1: Generate Login OTP
//     const otp = generateOTP();
//     await Otp.deleteMany({ email }); 
//     await Otp.create({ email, otp });

//     // Step 2: Send OTP via Email
//     await sendEmailOtp(user.email, otp);

//     // Step 3: Send OTP via SMS (COMMENTED FOR FUTURE)
//     await sendSmsOtp(user.phoneNumber, otp); 

//     res.status(200).json({ 
//       message: 'Credentials verified. OTP sent to email (and phone).',
//       requiresOtp: true, 
//       email: user.email
//     });

//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   }
// };



export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const { email, password, otpMethod } = req.body; 
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your email first.' });
      return;
    }

    const otp = generateOTP();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    
    if (otpMethod === 'sms') {
      await sendSmsOtp(user.phoneNumber, otp);
    } else {
      await sendEmailOtp(user.email, otp);
    }

    res.status(200).json({ 
      message: `Credentials verified. OTP sent to ${otpMethod}.`,
      requiresOtp: true,
      email: user.email
    });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};










// 3.1 Verify Login OTP and Finalize Login
export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      res.status(400).json({ message: 'OTP expired or not found.' });
      return;
    }

    const isMatch = await otpRecord.compareOtp(otp);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    
    await Otp.deleteMany({ email });

    // Final Login: Set Token
    setTokenCookie(res, user._id.toString());
    await sendLoginAlertEmail(user.email, user.name);

    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role 
      } 
    });

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
};

// 4. Logout (Destroys Token)
export const logoutUser = (req: Request, res: Response) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

// 5. Forgot Password - Generate OTP and Send to Email
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'No user found with this email address.' });
      return;
    }

    const otp = generateOTP();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    await sendPasswordResetEmail(email, otp);

    res.status(200).json({ message: 'Password reset OTP has been sent to your email.' });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error during forgot password', error });
    }
  }
};

// 6. Reset Password - Verify OTP and Update Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      res.status(400).json({ message: 'Email, OTP, new password, and confirm password are required.' });
      return;
    }

    // Add check to ensure passwords match
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: 'New password and confirm password do not match.' });
      return;
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      res.status(400).json({ message: 'OTP has expired or does not exist. Please request a new one.' });
      return;
    }

    const isMatch = await otpRecord.compareOtp(otp);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid OTP. Please try again.' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email });

    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error during password reset', error });
    }
  }
};