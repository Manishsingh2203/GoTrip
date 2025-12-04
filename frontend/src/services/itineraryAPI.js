import api from './api';
export const itineraryAPI = {
  create: (payload) => api.post('/api/itineraries', payload),
  update: (id, payload) => api.put(`/api/itineraries/${id}`, payload),
  list: () => api.get('/api/itineraries'),
  remove: (id) => api.delete(`/api/itineraries/${id}`)
};
