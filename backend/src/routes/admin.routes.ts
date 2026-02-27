import express from 'express';
import { setupSuperAdmin, createNbfc, createNbfcAdmin } from '../controllers/admin.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// One time setup (No protection initially, secure it once created)
router.post('/setup-super-admin', setupSuperAdmin);

// Protected Super Admin Routes
router.post('/create-nbfc', protect, authorizeRoles('SUPER_ADMIN'), createNbfc);
router.post('/create-nbfc-admin', protect, authorizeRoles('SUPER_ADMIN'), createNbfcAdmin);

export default router;