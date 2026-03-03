import { Router } from 'express';
import {
  setupSuperAdmin,
  createNbfc,
  createNbfcAdmin,
  getSuperAdminDashboardData,
  getAllNbfcs
} from '../controllers/admin.controller';
import {
  protect,
  authorizeRoles,
} from '../middleware/auth.middleware';

const router: Router = Router();

router.post('/setup-super-admin', setupSuperAdmin);

router.post(
  '/create-nbfc',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  createNbfc
);

router.post(
  '/create-nbfc-admin',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  createNbfcAdmin
);

router.get(
  '/dashboard-data',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  getSuperAdminDashboardData
);

router.get(
  '/nbfcs',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  getAllNbfcs
);

export default router;