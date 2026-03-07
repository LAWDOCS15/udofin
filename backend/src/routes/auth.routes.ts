import { Router, Request, Response } from 'express';
import {
  registerUser,
  verifyRegistration,
  loginUser,
  verifyLoginOtp,
  logoutUser,
  forgotPassword,
  resetPassword,
  resendOtp,
  getMe
} from '../controllers/auth.controller';

import { protect } from '../middleware/auth.middleware';

const router: Router = Router();

    // Public Auth Routes

router.post('/register', registerUser);

router.post('/verify-email', verifyRegistration);

router.post('/login', loginUser);

router.post('/verify-login-otp', verifyLoginOtp);


router.post('/resend-otp', resendOtp);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);


    // Protected Routes

// Logout should be protected
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

// Example protected dashboard route
router.get('/dashboard', protect, (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the secure dashboard!'
  });
});

export default router;