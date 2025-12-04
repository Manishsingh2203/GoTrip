import api from './api';

export const aiAPI = {
  generatePackingList: (data) => api.post('/ai/packing-list', data),

  generateSafetyTips: (data) => api.post('/ai/safety-tips', data),

  generateItinerary: (data) => api.post('/ai/itinerary', data),

  generateBudget: (data) => api.post('/ai/budget', data),

  chat: (message, context = "") =>
    api.post('/ai/chat', {
      message,
      context,
    }),

  voicePlan: (data) => api.post("/ai/voice-plan", data), // AI voice itinerary

  // ⭐ NEW — AUTO LANGUAGE DETECTION API
  detectLang: (data) => api.post("/ai/detect-lang", data),
};
