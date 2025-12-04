import api from './api';
import axios from 'axios';

export const placesAPI = {
  getAll: () => api.get('/places'),
  getById: (id) => api.get(`/places/${id}`),
  create: (data) => api.post('/places', data),
  update: (id, data) => api.put(`/places/${id}`, data),
  delete: (id) => api.delete(`/places/${id}`),

  // Local DB search
  search: (query) => api.get(`/places/search?q=${encodeURIComponent(query)}`),

  // Global DB search
  searchGlobal: (query) => api.get(`/places/search-global?q=${encodeURIComponent(query)}`),

  // Category based
  getByCategory: (category) => api.get(`/places/category/${category}`),

  // ⭐ AI powered search
searchAI(query) {
  return api.get(`/ai/search-places?q=${encodeURIComponent(query)}`);
},

detectCountry(query) {
  return api.post("/ai/detect-country", { query });
},

detectQueryType(query) {
  return api.post("/ai/detect", { query });
}



};


const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });


export const savePlace = (payload) => API.post('/api/places', payload); // existing maybe


export const getReviews = (placeId) => API.get(`/api/reviews/place/${placeId}`);
export const postReview = (payload) => API.post('/api/reviews', payload); // { placeId, rating, comment }
export const updateReview = (id, payload) => API.put(`/api/reviews/${id}`, payload);
export const deleteReview = (id) => API.delete(`/api/reviews/${id}`);


export default API;
