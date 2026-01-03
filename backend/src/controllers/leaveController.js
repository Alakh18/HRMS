import LeaveRequest from '../models/LeaveRequest.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import pool from '../config/database.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { leave_type, start_date, end_date, remarks } = req.body;

    const leaveId = await LeaveRequest.create({
      employee_id: employee.id,
      leave_type,
      start_date,
      end_date,
      remarks
    });

    const leaveRequest = await LeaveRequest.findById(leaveId);

    // Create notification for admin/HR
    const [admins] = await pool.execute(
      "SELECT id FROM users WHERE role IN ('Admin', 'HR')"
    );
    
    for (const admin of admins) {
      await Notification.create({
        user_id: admin.id,
        title: 'New Leave Request',
        message: `${employee.first_name} ${employee.last_name} has requested ${leave_type} leave`,
        type: 'Leave',
        link: `/leave/${leaveId}`
      });
    }

    // Create notification for employee
    await Notification.create({
      user_id: req.user.id,
      title: 'Leave Request Submitted',
      message: `Your ${leave_type} leave request has been submitted for approval`,
      type: 'Leave',
      link: `/leave/${leaveId}`
    });

    res.status(201).json({
      message: 'Leave request created successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ message: 'Error creating leave request', error: error.message });
  }
};

export const getMyLeaveRequests = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { status } = req.query;
    const leaves = await LeaveRequest.findByEmployee(employee.id, { status });

    res.json({ leaveRequests: leaves });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const { status, employee_id } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (employee_id) filters.employee_id = employee_id;

    const leaves = await LeaveRequest.findAll(filters);

    res.json({ leaveRequests: leaves });
  } catch (error) {
    console.error('Get all leave requests error:', error);
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
};

export const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Employees can only view their own leave requests
    const employee = await Employee.findByUserId(req.user.id);
    if (req.user.role === 'Employee' && leaveRequest.employee_id !== employee.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ leaveRequest });
  } catch (error) {
    console.error('Get leave request error:', error);
    res.status(500).json({ message: 'Error fetching leave request', error: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comments } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const adminEmployee = await Employee.findByUserId(req.user.id);
    const updatedLeave = await LeaveRequest.updateStatus(id, status, admin_comments, adminEmployee.id);

    // Update attendance records if approved
    if (status === 'Approved') {
      const startDate = new Date(leaveRequest.start_date);
      const endDate = new Date(leaveRequest.end_date);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        await Attendance.create({
          employee_id: leaveRequest.employee_id,
          date: dateStr,
          status: 'Leave',
          remarks: `Leave: ${leaveRequest.leave_type}`
        });
      }
    }

    // Get employee user_id for notification
    const employee = await Employee.findById(leaveRequest.employee_id);
    const user = await User.findById(employee.user_id);

    // Create notification for employee
    await Notification.create({
      user_id: user.id,
      title: `Leave Request ${status}`,
      message: `Your ${leaveRequest.leave_type} leave request has been ${status.toLowerCase()}`,
      type: status === 'Approved' ? 'Success' : 'Warning',
      link: `/leave/${id}`
    });

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leaveRequest: updatedLeave
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ message: 'Error updating leave status', error: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Only pending leaves can be deleted by employee
    const employee = await Employee.findByUserId(req.user.id);
    if (req.user.role === 'Employee' && leaveRequest.employee_id !== employee.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'Employee' && leaveRequest.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending leave requests can be deleted' });
    }

    await LeaveRequest.delete(id);

    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Delete leave request error:', error);
    res.status(500).json({ message: 'Error deleting leave request', error: error.message });
  }
};

