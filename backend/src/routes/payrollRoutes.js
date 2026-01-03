import express from 'express';
import {
  getMyPayroll,
  getAllPayroll,
  getEmployeePayroll,
  createPayroll,
  updatePayroll,
  getSalaryStructure,
  updateSalaryStructure
} from '../controllers/payrollController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.get('/me', getMyPayroll);
router.get('/me/salary-structure', getSalaryStructure);

// Admin/HR routes
router.get('/', authorize('Admin', 'HR'), getAllPayroll);
router.get('/employee/:employee_id', authorize('Admin', 'HR'), getEmployeePayroll);
router.post('/', authorize('Admin', 'HR'), createPayroll);
router.put('/:id', authorize('Admin', 'HR'), updatePayroll);
router.put('/salary-structure/:employee_id', authorize('Admin', 'HR'), updateSalaryStructure);

export default router;

