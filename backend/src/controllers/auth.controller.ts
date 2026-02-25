import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Otp from '../models/Otp';
import { sendEmailOtp } from '../utils/emailService';
import { sendPasswordResetEmail } from '../utils/emailService';

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
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      res.status(400).json({ message: 'User already exists and is verified. Please login.' });
      return;
    }

    if (!user) {
      user = await User.create({ name, email, password });
    } else {
      user.password = password; 
      user.name = name;
      await user.save();
    }

    const otp = generateOTP();
    await Otp.deleteMany({ email }); 
    await Otp.create({ email, otp });
    
    await sendEmailOtp(email, otp);

    res.status(200).json({ message: 'Registration initiated. OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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

    // Set 30-min session
setTokenCookie(res, user._id.toString());

    res.status(200).json({ message: 'Registration complete!', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// 3. Normal Login 
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your email first.' });
      return;
    }

    setTokenCookie(res, user._id.toString());
    
    res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'No user found with this email address.' });
      return;
    }

    // Generate a new 6-digit OTP
    const otp = generateOTP();

    // Delete any existing OTPs for this email to prevent conflicts
    await Otp.deleteMany({ email });

    // Save the new OTP to the database (it will hash automatically via the model hook and expire in 5 mins)
    await Otp.create({ email, otp });

    // Send the password reset email
    await sendPasswordResetEmail(email, otp);

    res.status(200).json({ message: 'Password reset OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during forgot password', error });
  }
};

// 6. Reset Password - Verify OTP and Update Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: 'Email, OTP, and new password are required.' });
      return;
    }

    // Find the OTP record in the database
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      res.status(400).json({ message: 'OTP has expired or does not exist. Please request a new one.' });
      return;
    }

    // Compare the entered OTP with the hashed OTP in the database
    const isMatch = await otpRecord.compareOtp(otp);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid OTP. Please try again.' });
      return;
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Update the user's password
    // (The Mongoose pre('save') hook in User.ts will automatically hash this new password before saving)
    user.password = newPassword;
    await user.save();

    // Delete the OTP record so it cannot be reused
    await Otp.deleteMany({ email });

    res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during password reset', error });
  }
};