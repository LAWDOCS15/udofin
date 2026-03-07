
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as emiService from '../services/emi.service';

export const getUpcomingEmis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    const emis = await emiService.getEmisByNbfc(nbfcId as string, 'upcoming');
    res.status(200).json(emis);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch upcoming EMIs' });
  }
};

export const markEmiAsPaid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { emiId, paymentMethod, transactionId } = req.body;
    const result = await emiService.updateEmiStatus(emiId, 'paid', { paymentMethod, transactionId });
    
    res.status(200).json({ message: 'EMI marked as paid', result });
  } catch (error: any) {
    res.status(500).json({ message: 'Payment update failed' });
  }
};

export const getEmiTrackerData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    if (!nbfcId) {
      res.status(403).json({ message: 'NBFC ID not found' });
      return;
    }
    const emis = await emiService.getTrackerEmisService(nbfcId as string);
    res.status(200).json({ success: true, emis });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch EMI Tracker data' });
  }
};