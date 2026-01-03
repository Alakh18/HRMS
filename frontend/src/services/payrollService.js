import api from './api.js';

export const payrollService = {
  getMyPayroll: async (year, month) => {
    const response = await api.get('/payroll/me', {
      params: { year, month }
    });
    return response.data;
  },

  getAll: async (year, month) => {
    const response = await api.get('/payroll', {
      params: { year, month }
    });
    return response.data;
  },

  getEmployeePayroll: async (employeeId, year, month) => {
    const response = await api.get(`/payroll/employee/${employeeId}`, {
      params: { year, month }
    });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/payroll', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/payroll/${id}`, data);
    return response.data;
  },

  getSalaryStructure: async () => {
    const response = await api.get('/payroll/me/salary-structure');
    return response.data;
  },

  updateSalaryStructure: async (employeeId, data) => {
    const response = await api.put(`/payroll/salary-structure/${employeeId}`, data);
    return response.data;
  }
};

