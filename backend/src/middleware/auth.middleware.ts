

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';

// export interface AuthRequest extends Request { user?: any; }

// export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
//   const token = req.cookies.token;
//   if (!token) {
//     res.status(401).json({ message: 'Not authorized. Please log in.' });
//     return;
//   }

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Session expired. Please log in again.' });
//   }
// };

// // New function to check specific roles
// export const authorizeRoles = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction): void => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       res.status(403).json({ message: `Access denied. Requires one of these roles: ${roles.join(', ')}` });
//       return;
//     }
//     next();
//   };
// };

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

// 🔐 Strong JWT Payload

interface TokenPayload extends JwtPayload {
  id: string;
}

//  Strongly Typed Request

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'BORROWER' | 'NBFC_ADMIN' | 'SUPER_ADMIN';
    nbfcId: string | null;
  };
}

// Protect Middleware

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: 'Not authorized. Please log in.' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      res.status(500).json({ message: 'Server configuration error.' });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as TokenPayload;

    if (!decoded?.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      res.status(401).json({ message: 'Invalid token.' });
      return;
    }

    const user = await User.findById(decoded.id)
      .select('-password')
      .lean<IUser>();

    if (!user) {
      res.status(401).json({ message: 'User no longer exists.' });
      return;
    }

    // Attach safe & strictly typed user object
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      nbfcId: user.nbfcId ? user.nbfcId.toString() : null,
    };

    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({
      message: 'Session expired. Please log in again.',
    });
  }
};


//  Role Authorization Middleware

export const authorizeRoles = (
  ...roles: Array<'BORROWER' | 'NBFC_ADMIN' | 'SUPER_ADMIN'>
) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {

    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Access denied.',
      });
      return;
    }

    next();
  };
};