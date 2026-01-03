import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/* =========================
   DATE & TIME HELPERS
========================= */

const getTodayLocalDate = () => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString().split('T')[0];
};

const getCurrentTime = () => {
  return new Date().toTimeString().split(' ')[0];
};

/* =========================
   AUTO CREATE EMPLOYEE
========================= */

const getOrCreateEmployee = async (userId) => {
  let employee = await Employee.findByUserId(userId);

  if (!employee) {
    const user = await User.findById(userId);
    if (!user) return null;

    const employeeId = await Employee.create({
      user_id: user.id,
      first_name: 'Employee',
      last_name: '',
      phone: null,
      address: null,
      date_of_birth: null,
      gender: null,
      profile_picture: null,
      department: 'General',
      position: 'Employee',
      hire_date: getTodayLocalDate(),
      employment_type: 'Full-time'
    });

    employee = await Employee.findById(employeeId);
  }

  return employee;
};

/* =========================
   CHECK IN
========================= */

export const checkIn = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = getTodayLocalDate();
    const checkInTime = getCurrentTime();

    const existing = await Attendance.findByEmployeeAndDate(employee.id, today);
    if (existing && existing.check_in_time) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    await Attendance.create({
      employee_id: employee.id,
      date: today,
      check_in_time: checkInTime,
      status: 'Present',
      remarks: req.body?.remarks || null
    });

    const attendance = await Attendance.findByEmployeeAndDate(employee.id, today);

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
    res.status(500).json({
      message: 'Error checking in',
      error: error.message
    });
  }
};

/* =========================
   CHECK OUT
========================= */

export const checkOut = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = getTodayLocalDate();
    const checkOutTime = getCurrentTime();

    const attendance = await Attendance.checkOut(
      employee.id,
      today,
      checkOutTime
    );

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
    res.status(500).json({
      message: 'Error checking out',
      error: error.message
    });
  }
};

/* =========================
   GET MY ATTENDANCE
========================= */

export const getMyAttendance = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { start_date, end_date } = req.query;

    const startDate =
      start_date ||
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString().split('T')[0];

    const endDate = end_date || getTodayLocalDate();

    const attendance = await Attendance.findByEmployee(
      employee.id,
      startDate,
      endDate
    );

    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

/* =========================
   GET TODAY ATTENDANCE
========================= */

export const getTodayAttendance = async (req, res) => {
  try {
    const employee = await getOrCreateEmployee(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = getTodayLocalDate();
    const attendance = await Attendance.findByEmployeeAndDate(employee.id, today);

    res.json({ attendance: attendance || null });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({
      message: 'Error fetching today attendance',
      error: error.message
    });
  }
};

/* =========================
   ADMIN: GET ALL ATTENDANCE
========================= */

export const getAllAttendance = async (req, res) => {
  try {
    const { start_date, end_date, employee_id } = req.query;

    const startDate =
      start_date ||
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString().split('T')[0];

    const endDate = end_date || getTodayLocalDate();

    const attendance = await Attendance.findAll(
      startDate,
      endDate,
      employee_id || null
    );

    res.json({ attendance });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

/* =========================
   ADMIN: UPDATE ATTENDANCE
========================= */

export const updateAttendance = async (req, res) => {
  try {
    const { employee_id, date } = req.params;
    const updateData = req.body;

    const attendance = await Attendance.update(
      employee_id,
      date,
      updateData
    );

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      message: 'Error updating attendance',
      error: error.message
    });
  }
};
