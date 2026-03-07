
import { Router } from 'express';
import * as dashboardController from '../controllers/nbfcDashboard.controller';
import * as loanController from '../controllers/loan.controller';
import * as emiController from '../controllers/emi.controller';
import * as staffController from '../controllers/staff.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

/**
 * 🔐 Middlewares for NBFC Protected Routes
 */
const nbfcAuth = [protect, authorizeRoles('NBFC_ADMIN')];

// --- DASHBOARD STATS ---
router.get(
  '/stats', 
  nbfcAuth, 
  dashboardController.getDashboardStats
);

// for Badge Count route 
router.get(
  '/applications/stats', 
  nbfcAuth, 
  dashboardController.getPendingApplicationCount
);

router.get('/customers', nbfcAuth, dashboardController.getCustomers);

router.get(
  '/reports', 
  nbfcAuth, 
  dashboardController.getReportsData
); 


// --- 👥 STAFF MANAGEMENT ---
router.get('/staff', nbfcAuth, staffController.getStaff);
router.post('/staff', nbfcAuth, staffController.createStaff);
router.delete('/staff/:id', nbfcAuth, staffController.removeStaff);

// --- LOAN DISBURSEMENT ---
router.post(
  '/disburse', 
  nbfcAuth, 
  loanController.disburseLoan
);

router.get(
  '/disbursements', 
  nbfcAuth, 
  loanController.getDisbursementList
);

// --- EMI COLLECTIONS ---
router.get(
  '/emis/upcoming', 
  nbfcAuth, 
  emiController.getUpcomingEmis
);

router.patch(
  '/emis/pay', 
  nbfcAuth, 
  emiController.markEmiAsPaid
);

router.get(
  '/emis/tracker', 
  nbfcAuth, 
  emiController.getEmiTrackerData
);

export default router; 