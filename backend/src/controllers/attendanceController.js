import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';

export const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInTime = new Date().toTimeString().split(' ')[0];

    // Check if already checked in
    const existingAttendance = await Attendance.findByEmployeeAndDate(employee.id, today);
    if (existingAttendance && existingAttendance.check_in_time) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendanceId = await Attendance.create({
      employee_id: employee.id,
      date: today,
      check_in_time: checkInTime,
      status: 'Present',
      remarks: req.body.remarks
    });

    const attendance = await Attendance.findByEmployeeAndDate(employee.id, today);

    // Create notification
    await Notification.create({
      user_id: req.user.id,
      title: 'Check-in Successful',
      message: `You checked in at ${checkInTime}`,
      type: 'Success',
      link: '/attendance'
    });

    res.json({
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Error checking in', error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date().toTimeString().split(' ')[0];

    const attendance = await Attendance.checkOut(employee.id, today, checkOutTime);

    // Create notification
    await Notification.create({
      user_id: req.user.id,
      title: 'Check-out Successful',
      message: `You checked out at ${checkOutTime}`,
      type: 'Success',
      link: '/attendance'
    });

    res.json({
      message: 'Checked out successfully',
      attendance
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ message: 'Error checking out', error: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findByEmployee(employee.id, startDate, endDate);

    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { start_date, end_date, employee_id } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findAll(startDate, endDate, employee_id || null);

    res.json({ attendance });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const employee = await Employee.findByUserId(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findByEmployeeAndDate(employee.id, today);

    res.json({ attendance: attendance || null });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ message: 'Error fetching today attendance', error: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { employee_id, date } = req.params;
    const updateData = req.body;

    const attendance = await Attendance.update(employee_id, date, updateData);

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Error updating attendance', error: error.message });
  }
};

