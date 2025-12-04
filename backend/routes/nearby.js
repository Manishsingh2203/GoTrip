const express = require("express");
const router = express.Router();

const {
  getNearbyHotels,
  getNearbyRestaurants,
} = require("../controllers/nearbyController");

/**
 * Hotels by Lat/Lng
 * @route GET /api/nearby/nearby-hotels?lat=..&lng=..
 */
router.get("/nearby-hotels", getNearbyHotels);

/**
 * Restaurants by Lat/Lng
 * @route GET /api/nearby/nearby-restaurants?lat=..&lng=..
 */
router.get("/nearby-restaurants", getNearbyRestaurants);

/**
 * Universal Nearby Search
 * @route GET /api/nearby/search?lat=..&lng=..&type=..
 */
router.get("/search", async (req, res) => {
  try {
    const { lat, lng, type = "restaurant" } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "lat and lng are required",
      });
    }

    const amenityMap = {
      restaurant: "restaurant",
      cafe: "cafe",
      atm: "atm",
      hospital: "hospital",
    };

    const amenity = amenityMap[type] || "restaurant";
    const radius = 1500;

    const query = `
      [out:json];
      node["amenity"="${amenity}"](around:${radius},${lat},${lng});
      out;
    `;

    const axios = require("axios");
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const places = (response.data?.elements || []).map((el) => ({
      id: el.id,
      name: el.tags?.name || "Unnamed place",
      lat: el.lat,
      lng: el.lon,
      type: el.tags?.amenity || amenity,
      address:
        [
          el.tags?.["addr:street"],
          el.tags?.["addr:city"],
          el.tags?.["addr:state"],
        ]
          .filter(Boolean)
          .join(", ") || "Address not available",
    }));

    res.json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (err) {
    console.error("Nearby search error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby places",
    });
  }
});

module.exports = router;
