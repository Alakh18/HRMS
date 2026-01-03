import api from './api.js';

export const authService = {
  signUp: async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  signIn: async (data) => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

