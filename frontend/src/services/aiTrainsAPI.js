import api from "./api";

export const getAITrains = async (payload) => {
  const res = await api.post("/ai/trains", payload);
  return res.data.data;
};
