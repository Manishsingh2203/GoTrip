import api from "./api";

export const askHelpAI = async (query) => {
  const res = await api.post("/help/ask", { query });
  return res.data;
};
