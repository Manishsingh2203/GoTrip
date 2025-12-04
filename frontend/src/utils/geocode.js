export const getCoordinates = async (placeName) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      placeName
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (e) {
    console.log("Geocode error:", e);
  }

    // fallback world center
  return {
    lat: 20,
    lng: 0,
  };
};
