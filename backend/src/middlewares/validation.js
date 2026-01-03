import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Sign up validation
export const validateSignUp = [
  body('employee_id').trim().notEmpty().withMessage('Employee ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role').isIn(['Employee', 'HR']).withMessage('Role must be either Employee or HR'),
  validate
];

// Sign in validation
export const validateSignIn = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Leave request validation
export const validateLeaveRequest = [
  body('leave_type').isIn(['Paid', 'Sick', 'Unpaid', 'Personal', 'Emergency']).withMessage('Invalid leave type'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required'),
  body('remarks').optional().trim(),
  validate
];

