import api from "./api";

export async function searchHotels(city, checkin = "", checkout = "") {
  return api.get(`/live/hotels?city=${city}&checkin=${checkin}&checkout=${checkout}`);
}

export default { searchHotels };
