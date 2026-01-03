import Employee from '../models/Employee.js';
import User from '../models/User.js';

export const getAllEmployees = async (req, res) => {
  try {
    const { department, status } = req.query;
    const filters = {};

    if (department) filters.department = department;
    if (status) filters.status = status;

    const employees = await Employee.findAll(filters);
    res.json({ employees });
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ employee });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);

    if (!employee) {
      // Return user info even if employee profile doesn't exist
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ 
        employee: null,
        user: {
          id: user.id,
          employee_id: user.employee_id,
          email: user.email,
          role: user.role
        },
        message: 'Employee profile not yet created. Please contact HR to complete your profile setup.'
      });
    }

    res.json({ employee });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Employees can only update their own profile with limited fields
    if (req.user.role === 'Employee' && employee.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    // Employees can only update certain fields
    if (req.user.role === 'Employee') {
      const allowedFields = ['phone', 'address', 'profile_picture'];
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
    }

    const updatedEmployee = await Employee.update(id, req.body);

    res.json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    // Only Admin/HR can create employees
    const employeeData = req.body;

    // Check if user exists
    const user = await User.findById(employeeData.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if employee profile already exists
    const existingEmployee = await Employee.findByUserId(employeeData.user_id);
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee profile already exists' });
    }

    const employeeId = await Employee.create(employeeData);
    const employee = await Employee.findById(employeeId);

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.delete(id);

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};

