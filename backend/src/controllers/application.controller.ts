import NBFC from '../models/NBFC';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Application from '../models/Application';

// 1. Borrower submits application with documents
export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const borrowerId = req.user.id;
    const { nbfcId, aiChatData } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!nbfcId || !files || !files.panCard || !files.aadhaarCard || !files.selfie) {
      res.status(400).json({ message: 'All required documents and NBFC ID must be provided.' });
      return;
    }

    const newApplication = await Application.create({
      borrowerId,
      nbfcId,
      aiChatData: aiChatData ? JSON.parse(aiChatData) : {},
      documents: {
        panCardUrl: files.panCard[0].path,
        aadhaarCardUrl: files.aadhaarCard[0].path,
        selfieUrl: files.selfie[0].path,
      },
      verificationStatus: 'PENDING'
    });

    res.status(201).json({ message: 'Application submitted successfully.', application: newApplication });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};

// 2. NBFC Admin fetches ONLY their assigned applications
export const getNbfcLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user.nbfcId;

    if (!nbfcId) {
      res.status(403).json({ message: 'You are not assigned to any NBFC.' });
      return;
    }

    const applications = await Application.find({ nbfcId })
      .populate('borrowerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: applications.length, applications });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
  }
};
// Fetch all active NBFCs for the frontend dropdown
export const getActiveNbfcs = async (req: Request, res: Response): Promise<void> => {
  try {
    const nbfcs = await NBFC.find({ isActive: true }).select('_id name');
    res.status(200).json({ nbfcs });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error fetching NBFCs', error });
    }
  }
};