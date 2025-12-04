import api from './api'; // axios instance with auth
export const savedAPI = {
  save: (payload) => api.post('/api/saved', payload),
  getAll: () => api.get('/api/saved'),
  remove: (id) => api.delete(`/api/saved/${id}`)
};
