import api from './api.js';

export const attendanceService = {
  // Employee check-in
  checkIn: async (remarks = '') => {
    const response = await api.post('/attendance/checkin', { remarks });
    return response.data;
  },

  // Employee check-out
  checkOut: async () => {
    const response = await api.post('/attendance/checkout');
    return response.data;
  },

  // Employee monthly / range attendance
  getMyAttendance: async (startDate, endDate) => {
    const response = await api.get('/attendance/me', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  },

  // Employee today's attendance (for check-in/out UI)
  getTodayAttendance: async () => {
    const response = await api.get('/attendance/me/today');
    return response.data;
  },

  // Admin / HR attendance view
  getAll: async (startDate, endDate, employeeId = null) => {
    const response = await api.get('/attendance', {
      params: {
        start_date: startDate,
        end_date: endDate,
        ...(employeeId && { employee_id: employeeId })
      }
    });
    return response.data;
  }
};
