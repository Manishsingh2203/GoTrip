import api from "./api";

export const getAIHotels = async (payload) => {
  const res = await api.post("/ai/hotels", payload);
  return res.data.data;
};
