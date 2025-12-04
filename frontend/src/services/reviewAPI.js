import api from "./api";

export const getReviews = (placeId) => 
  api.get(`/api/reviews/place/${placeId}`);

export const postReview = (payload) => 
  api.post(`/api/reviews`, payload);

export const updateReview = (reviewId, payload) => 
  api.put(`/api/reviews/${reviewId}`, payload);

export const deleteReview = (reviewId) => 
  api.delete(`/api/reviews/${reviewId}`);
