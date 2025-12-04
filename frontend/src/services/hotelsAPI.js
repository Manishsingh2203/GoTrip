import api from "./api";

// Named export
export const searchHotels = async (params) => {
  try {
    const res = await api.get("/hotels/search", { params });
    return res.data;
  } catch (error) {
    console.error("Hotel Search API Error:", error);
    return { success: false, message: "Failed to search hotels" };
  }
};

// Keep existing API if required
export const hotelsAPI = {
  getByPlace: (placeId) => api.get(`/hotels/place/${placeId}`),
  create: (data) => api.post("/hotels", data),
};
