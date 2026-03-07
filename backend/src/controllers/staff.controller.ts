import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as staffService from '../services/staff.service';


export const getStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ success: false, message: 'NBFC ID missing' });
      return;
    }
   
    const staff = await staffService.getAllStaffService(nbfcId.toString());
    res.status(200).json({ success: true, staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ success: false, message: 'NBFC ID missing' });
      return;
    }
    const newStaff = await staffService.addStaffService(nbfcId.toString(), req.body);
    res.status(201).json({ success: true, staff: newStaff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: 'Staff ID is required' });
      return;
    }

    await staffService.deleteStaffService(id as string);
    
    res.status(200).json({ success: true, message: 'Staff deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};