// import { Router } from 'express';
// import {
//   setupSuperAdmin,
//   createNbfc,
//   createNbfcAdmin,
//   getSuperAdminDashboardData,
//   getAllNbfcs
// } from '../controllers/admin.controller';
// import {
//   protect,
//   authorizeRoles,
// } from '../middleware/auth.middleware';
// import { getStats } from '../controllers/dashboard.controller';
// import { getTickets, replyToTicket } from '../controllers/support.controller';
// import { auditLogger } from '../middleware/auditLogger';
// import auditService from '../services/audit.service';
// import Settings from '../models/Settings';
// import User from '../models/User';
// import Application from '../models/Application';
// import NBFC from '../models/NBFC';
// import Ticket from '../models/Ticket';

// const router: Router = Router();

// router.post('/setup-super-admin', setupSuperAdmin);

// router.post(
//   '/create-nbfc',
//   protect,
//   authorizeRoles('SUPER_ADMIN'),
//   createNbfc
// );

// router.post(
//   '/create-nbfc-admin',
//   protect,
//   authorizeRoles('SUPER_ADMIN'),
//   createNbfcAdmin
// );

// router.get(
//   '/dashboard-data',
//   protect,
//   authorizeRoles('SUPER_ADMIN'),
//   getSuperAdminDashboardData
// );

// router.get(
//   '/nbfcs',
//   protect,
//   authorizeRoles('SUPER_ADMIN'),
//   getAllNbfcs
// );


// // Dashboard
// router.get(
//   '/dashboard/stats', 
//   protect, 
//   authorizeRoles('SUPER_ADMIN'), 
//   getStats 
// );

// // Audit Logs - Tracking features
// router.get('/logs', async (req, res) => {
//   const logs = await auditService.fetchLogs(req.query.nbfcId as string);
//   res.json(logs);
// });

// // Support - Reply is logged
// router.post('/support/reply', auditLogger('SUPPORT'), replyToTicket);

// // Get Settings
// router.get('/settings', async (req, res) => {
//   let settings = await Settings.findOne();
//   if (!settings) settings = await Settings.create({});
//   res.json({ success: true, settings });
// });

// // Update Settings
// router.put('/settings', async (req, res) => {
//   const updated = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
//   res.json({ success: true, settings: updated });
// });

// // Support Routes
// router.get('/support/tickets', protect, authorizeRoles('SUPER_ADMIN'), getTickets); 
// router.post('/support/reply', protect, authorizeRoles('SUPER_ADMIN'), auditLogger('SUPPORT'), replyToTicket);

// // Get All Users
// router.get('/users', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
//   const users = await User.find({ role: 'BORROWER' }).sort({ createdAt: -1 });
//   res.json({ success: true, users });
// });

// // Get All Applications
// router.get('/applications', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
//   const applications = await Application.find()
//     .populate('borrowerId', 'name email phoneNumber')
//     .populate('nbfcId', 'name')
//     .sort({ createdAt: -1 });
//   res.json({ success: true, applications });
// });

// // 1. Delete NBFC Route
// router.delete('/nbfcs/:id', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
//   try {
//     await NBFC.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'NBFC deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to delete NBFC' });
//   }
// });

// // 2. Update Ticket Status Route (Resolve/Close)
// router.patch('/support/tickets/:id/status', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
//   try {
//     const { status } = req.body;
//     const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
//     res.json({ success: true, ticket });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to update ticket' });
//   }
// });

// export default router;
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
import { getStats } from '../controllers/dashboard.controller';
import { getTickets, replyToTicket } from '../controllers/support.controller';
import { auditLogger } from '../middleware/auditLogger';
import auditService from '../services/audit.service';
import Settings from '../models/Settings';
import User from '../models/User';
import Application from '../models/Application';
import NBFC from '../models/NBFC';
import Ticket from '../models/Ticket';

const router: Router = Router();

//  AUTH & SETUP 
router.post('/setup-super-admin', setupSuperAdmin);

//  DASHBOARD & STATS 
router.get(
  '/dashboard-data',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  getSuperAdminDashboardData
);

router.get(
  '/dashboard/stats', 
  protect, 
  authorizeRoles('SUPER_ADMIN'), 
  getStats 
);

//  NBFC MANAGEMENT 
router.post(
  '/create-nbfc',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  auditLogger('NBFC_CREATED'),
  createNbfc
);

router.post(
  '/create-nbfc-admin',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  auditLogger('NBFC_ADMIN_CREATED'), 
  createNbfcAdmin
);

router.get(
  '/nbfcs',
  protect,
  authorizeRoles('SUPER_ADMIN'),
  getAllNbfcs
);

// : Added auditLogger here for Delete action
router.delete(
  '/nbfcs/:id', 
  protect, 
  authorizeRoles('SUPER_ADMIN'), 
  auditLogger('NBFC_DELETED'), 
  async (req, res) => {
    try {
      await NBFC.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'NBFC deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete NBFC' });
    }
  }
);

//  SUPPORT TICKETS 
router.get(
  '/support/tickets', 
  protect, 
  authorizeRoles('SUPER_ADMIN'), 
  getTickets
);

//  Removed the duplicate duplicate route. Kept the correct protected one.
router.post(
  '/support/reply', 
  protect, 
  authorizeRoles('SUPER_ADMIN'), 
  auditLogger('TICKET_REPLY'), 
  replyToTicket
);

//  Added auditLogger here for Ticket Resolve/Close action
router.patch(
  '/support/tickets/:id/status', 
  protect, 
  authorizeRoles('SUPER_ADMIN'), 
  auditLogger('TICKET_STATUS_UPDATED'),
  async (req, res) => {
    try {
      const { status } = req.body;
      const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
      res.json({ success: true, ticket });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update ticket' });
    }
  }
);

//  USER & APPLICATION MANAGEMENT 
router.get('/users', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
  const users = await User.find({ role: 'BORROWER' }).sort({ createdAt: -1 });
  res.json({ success: true, users });
});

router.get('/applications', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
  const applications = await Application.find()
    .populate('borrowerId', 'name email phoneNumber')
    .populate('nbfcId', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

//  PLATFORM SETTINGS 
//  Added protect middleware so random people can't see settings
router.get('/settings', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, settings });
});

//  Added auditLogger so when you change settings, it gets tracked
router.put('/settings', protect, authorizeRoles('SUPER_ADMIN'), auditLogger('SETTINGS_UPDATED'), async (req, res) => {
  const updated = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json({ success: true, settings: updated });
});

//  AUDIT LOGS 
//  Added protect middleware so it's secure
router.get('/logs', protect, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
  // Yahan tera auditService fetch kar raha hai data
  const logs = await auditService.fetchLogs(req.query.nbfcId as string);
  res.json(logs); 
});

export default router;