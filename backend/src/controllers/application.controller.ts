import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as applicationService from '../services/application.service';

const handleControllerError = (error: any, res: Response, logMessage: string) => {
  if (error.status) {
    res.status(error.status).json({ message: error.message });
  } else {
    console.error(`${logMessage}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await applicationService.submitApplicationService(
      req.user.id,
      req.user.role,
      req.body,
      req.files
    );

    res.status(201).json({
      message: 'Application submitted successfully.',
      applicationId: result.applicationId,
    });
  } catch (error) {
    handleControllerError(error, res, 'Submit Application Error');
  }
};

export const getNbfcLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await applicationService.getNbfcLeadsService(
      req.user.id,
      req.user.role,
      req.user.nbfcId
    );

    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Get NBFC Leads Error');
  }
};

export const getActiveNbfcs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await applicationService.getActiveNbfcsService();
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Fetch Active NBFCs Error');
  }
};

export const updateVerificationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await applicationService.updateVerificationStatusService(
      req.user.id,
      req.user.role,
      req.user.nbfcId,
      req.params.id as string, 
      req.body
    );

    res.status(200).json({
      message: `Application ${result.verificationStatus.toLowerCase()} successfully.`,
      ...result,
    });
  } catch (error) {
    handleControllerError(error, res, 'Update Verification Status Error');
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await applicationService.getMyApplicationsService(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, 'Get My Applications Error');
  }
};