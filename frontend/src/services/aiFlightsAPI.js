import api from "./api";

export const getAIFlights = async (payload) => {
  const res = await api.post("/ai/flights", payload);
  return res.data.data; 
};
