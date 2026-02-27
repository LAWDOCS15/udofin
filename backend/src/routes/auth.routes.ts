import express from 'express';
import { 
  registerUser, 
  verifyRegistration, 
  loginUser, 
  logoutUser,
  forgotPassword,    
  resetPassword      
} from '../controllers/auth.controller';
import { verifyLoginOtp } from '../controllers/auth.controller';


import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

//  Auth Routes
router.post('/register', registerUser);
router.post('/verify-email', verifyRegistration);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// login verify otp route
router.post('/verify-login-otp', verifyLoginOtp);


// Protected route 
router.get('/dashboard', protect, (req: AuthRequest, res) => {
  res.json({ message: 'Welcome to the secure dashboard!', user: req.user });
});

export default router;