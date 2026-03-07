import { Router } from 'express';
import {
  submitApplication,
  getNbfcLeads,
  getActiveNbfcs,
  updateVerificationStatus,
  getMyApplications,
} from '../controllers/application.controller';
import {
  protect,
  authorizeRoles,
} from '../middleware/auth.middleware';
import { uploadDocuments } from '../middleware/upload.middleware';


  //  Router Initialization

const router: Router = Router();

  //  Borrower Routes

router.post(
  '/submit',
  protect,
  authorizeRoles('BORROWER'),
  uploadDocuments.fields([
    { name: 'panCard', maxCount: 1 },
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  submitApplication
);

  //  NBFC Admin Routes

router.get(
  '/leads',
  protect,
  authorizeRoles('NBFC_ADMIN'),
  getNbfcLeads
);

// NBFC Admin: Approve / Reject / Disburse an application  ← NEW
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('NBFC_ADMIN'),
  updateVerificationStatus
);
router.get(
  '/my-applications',
  protect,
  authorizeRoles('BORROWER'),
  getMyApplications
);
  //  Public Routes

router.get('/nbfcs', getActiveNbfcs);

  //  Export

export default router;
