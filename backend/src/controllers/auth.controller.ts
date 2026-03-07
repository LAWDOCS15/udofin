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