import api from './api';

export const distanceAPI = {
  calculate: (startLat, startLng, endLat, endLng) => 
    api.get(`/distance/calculate?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`),
};