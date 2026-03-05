// import { Response } from 'express';
// import { AuthRequest } from '../middleware/auth.middleware';
// import User from '../models/User';
// import NBFC from '../models/NBFC';
// import Application from '../models/Application';
// import mongoose from 'mongoose';

// // 1. One-time setup Super Admin
// export const setupSuperAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (process.env.ENABLE_SUPER_ADMIN_SETUP !== 'true') {
//       res.status(403).json({ message: 'Super Admin setup is disabled.' });
//       return;
//     }

//     const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' }).lean();
//     if (existingSuperAdmin) {
//       res.status(400).json({ message: 'Super Admin already exists. Only one is allowed.' });
//       return;
//     }

//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       res.status(400).json({ message: 'Name, email and password are required.' });
//       return;
//     }

//     if (password.length < 8) {
//       res.status(400).json({ message: 'Password must be at least 8 characters long.' });
//       return;
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     const superAdmin = await User.create({
//       name: name.trim(),
//       email: normalizedEmail,
//       password,
//       role: 'SUPER_ADMIN',
//       isVerified: true,
//     });

//     res.status(201).json({
//       message: 'Super Admin created successfully.',
//       adminId: superAdmin._id,
//     });

//   } catch (error) {
//     console.error('Setup Super Admin Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // 2. Super Admin creates NBFC
// export const createNbfc = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (req.user?.role !== 'SUPER_ADMIN') {
//       res.status(403).json({ message: 'Access denied.' });
//       return;
//     }

//     const { name, registrationNumber } = req.body;

//     if (!name || !registrationNumber) {
//       res.status(400).json({ message: 'Name and registration number are required.' });
//       return;
//     }

//     const exists = await NBFC.findOne({
//       registrationNumber: registrationNumber.trim()
//     }).lean();

//     if (exists) {
//       res.status(400).json({ message: 'NBFC with this registration number already exists.' });
//       return;
//     }

//     const newNbfc = await NBFC.create({
//       name: name.trim(),
//       registrationNumber: registrationNumber.trim(),
//     });

//     res.status(201).json({
//       message: 'NBFC created successfully.',
//       nbfcId: newNbfc._id,
//     });

//   } catch (error) {
//     console.error('Create NBFC Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // 3. Create NBFC Admin
// export const createNbfcAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (req.user?.role !== 'SUPER_ADMIN') {
//       res.status(403).json({ message: 'Access denied.' });
//       return;
//     }

//     const { name, email, password, nbfcId } = req.body;

//     if (!name || !email || !password || !nbfcId) {
//       res.status(400).json({ message: 'All fields are required.' });
//       return;
//     }

//     if (!mongoose.Types.ObjectId.isValid(nbfcId)) {
//       res.status(400).json({ message: 'Invalid NBFC ID.' });
//       return;
//     }

//     if (password.length < 8) {
//       res.status(400).json({ message: 'Password must be at least 8 characters long.' });
//       return;
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     const nbfcExists = await NBFC.findById(nbfcId).lean();
//     if (!nbfcExists) {
//       res.status(404).json({ message: 'NBFC not found.' });
//       return;
//     }

//     const userExists = await User.findOne({ email: normalizedEmail }).lean();
//     if (userExists) {
//       res.status(400).json({ message: 'User with this email already exists.' });
//       return;
//     }

//     const newAdmin = await User.create({
//       name: name.trim(),
//       email: normalizedEmail,
//       password,
//       role: 'NBFC_ADMIN',
//       nbfcId,
//       isVerified: true,
//     });

//     res.status(201).json({
//       message: 'NBFC Admin created successfully.',
//       adminId: newAdmin._id,
//     });

//   } catch (error) {
//     console.error('Create NBFC Admin Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// // 4. Fetch Global Dashboard Data for Super Admin
// export const getSuperAdminDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (req.user?.role !== 'SUPER_ADMIN') {
//       res.status(403).json({ message: 'Access denied.' });
//       return;
//     }

//     const totalApplications = await Application.countDocuments();
//     const activeUsers = await User.countDocuments({ role: 'BORROWER' });

//     const applications = await Application.find()
//       .populate('borrowerId', 'name email phoneNumber')
//       .populate('nbfcId', 'name')
//       .sort({ createdAt: -1 })
//       .lean();

//     const approvedCount = applications.filter((app: any) => app.verificationStatus === 'VERIFIED').length;
//     const approvalRate = totalApplications > 0 ? ((approvedCount / totalApplications) * 100).toFixed(1) : '0.0';

//     const formattedApplications = applications.map((app: any) => ({
//       id: `APP${app._id.toString().slice(-6).toUpperCase()}`,
//       applicantName: app.borrowerId?.name || 'Unknown',
//       email: app.borrowerId?.email || 'Not Provided',
//       phone: app.borrowerId?.phoneNumber || 'Not Provided',
//       amount: app.aiChatData?.raw?.loanAmount || 0,
//       status: app.verificationStatus === 'VERIFIED' ? 'approved' : app.verificationStatus.toLowerCase(), 
//       rate: 10.50, 
//       appliedDate: new Date(app.createdAt).toLocaleDateString('en-IN'),
//       cibil: app.aiChatData?.score || 'N/A',
//       nbfcName: app.nbfcId?.name || 'Unassigned',
//       documents: app.documents || null
//     }));

//     res.status(200).json({
//       stats: {
//         totalApplications,
//         activeUsers,
//         totalDisbursed: '₹0.0', 
//         approvalRate: `${approvalRate}%`,
//       },
//       applications: formattedApplications,
//     });

//   } catch (error) {
//     console.error('Super Admin Dashboard Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// // 5. Fetch all NBFCs for Super Admin Management Table
// export const getAllNbfcs = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     if (req.user?.role !== 'SUPER_ADMIN') {
//       res.status(403).json({ message: 'Access denied.' });
//       return;
//     }

//     // Fetch all NBFCs from DB
//     const nbfcs = await NBFC.find().sort({ createdAt: -1 }).lean();

//     // Format them to match the exact structure the frontend table expects
//     const formattedNbfcs = nbfcs.map((n: any) => ({
//       id: n._id.toString(),
//       name: n.name,
//       registrationNumber: n.registrationNumber,
//       status: n.isActive ? 'active' : 'suspended',
//       totalLoans: 0, // Placeholder: Can be updated later with actual aggregations
//       totalDisbursed: 0, // Placeholder
//       region: "Pan India", 
//       adminEmail: "Assigned", 
//       onboardedAt: new Date(n.createdAt).toLocaleDateString('en-IN')
//     }));

//     res.status(200).json({ nbfcs: formattedNbfcs });

//   } catch (error) {
//     console.error('Fetch NBFCs Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as adminService from '../services/admin.service';

// Helper for error handling in controller
const handleControllerError = (error: any, res: Response, logMessage: string) => {
  if (error.status) {
    res.status(error.status).json({ message: error.message });
  } else {
    console.error(`${logMessage}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 1. One-time setup Super Admin
export const setupSuperAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.setupSuperAdminService(req.body);
    res.status(201).json({
      message: 'Super Admin created successfully.',
      adminId: result.adminId,
    });
  } catch (error) {
    handleControllerError(error, res, 'Setup Super Admin Error');
  }
};

// 2. Super Admin creates NBFC
export const createNbfc = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.createNbfcService(req.body, req.user?.role);
    res.status(201).json({
      message: 'NBFC created successfully.',
      nbfcId: result.nbfcId,
    });
  } catch (error) {
    handleControllerError(error, res, 'Create NBFC Error');
  }
};

// 3. Create NBFC Admin
export const createNbfcAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.createNbfcAdminService(req.body, req.user?.role);
    res.status(201).json({
      message: 'NBFC Admin created successfully.',
      adminId: result.adminId,
    });
  } catch (error) {
    handleControllerError(error, res, 'Create NBFC Admin Error');
  }
};

// 4. Fetch Global Dashboard Data for Super Admin
export const getSuperAdminDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.getSuperAdminDashboardDataService(req.user?.role);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Super Admin Dashboard Error');
  }
};

// 5. Fetch all NBFCs for Super Admin Management Table
export const getAllNbfcs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await adminService.getAllNbfcsService(req.user?.role);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Fetch NBFCs Error');
  }
};