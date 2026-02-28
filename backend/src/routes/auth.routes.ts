// import express from 'express';
// import { 
//   registerUser, 
//   verifyRegistration, 
//   loginUser, 
//   logoutUser,
//   forgotPassword,    
//   resetPassword      
// } from '../controllers/auth.controller';
// import { verifyLoginOtp } from '../controllers/auth.controller';


// import { protect, AuthRequest } from '../middleware/auth.middleware';

// const router = express.Router();

// //  Auth Routes
// router.post('/register', registerUser);
// router.post('/verify-email', verifyRegistration);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);

// // Password Reset Routes
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// // login verify otp route
// router.post('/verify-login-otp', verifyLoginOtp);


// // Protected route 
// router.get('/dashboard', protect, (req: AuthRequest, res) => {
//   res.json({ message: 'Welcome to the secure dashboard!', user: req.user });
// });

// export default router;

import { Router, Request, Response } from 'express';
import {
  registerUser,
  verifyRegistration,
  loginUser,
  verifyLoginOtp,
  logoutUser,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';

import { protect } from '../middleware/auth.middleware';

const router: Router = Router();

/* =========================
   🔓 Public Auth Routes
========================= */

router.post('/register', registerUser);

router.post('/verify-email', verifyRegistration);

router.post('/login', loginUser);

router.post('/verify-login-otp', verifyLoginOtp);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);


/* =========================
   🔐 Protected Routes
========================= */

// Logout should be protected
router.post('/logout', protect, logoutUser);

// Example protected dashboard route
router.get('/dashboard', protect, (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the secure dashboard!'
  });
});

export default router;