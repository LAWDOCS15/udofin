// import { Response } from 'express';
// import { AuthRequest } from '../middleware/auth.middleware';
// import User from '../models/User';
// import NBFC from '../models/NBFC';

// // 1. One-time setup to create the ONLY Super Admin
// export const setupSuperAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
//     if (existingSuperAdmin) {
//       res.status(400).json({ message: 'Super Admin already exists. Only one is allowed.' });
//       return;
//     }

//     const { name, email, password } = req.body;
    
//     const superAdmin = await User.create({
//       name,
//       email,
//       password,
//       role: 'SUPER_ADMIN',
//       isVerified: true 
//     });

//     res.status(201).json({ message: 'Super Admin created successfully.', adminId: superAdmin._id });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };

// // 2. Super Admin creates a new NBFC Company
// export const createNbfc = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { name, registrationNumber } = req.body;

//     const exists = await NBFC.findOne({ registrationNumber });
//     if (exists) {
//       res.status(400).json({ message: 'NBFC with this registration number already exists.' });
//       return;
//     }

//     const newNbfc = await NBFC.create({ name, registrationNumber });
//     res.status(201).json({ message: 'NBFC created successfully.', nbfc: newNbfc });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };

// // 3. Super Admin creates an Admin user for a specific NBFC
// export const createNbfcAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { name, email, password, nbfcId } = req.body;

//     const nbfcExists = await NBFC.findById(nbfcId);
//     if (!nbfcExists) {
//       res.status(404).json({ message: 'NBFC not found.' });
//       return;
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.status(400).json({ message: 'User with this email already exists.' });
//       return;
//     }

//     const newAdmin = await User.create({
//       name,
//       email,
//       password,
//       role: 'NBFC_ADMIN',
//       nbfcId,
//       isVerified: true 
//     });

//     res.status(201).json({ message: 'NBFC Admin created successfully.', admin: newAdmin });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };


import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import NBFC from '../models/NBFC';
import mongoose from 'mongoose';


// 1. One-time setup Super Admin

export const setupSuperAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 🔐 Optional: Protect with environment secret (recommended)
    if (process.env.ENABLE_SUPER_ADMIN_SETUP !== 'true') {
      res.status(403).json({ message: 'Super Admin setup is disabled.' });
      return;
    }

    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' }).lean();
    if (existingSuperAdmin) {
      res.status(400).json({ message: 'Super Admin already exists. Only one is allowed.' });
      return;
    }

    const { name, email, password } = req.body;

    // ✅ Basic Validation
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const superAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'SUPER_ADMIN',
      isVerified: true,
    });

    res.status(201).json({
      message: 'Super Admin created successfully.',
      adminId: superAdmin._id,
    });

  } catch (error) {
    console.error('Setup Super Admin Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// 2. Super Admin creates NBFC
export const createNbfc = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
  
    if (req.user?.role !== 'SUPER_ADMIN') {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }

    const { name, registrationNumber } = req.body;

    if (!name || !registrationNumber) {
      res.status(400).json({ message: 'Name and registration number are required.' });
      return;
    }

    const exists = await NBFC.findOne({
      registrationNumber: registrationNumber.trim()
    }).lean();

    if (exists) {
      res.status(400).json({ message: 'NBFC with this registration number already exists.' });
      return;
    }

    const newNbfc = await NBFC.create({
      name: name.trim(),
      registrationNumber: registrationNumber.trim(),
    });

    res.status(201).json({
      message: 'NBFC created successfully.',
      nbfcId: newNbfc._id,
    });

  } catch (error) {
    console.error('Create NBFC Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// 3. Create NBFC Admin (Secure Version)

export const createNbfcAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    //  Strict Role Check
    if (req.user?.role !== 'SUPER_ADMIN') {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }

    const { name, email, password, nbfcId } = req.body;

    //  Validate Required Fields
    if (!name || !email || !password || !nbfcId) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(nbfcId)) {
      res.status(400).json({ message: 'Invalid NBFC ID.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const nbfcExists = await NBFC.findById(nbfcId).lean();
    if (!nbfcExists) {
      res.status(404).json({ message: 'NBFC not found.' });
      return;
    }

    const userExists = await User.findOne({ email: normalizedEmail }).lean();
    if (userExists) {
      res.status(400).json({ message: 'User with this email already exists.' });
      return;
    }

    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'NBFC_ADMIN',
      nbfcId,
      isVerified: true,
    });

    res.status(201).json({
      message: 'NBFC Admin created successfully.',
      adminId: newAdmin._id,
    });

  } catch (error) {
    console.error('Create NBFC Admin Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

