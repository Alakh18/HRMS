import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const signUp = async (req, res) => {
  try {
    const { employee_id, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if employee_id already exists
    const existingEmployeeId = await User.findByEmployeeId(employee_id);
    if (existingEmployeeId) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Create user
    const userId = await User.create({ employee_id, email, password, role });

    // Create welcome notification
    await Notification.create({
      user_id: userId,
      title: 'Welcome to HRMS',
      message: 'Your account has been created successfully. Please complete your profile.',
      type: 'Success'
    });

    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        employee_id,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get employee details if exists
    const employee = await Employee.findByUserId(user.id);

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        email: user.email,
        role: user.role,
        employee: employee || null
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const employee = await Employee.findByUserId(req.user.id);

    res.json({
      user: {
        ...user,
        employee
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

