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