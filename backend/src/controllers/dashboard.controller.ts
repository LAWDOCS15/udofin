import { Request, Response } from 'express';
import DashboardService from '../services/dashboard.service';

/**
 * Controller to handle dashboard stats requests.
 * Connects the Frontend API call to the Backend Service.
 */
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await DashboardService.getStats();
    
    res.status(200).json({
      success: true,
      message: "Dashboard metrics fetched successfully",
      data
    });
  } catch (error: any) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message
    });
  }
};