import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import NBFC from '../models/NBFC';

// 1. One-time setup to create the ONLY Super Admin
export const setupSuperAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (existingSuperAdmin) {
      res.status(400).json({ message: 'Super Admin already exists. Only one is allowed.' });
      return;
    }

    const { name, email, password } = req.body;
    
    const superAdmin = await User.create({
      name,
      email,
      password,
      role: 'SUPER_ADMIN',
      isVerified: true 
    });

    res.status(201).json({ message: 'Super Admin created successfully.', adminId: superAdmin._id });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};

// 2. Super Admin creates a new NBFC Company
export const createNbfc = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, registrationNumber } = req.body;

    const exists = await NBFC.findOne({ registrationNumber });
    if (exists) {
      res.status(400).json({ message: 'NBFC with this registration number already exists.' });
      return;
    }

    const newNbfc = await NBFC.create({ name, registrationNumber });
    res.status(201).json({ message: 'NBFC created successfully.', nbfc: newNbfc });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};

// 3. Super Admin creates an Admin user for a specific NBFC
export const createNbfcAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, nbfcId } = req.body;

    const nbfcExists = await NBFC.findById(nbfcId);
    if (!nbfcExists) {
      res.status(404).json({ message: 'NBFC not found.' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User with this email already exists.' });
      return;
    }

    const newAdmin = await User.create({
      name,
      email,
      password,
      role: 'NBFC_ADMIN',
      nbfcId,
      isVerified: true 
    });

    res.status(201).json({ message: 'NBFC Admin created successfully.', admin: newAdmin });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};