import api from './api.js';

export const leaveService = {
  create: async (data) => {
    const response = await api.post('/leave', data);
    return response.data;
  },

  getMyLeaves: async (status) => {
    const response = await api.get('/leave/me', {
      params: status ? { status } : {}
    });
    return response.data;
  },

  getAll: async (status, employeeId) => {
    const response = await api.get('/leave', {
      params: { status, employee_id: employeeId }
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/leave/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, admin_comments) => {
    const response = await api.put(`/leave/${id}/status`, { status, admin_comments });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/leave/me/${id}`);
    return response.data;
  }
};

