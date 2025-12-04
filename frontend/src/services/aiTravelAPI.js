import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

// FLIGHTS
export const getAIFlights = async (payload) => {
  const res = await API.post("/ai/flights", payload);
  return res.data.data; // 👈 new architecture
};

// TRAINS
export const getAITrains = async (payload) => {
  const res = await API.post("/ai/trains", payload);
  return res.data.data;
};

// HOTELS
export const getAIHotels = async (payload) => {
  const res = await API.post("/ai/hotels", payload);
  return res.data.data;
};
