import api from "./api";

export async function searchFlights(q) {
  const resp = await api.get("/flights/search", { params: q });
  return resp.data;
}

// DEFAULT EXPORT (optional)
export default {
  searchFlights
};
