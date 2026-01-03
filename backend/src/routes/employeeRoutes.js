import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  createEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.get('/me', getMyProfile);
router.put('/me', updateEmployee);

// Admin/HR routes
router.get('/', authorize('Admin', 'HR'), getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('Admin', 'HR'), createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', authorize('Admin', 'HR'), deleteEmployee);

export default router;

