import api from "./api";

export const nearbyAPI = {
  getNearby: ({ lat, lng, type }) =>
    api.get("/nearby/search", {
      params: { lat, lng, type },
    }),
};
