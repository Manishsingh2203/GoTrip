import api from "./api";

// 1️⃣ Named export (for FlightsSearch.jsx)
export async function searchFlights(origin, destination, date) {
  return api.get(`/live/flights?from=${origin}&to=${destination}&date=${date}`);
}

// 2️⃣ Object export (for FlightForm.jsx)
export const liveFlightsAPI = {
  search: (origin, destination, date) =>
    api.get(`/live/flights?from=${origin}&to=${destination}&date=${date}`)
};

// 3️⃣ DEFAULT EXPORT (for PriceChart.jsx)
export default {
  searchFlights,
  ...liveFlightsAPI
};
