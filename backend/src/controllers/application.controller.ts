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

//  NBFC Admin: Approve / Reject / Disburse an application

export const updateVerificationStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'NBFC_ADMIN') {
      res.status(403).json({ message: 'Access denied. NBFC_ADMIN role required.' });
      return;
    }

    const { id } = req.params;
    const { verificationStatus, rejectionReason } = req.body;

    // Validate status value
    const allowedStatuses = ['VERIFIED', 'REJECTED', 'DISBURSED'];
    if (!allowedStatuses.includes(verificationStatus)) {
      res.status(400).json({
        message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
      });
      return;
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ message: 'Invalid application ID.' });
      return;
    }

    const application = await Application.findOne({
      _id: id,
      nbfcId: new mongoose.Types.ObjectId(req.user.nbfcId!),
    });

    if (!application) {
      res.status(404).json({
        message: 'Application not found or does not belong to your NBFC.',
      });
      return;
    }

    if (application.verificationStatus === 'DISBURSED') {
      res.status(400).json({ message: 'Cannot update a disbursed application.' });
      return;
    }

    if (verificationStatus === 'DISBURSED' && application.verificationStatus !== 'VERIFIED') {
      res.status(400).json({
        message: 'Application must be VERIFIED before marking as DISBURSED.',
      });
      return;
    }

    application.verificationStatus = verificationStatus;

    if (verificationStatus === 'REJECTED' && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    res.status(200).json({
      message: `Application ${verificationStatus.toLowerCase()} successfully.`,
      applicationId: application._id,
      verificationStatus: application.verificationStatus,
    });

  } catch (error) {
    console.error('Update Verification Status Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🟢 NEW: Borrower fetches their own applications
export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const borrowerId = new mongoose.Types.ObjectId(req.user.id);
    
    const applications = await Application.find({ borrowerId })
      .populate('nbfcId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Formatting data for frontend dashboard
    const formattedLoans = applications.map((app: any) => ({
      id: app._id,
      nbfcName: app.nbfcId?.name || 'Assigned NBFC',
      amount: app.aiChatData?.requestedAmount || 0,
      cibilScore: app.aiChatData?.score || 0,
      status: app.verificationStatus,
      appliedAt: app.createdAt
    }));

    res.status(200).json({ loans: formattedLoans });

  } catch (error) {
    console.error('Get My Applications Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};