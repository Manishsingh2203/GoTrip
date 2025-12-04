const axios = require("axios");
const config = require("../config/env");

const PEXELS_API = "https://api.pexels.com/v1/search";

async function getPexelsImage(query) {
  try {
    const res = await axios.get(PEXELS_API, {
      headers: {
        Authorization: config.pexels.apiKey
      },
      params: {
        query,
        per_page: 1,
        orientation: "landscape"
      }
    });

    const photo = res.data?.photos?.[0];
    if (!photo) return null;

    // MOST RELIABLE FALLBACK SYSTEM
    return (
      photo.src.large2x ||
      photo.src.large ||
      photo.src.original ||
      photo.src.medium ||
      photo.src.small ||
      null
    );

  } catch (err) {
    console.error("❌ Pexels Error:", err.message);
    return null;
  }
}

module.exports = {
  getPexelsImage
};
