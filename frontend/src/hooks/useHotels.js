import { useState } from 'react';
import { hotelsAPI } from '../services/hotelsAPI';

export const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);




  const fetchHotelsByPlace = async (placeId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await hotelsAPI.getByPlace(placeId);
      const rawHotels = response.data?.data || [];

      const normalized = rawHotels.map((hotel) => {
        const {
          name = "Hotel",
          rating = 4.2,
          priceRange = "$$",
          amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [],
          images = Array.isArray(hotel.images) ? hotel.images : [],
          location = {},
        } = hotel;

        // ---- FIXED IMAGE PRIORITY ----
        const realImage =
          images?.[0] ||         // backend array image
          hotel.image ||         // backend single image (if exists)
          null;

        // ---- CORRECT PLACEHOLDER (backend = 200x200) ----
        const imageSrc = realImage || "/api/placeholder/200/200";

        return {
          ...hotel,
          name,
          rating,
          priceRange,
          amenities,

          image: imageSrc,                 // single image for UI
          images: realImage ? [realImage] : ["/api/placeholder/200/200"],

          address: location?.address || "Address not available",
        };
      });

      setHotels(normalized);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////////////

    const fetchHotels = async (query) => {
    try {
      setLoading(true);
      setError(null);

      const res = await hotelsAPI.search(query);
      const rawHotels = res.data?.data || [];

      const normalized = rawHotels.map((hotel) => {
        const {
          name = "Hotel",
          rating = 4.2,
          priceRange = "$$",
          amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [],
          images = Array.isArray(hotel.images) ? hotel.images : [],
          location = {},
        } = hotel;

        const realImage =
          images?.[0] ||
          hotel.image ||
          null;

        const imageSrc = realImage || "/api/placeholder/200/200";

        return {
          ...hotel,
          name,
          rating,
          priceRange,
          amenities,
          image: imageSrc,
          images: realImage ? [realImage] : ["/api/placeholder/200/200"],
          address: location?.address || "Address not available",
        };
      });

      setHotels(normalized);

    } catch (err) {
      setError("Failed to search hotels");
    } finally {
      setLoading(false);
    }
  };


  ///////////////////////////////////

  return {
    hotels,
    loading,
    error,
    fetchHotelsByPlace,
    fetchHotels, 
  };
};
