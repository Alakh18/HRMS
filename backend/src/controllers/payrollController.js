import Payroll from '../models/Payroll.js';
import SalaryStructure from '../models/SalaryStructure.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';

export const getMyPayroll = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { year, month } = req.query;

    if (month && year) {
      const payroll = await Payroll.findByEmployeeAndMonth(employee.id, parseInt(month), parseInt(year));
      return res.json({ payroll: payroll || null });
    }

    const payroll = await Payroll.findByEmployee(employee.id, year ? parseInt(year) : null);

    res.json({ payroll });
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ message: 'Error fetching payroll', error: error.message });
  }
};

export const getAllPayroll = async (req, res) => {
  try {
    const { year, month } = req.query;

    const payroll = await Payroll.findAll(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );

    res.json({ payroll });
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({ message: 'Error fetching payroll', error: error.message });
  }
};

export const getEmployeePayroll = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { year, month } = req.query;

    if (month && year) {
      const payroll = await Payroll.findByEmployeeAndMonth(parseInt(employee_id), parseInt(month), parseInt(year));
      return res.json({ payroll: payroll || null });
    }

    const payroll = await Payroll.findByEmployee(parseInt(employee_id), year ? parseInt(year) : null);

    res.json({ payroll });
  } catch (error) {
    console.error('Get employee payroll error:', error);
    res.status(500).json({ message: 'Error fetching payroll', error: error.message });
  }
};

export const createPayroll = async (req, res) => {
  try {
    const {
      employee_id, month, year, basic_salary, allowances, deductions,
      bonus, payment_status
    } = req.body;

    const total_salary = (parseFloat(basic_salary) || 0) + (parseFloat(allowances) || 0) + (parseFloat(bonus) || 0);
    const net_salary = total_salary - (parseFloat(deductions) || 0);

    const payrollId = await Payroll.create({
      employee_id,
      month,
      year,
      basic_salary,
      allowances,
      deductions,
      bonus,
      total_salary,
      net_salary,
      payment_status
    });

    const payroll = await Payroll.findByEmployeeAndMonth(employee_id, month, year);

    // Create notification for employee
    const employee = await Employee.findById(employee_id);
    
    await Notification.create({
      user_id: employee.user_id,
      title: 'Payroll Generated',
      message: `Your payroll for ${month}/${year} has been generated`,
      type: 'Payroll',
      link: `/payroll/${payrollId}`
    });

    res.status(201).json({
      message: 'Payroll created successfully',
      payroll
    });
  } catch (error) {
    console.error('Create payroll error:', error);
    res.status(500).json({ message: 'Error creating payroll', error: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Recalculate if salary fields are updated
    if (updateData.basic_salary || updateData.allowances || updateData.bonus || updateData.deductions) {
      const currentPayroll = await Payroll.findByEmployeeAndMonth(
        updateData.employee_id || req.body.employee_id,
        updateData.month || req.body.month,
        updateData.year || req.body.year
      );

      const basic_salary = parseFloat(updateData.basic_salary || currentPayroll.basic_salary);
      const allowances = parseFloat(updateData.allowances || currentPayroll.allowances || 0);
      const bonus = parseFloat(updateData.bonus || currentPayroll.bonus || 0);
      const deductions = parseFloat(updateData.deductions || currentPayroll.deductions || 0);

      updateData.total_salary = basic_salary + allowances + bonus;
      updateData.net_salary = updateData.total_salary - deductions;
    }

    const payroll = await Payroll.update(id, updateData);

    res.json({
      message: 'Payroll updated successfully',
      payroll
    });
  } catch (error) {
    console.error('Update payroll error:', error);
    res.status(500).json({ message: 'Error updating payroll', error: error.message });
  }
};

export const getSalaryStructure = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const salaryStructure = await SalaryStructure.findByEmployee(employee.id);

    res.json({ salaryStructure: salaryStructure || null });
  } catch (error) {
    console.error('Get salary structure error:', error);
    res.status(500).json({ message: 'Error fetching salary structure', error: error.message });
  }
};

export const updateSalaryStructure = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const salaryData = {
      ...req.body,
      effective_from: req.body.effective_from || new Date().toISOString().split('T')[0]
    };

    const salaryStructure = await SalaryStructure.update(parseInt(employee_id), salaryData);

    res.json({
      message: 'Salary structure updated successfully',
      salaryStructure
    });
  } catch (error) {
    console.error('Update salary structure error:', error);
    res.status(500).json({ message: 'Error updating salary structure', error: error.message });
  }
};

