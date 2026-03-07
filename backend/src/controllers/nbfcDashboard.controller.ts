
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as dashboardService from '../services/dashboard.service';


export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ message: 'NBFC ID not found in token' });
      return;
    }
    const stats = await dashboardService.getNbfcStatsService(nbfcId);
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Dashboard stats error' });
  }
};


export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ success: false, message: 'NBFC ID not found' });
      return;
    }
    const customers = await dashboardService.getNbfcCustomersService(nbfcId);
    res.status(200).json({ success: true, customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching customers' });
  }
};


export const getReportsData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ success: false, message: 'NBFC ID not found' });
      return;
    }
    const reportData = await dashboardService.getNbfcReportsService(nbfcId);
    res.status(200).json({ success: true, ...reportData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate reports' });
  }
};


export const getPendingApplicationCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ success: false, message: 'NBFC ID not found' });
      return;
    }
    const pendingCount = await dashboardService.getPendingApplicationsCountService(nbfcId);
    
    res.status(200).json({ 
      success: true, 
      pendingCount 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching pending count' });
  }
};