const axios = require("axios");

const API_KEY = process.env.OPENTRIPMAP_KEY;

exports.getNearbyHotels = async (req, res) => {
  const { lat, lon } = req.query;

  const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=3000&lon=${lon}&lat=${lat}&kinds=hotels&apikey=${API_KEY}`;

  const { data } = await axios.get(url);
  res.json({ success: true, data: data.features.slice(0, 5) });
};


exports.getNearbyRestaurants = async (req, res) => {
  const { lat, lon } = req.query;

  const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=3000&lon=${lon}&lat=${lat}&kinds=restaurants&apikey=${API_KEY}`;

  const { data } = await axios.get(url);
  res.json({ success: true, data: data.features.slice(0, 5) });
};
