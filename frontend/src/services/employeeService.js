import api from './api.js';

export const employeeService = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/employees/me');
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await api.put('/employees/me', data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  }
};

