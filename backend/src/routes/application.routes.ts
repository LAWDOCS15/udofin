// import express from 'express';
// import { submitApplication, getNbfcLeads, getActiveNbfcs } from '../controllers/application.controller';
// import { protect, authorizeRoles } from '../middleware/auth.middleware';
// import { uploadDocuments } from '../middleware/upload.middleware';


// const router = express.Router();

// router.post(
//   '/submit',
//   protect,
//   authorizeRoles('BORROWER'),
//   uploadDocuments.fields([
//     { name: 'panCard', maxCount: 1 },
//     { name: 'aadhaarCard', maxCount: 1 },
//     { name: 'selfie', maxCount: 1 }
//   ]),
//   submitApplication
// );

// router.get('/leads', protect, authorizeRoles('NBFC_ADMIN'), getNbfcLeads);
// router.get('/nbfcs', getActiveNbfcs);


// export default router;

import { Router } from 'express';
import {
  submitApplication,
  getNbfcLeads,
  getActiveNbfcs,
} from '../controllers/application.controller';
import {
  protect,
  authorizeRoles,
} from '../middleware/auth.middleware';
import { uploadDocuments } from '../middleware/upload.middleware';

/* =========================================
   Router Initialization
========================================= */

const router: Router = Router();

/* =========================================
   Borrower Routes
========================================= */

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

/* =========================================
   NBFC Admin Routes
========================================= */

router.get(
  '/leads',
  protect,
  authorizeRoles('NBFC_ADMIN'),
  getNbfcLeads
);

/* =========================================
   Public Routes
========================================= */

router.get('/nbfcs', getActiveNbfcs);

/* =========================================
   Export
========================================= */

export default router;
