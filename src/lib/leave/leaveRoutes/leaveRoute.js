import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave
} from '../controllers/leaveController.js';

import { auth } from '../../../middlewares/auth.middleware.js';
import authorizeRoles from '../../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', auth, authorizeRoles('Employee', 'Admin', 'HR'), applyLeave);
router.get('/', auth, authorizeRoles('Employee', 'Admin', 'HR'), getMyLeaves);
router.get('/all', auth, authorizeRoles('Admin', 'HR'), getAllLeaves);
router.put(
  '/status/:id',
  auth,
  authorizeRoles('Admin', 'HR'),
  updateLeaveStatus
);
router.delete(
  '/:id',
  auth,
  authorizeRoles('Employee', 'Admin', 'HR'),
  deleteLeave
);

export default router;
