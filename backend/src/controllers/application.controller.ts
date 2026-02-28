// import NBFC from '../models/NBFC';
// import { Request, Response } from 'express';
// import { AuthRequest } from '../middleware/auth.middleware';
// import Application from '../models/Application';

// // 1. Borrower submits application with documents
// export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const borrowerId = req.user.id;
//     const { nbfcId, aiChatData } = req.body;
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     if (!nbfcId || !files || !files.panCard || !files.aadhaarCard || !files.selfie) {
//       res.status(400).json({ message: 'All required documents and NBFC ID must be provided.' });
//       return;
//     }

//     const newApplication = await Application.create({
//       borrowerId,
//       nbfcId,
//       aiChatData: aiChatData ? JSON.parse(aiChatData) : {},
//       documents: {
//         panCardUrl: files.panCard[0].path,
//         aadhaarCardUrl: files.aadhaarCard[0].path,
//         selfieUrl: files.selfie[0].path,
//       },
//       verificationStatus: 'PENDING'
//     });

//     res.status(201).json({ message: 'Application submitted successfully.', application: newApplication });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };

// // 2. NBFC Admin fetches ONLY their assigned applications
// export const getNbfcLeads = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const nbfcId = req.user.nbfcId;

//     if (!nbfcId) {
//       res.status(403).json({ message: 'You are not assigned to any NBFC.' });
//       return;
//     }

//     const applications = await Application.find({ nbfcId })
//       .populate('borrowerId', 'name email phone')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ count: applications.length, applications });
//   } catch (error) {
//     if (!res.headersSent) res.status(500).json({ message: 'Server error', error });
//   }
// };
// // Fetch all active NBFCs for the frontend dropdown
// export const getActiveNbfcs = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const nbfcs = await NBFC.find({ isActive: true }).select('_id name');
//     res.status(200).json({ nbfcs });
//   } catch (error) {
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'Error fetching NBFCs', error });
//     }
//   }
// };


import NBFC from '../models/NBFC';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Application from '../models/Application';
import mongoose from 'mongoose';

// 1️ Borrower submits application securely

export const submitApplication = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // 🔐 Authentication check
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    //  Role check
    if (req.user.role !== 'BORROWER') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const borrowerId = new mongoose.Types.ObjectId(req.user.id);

    const { nbfcId, aiChatData } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    //  Validate NBFC ID
    if (!nbfcId || !mongoose.Types.ObjectId.isValid(nbfcId)) {
      res.status(400).json({ message: 'Invalid NBFC ID' });
      return;
    }

    const nbfcObjectId = new mongoose.Types.ObjectId(nbfcId);

    //  Ensure NBFC exists and active
    const nbfcExists = await NBFC.findOne({
      _id: nbfcObjectId,
      isActive: true,
    }).lean();

    if (!nbfcExists) {
      res.status(400).json({
        message: 'Selected NBFC is not available',
      });
      return;
    }

    //  File validation
    if (
      !files ||
      !files.panCard?.[0] ||
      !files.aadhaarCard?.[0] ||
      !files.selfie?.[0]
    ) {
      res.status(400).json({
        message: 'All required documents must be uploaded.',
      });
      return;
    }

    //  Safe JSON parse
    let parsedChatData = {};
    if (aiChatData) {
      try {
        parsedChatData = JSON.parse(aiChatData);
      } catch {
        res.status(400).json({
          message: 'Invalid AI chat data format.',
        });
        return;
      }
    }

    const newApplication = await Application.create({
      borrowerId,
      nbfcId: nbfcObjectId,
      aiChatData: parsedChatData,
      documents: {
        panCardUrl: files.panCard[0].path,
        aadhaarCardUrl: files.aadhaarCard[0].path,
        selfieUrl: files.selfie[0].path,
      },
      verificationStatus: 'PENDING',
    });

    res.status(201).json({
      message: 'Application submitted successfully.',
      applicationId: newApplication._id,
    });

  } catch (error) {
    console.error('Submit Application Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 2️ NBFC Admin fetches ONLY their assigned applications

export const getNbfcLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'NBFC_ADMIN') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (!req.user.nbfcId) {
      res.status(403).json({
        message: 'You are not assigned to any NBFC.',
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.nbfcId)) {
      res.status(400).json({ message: 'Invalid NBFC ID.' });
      return;
    }

    const nbfcObjectId = new mongoose.Types.ObjectId(req.user.nbfcId);

    const applications = await Application.find({
      nbfcId: nbfcObjectId,
    })
      .populate('borrowerId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error('Get NBFC Leads Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 3️ Fetch all active NBFCs (Public API)

export const getActiveNbfcs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nbfcs = await NBFC.find({ isActive: true })
      .select('_id name')
      .lean();

    res.status(200).json({ nbfcs });

  } catch (error) {
    console.error('Fetch Active NBFCs Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};