import express from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getTodayAttendance,
  updateAttendance
} from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/me', getMyAttendance);
router.get('/me/today', getTodayAttendance);

// Admin/HR routes
router.get('/', authorize('Admin', 'HR'), getAllAttendance);
router.put('/:employee_id/:date', authorize('Admin', 'HR'), updateAttendance);

export default router;

