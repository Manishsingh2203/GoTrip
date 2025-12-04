const axios = require('axios');
const config = require('../config/env');

class DistanceService {
  async calculateDistance(startLat, startLng, endLat, endLng) {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          coordinates: [
            [startLng, startLat],
            [endLng, endLat]
          ]
        },
        {
          headers: {
            'Authorization': config.openRouteService.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const route = response.data.routes[0];
      return {
        distance: route.summary.distance / 1000, // Convert to km
        duration: route.summary.duration / 60, // Convert to minutes
        geometry: route.geometry
      };
    } catch (error) {
      console.error('Distance API Error:', error);
      throw new Error('Failed to calculate distance');
    }
  }
}

module.exports = new DistanceService();