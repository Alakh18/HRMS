import express from 'express';
import {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  getLeaveRequestById,
  updateLeaveStatus,
  deleteLeaveRequest
} from '../controllers/leaveController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateLeaveRequest } from '../middlewares/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/', validateLeaveRequest, createLeaveRequest);
router.get('/me', getMyLeaveRequests);
router.get('/me/:id', getLeaveRequestById);
router.delete('/me/:id', deleteLeaveRequest);

// Admin/HR routes
router.get('/', authorize('Admin', 'HR'), getAllLeaveRequests);
router.get('/:id', getLeaveRequestById);
router.put('/:id/status', authorize('Admin', 'HR'), updateLeaveStatus);

export default router;

