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
//     res.status(401).json({ message: 'Session expired (30 minutes passed). Please log in again.' });
//   }
// };




import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request { user?: any; }

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: 'Not authorized. Please log in.' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

// New function to check specific roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: `Access denied. Requires one of these roles: ${roles.join(', ')}` });
      return;
    }
    next();
  };
};