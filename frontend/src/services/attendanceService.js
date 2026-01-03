import api from './api.js';

export const attendanceService = {
  checkIn: async (remarks) => {
    const response = await api.post('/attendance/checkin', { remarks });
    return response.data;
  },

  checkOut: async () => {
    const response = await api.post('/attendance/checkout');
    return response.data;
  },

  getMyAttendance: async (startDate, endDate) => {
    const response = await api.get('/attendance/me', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await api.get('/attendance/me/today');
    return response.data;
  },

  getAll: async (startDate, endDate, employeeId) => {
    const response = await api.get('/attendance', {
      params: { start_date: startDate, end_date: endDate, employee_id: employeeId }
    });
    return response.data;
  }
};

