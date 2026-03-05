import User from '../models/User';
import NBFC from '../models/NBFC';
import Application from '../models/Application';
import mongoose from 'mongoose';

// Custom Error Thrower
const throwError = (status: number, message: string) => {
  throw { status, message };
};

// 1. One-time setup Super Admin
export const setupSuperAdminService = async (data: any) => {
  if (process.env.ENABLE_SUPER_ADMIN_SETUP !== 'true') {
    throwError(403, 'Super Admin setup is disabled.');
  }

  const existingSuperAdmin = await User.findOne({ role: 'SUPER_ADMIN' }).lean();
  if (existingSuperAdmin) {
    throwError(400, 'Super Admin already exists. Only one is allowed.');
  }

  const { name, email, password } = data;

  if (!name || !email || !password) {
    throwError(400, 'Name, email and password are required.');
  }

  if (password.length < 8) {
    throwError(400, 'Password must be at least 8 characters long.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const superAdmin = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'SUPER_ADMIN',
    isVerified: true,
  });

  return { adminId: superAdmin._id };
};

// 2. Super Admin creates NBFC
export const createNbfcService = async (data: any, userRole?: string) => {
  if (userRole !== 'SUPER_ADMIN') {
    throwError(403, 'Access denied.');
  }

  const { name, registrationNumber } = data;

  if (!name || !registrationNumber) {
    throwError(400, 'Name and registration number are required.');
  }

  const exists = await NBFC.findOne({
    registrationNumber: registrationNumber.trim()
  }).lean();

  if (exists) {
    throwError(400, 'NBFC with this registration number already exists.');
  }

  const newNbfc = await NBFC.create({
    name: name.trim(),
    registrationNumber: registrationNumber.trim(),
  });

  return { nbfcId: newNbfc._id };
};

// 3. Create NBFC Admin
export const createNbfcAdminService = async (data: any, userRole?: string) => {
  if (userRole !== 'SUPER_ADMIN') {
    throwError(403, 'Access denied.');
  }

  const { name, email, password, nbfcId } = data;

  if (!name || !email || !password || !nbfcId) {
    throwError(400, 'All fields are required.');
  }

  if (!mongoose.Types.ObjectId.isValid(nbfcId)) {
    throwError(400, 'Invalid NBFC ID.');
  }

  if (password.length < 8) {
    throwError(400, 'Password must be at least 8 characters long.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const nbfcExists = await NBFC.findById(nbfcId).lean();
  if (!nbfcExists) {
    throwError(404, 'NBFC not found.');
  }

  const userExists = await User.findOne({ email: normalizedEmail }).lean();
  if (userExists) {
    throwError(400, 'User with this email already exists.');
  }

  const newAdmin = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'NBFC_ADMIN',
    nbfcId,
    isVerified: true,
  });

  return { adminId: newAdmin._id };
};

// 4. Fetch Global Dashboard Data for Super Admin
export const getSuperAdminDashboardDataService = async (userRole?: string) => {
  if (userRole !== 'SUPER_ADMIN') {
    throwError(403, 'Access denied.');
  }

  const totalApplications = await Application.countDocuments();
  const activeUsers = await User.countDocuments({ role: 'BORROWER' });

  const applications = await Application.find()
    .populate('borrowerId', 'name email phoneNumber')
    .populate('nbfcId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const approvedCount = applications.filter((app: any) => app.verificationStatus === 'VERIFIED').length;
  const approvalRate = totalApplications > 0 ? ((approvedCount / totalApplications) * 100).toFixed(1) : '0.0';

  const formattedApplications = applications.map((app: any) => ({
    id: `APP${app._id.toString().slice(-6).toUpperCase()}`,
    applicantName: app.borrowerId?.name || 'Unknown',
    email: app.borrowerId?.email || 'Not Provided',
    phone: app.borrowerId?.phoneNumber || 'Not Provided',
    amount: app.aiChatData?.raw?.loanAmount || 0,
    status: app.verificationStatus === 'VERIFIED' ? 'approved' : app.verificationStatus.toLowerCase(), 
    rate: 10.50, 
    appliedDate: new Date(app.createdAt).toLocaleDateString('en-IN'),
    cibil: app.aiChatData?.score || 'N/A',
    nbfcName: app.nbfcId?.name || 'Unassigned',
    documents: app.documents || null
  }));

  return {
    stats: {
      totalApplications,
      activeUsers,
      totalDisbursed: '₹0.0', 
      approvalRate: `${approvalRate}%`,
    },
    applications: formattedApplications,
  };
};

// 5. Fetch all NBFCs for Super Admin Management Table
export const getAllNbfcsService = async (userRole?: string) => {
  if (userRole !== 'SUPER_ADMIN') {
    throwError(403, 'Access denied.');
  }

  const nbfcs = await NBFC.find().sort({ createdAt: -1 }).lean();

  const formattedNbfcs = nbfcs.map((n: any) => ({
    id: n._id.toString(),
    name: n.name,
    registrationNumber: n.registrationNumber,
    status: n.isActive ? 'active' : 'suspended',
    totalLoans: 0, 
    totalDisbursed: 0, 
    region: "Pan India", 
    adminEmail: "Assigned", 
    onboardedAt: new Date(n.createdAt).toLocaleDateString('en-IN')
  }));

  return { nbfcs: formattedNbfcs };
};