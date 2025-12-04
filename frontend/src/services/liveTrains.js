import api from "./api";

export async function searchTrains(from, to, date) {
  return api.get(`/live/trains?from=${from}&to=${to}&date=${date}`);
}

export default { searchTrains };
