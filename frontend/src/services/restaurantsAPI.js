import api from './api';

export const restaurantsAPI = {
  getByPlace: (placeId) => api.get(`/restaurants/place/${placeId}`),
  create: (data) => api.post('/restaurants', data),
};