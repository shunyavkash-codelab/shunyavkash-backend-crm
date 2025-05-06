import express from 'express';
import { interviewUpload } from '../../../utils/cloudinaryUpload.util.js';
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';
import { auth } from '../../../middlewares/auth.middleware.js';
import authorizeRoles from '../../../middlewares/role.middleware.js';

const router = express.Router();
router.use(auth);

router.get('/', authorizeRoles('HR', 'Admin', 'Employee'), getAllInterviews);
router.get('/:id', authorizeRoles('HR', 'Admin', 'Employee'), getInterviewById);
router.post(
  '/',
  authorizeRoles('HR', 'Admin'),
  interviewUpload,
  createInterview
);
router.put(
  '/:id',
  authorizeRoles('HR', 'Admin'),
  interviewUpload,
  updateInterview
);
router.delete('/:id', authorizeRoles('HR', 'Admin'), deleteInterview);

export default router;
