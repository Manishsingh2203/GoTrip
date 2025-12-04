import { useState } from 'react';
import { restaurantsAPI } from '../services/restaurantsAPI';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRestaurantsByPlace = async (placeId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await restaurantsAPI.getByPlace(placeId);
      const rawRestaurants = response.data?.data || [];

      const normalized = rawRestaurants.map((r) => {
        const {
          name = "Restaurant",
          rating = 4.2,
          priceRange = "$$",
          cuisine = Array.isArray(r.cuisine) ? r.cuisine : [],
          images = Array.isArray(r.images) ? r.images : [],
          location = {},
        } = r;

        // ---- FIXED IMAGE PRIORITY ----
        const realImage =
          images?.[0] ||     // backend array
          r.image ||         // fallback single image
          null;

        // ---- CORRECT PLACEHOLDER (backend = 200x200) ----
        const imageSrc = realImage || "/api/placeholder/200/200";

        return {
          ...r,

          name,
          rating,
          priceRange,

          // FIX: cuisine must always be array
          cuisine,

          // RETURN BOTH for components
          image: imageSrc,
          images: realImage ? [realImage] : ["/api/placeholder/200/200"],

          // FIX ADDRESS
          address: location?.address || "Address not available",
        };
      });

      setRestaurants(normalized);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////
  const fetchRestaurants = async (query) => {
    try {
      setLoading(true);
      setError(null);

      const res = await restaurantsAPI.search(query);
      const rawRestaurants = res.data?.data || [];

      const normalized = rawRestaurants.map((r) => {
        const {
          name = "Restaurant",
          rating = 4.2,
          priceRange = "$$",
          cuisine = Array.isArray(r.cuisine) ? r.cuisine : [],
          images = Array.isArray(r.images) ? r.images : [],
          location = {},
        } = r;

        const realImage =
          images?.[0] ||
          r.image ||
          null;

        const imageSrc = realImage || "/api/placeholder/200/200";

        return {
          ...r,
          name,
          rating,
          priceRange,
          cuisine,
          image: imageSrc,
          images: realImage ? [realImage] : ["/api/placeholder/200/200"],
          address: location?.address || "Address not available",
        };
      });

      setRestaurants(normalized);

    } catch (err) {
      setError("Failed to search restaurants");
    } finally {
      setLoading(false);
    }
  };




  //////////////////////////////////////////////


  return {
    restaurants,
    loading,
    error,
    fetchRestaurantsByPlace,
    fetchRestaurants,  
  };
};
