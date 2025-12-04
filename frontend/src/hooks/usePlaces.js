import { useState, useEffect } from 'react';
import { placesAPI } from '../services/placesAPI';

export const usePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const normalizePlaces = (places) => {
  return places.map((p) => {
    const loc = p.location || {};

    return {
      _id: p._id,

      name: p.name || "Unknown Place",

      city: loc.city || "Unknown",
      country: loc.country || "India",

      // FIX: always send images array
      images:
        Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : ["/api/placeholder/400/300"],

      rating: Number(p.rating) || 4.2,

      description: p.description || "A wonderful destination.",

      category: p.category || "city",

      activities: Array.isArray(p.activities) ? p.activities : [],
      bestTimeToVisit: Array.isArray(p.bestTimeToVisit)
        ? p.bestTimeToVisit
        : [],

      entryFee: p.entryFee ?? 0,
      isFeatured: p.isFeatured ?? false,
    };
  });
};

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await placesAPI.getAll();
      setPlaces(normalizePlaces(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch places");
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async (query) => {
    try {
      setLoading(true);
      const response = await placesAPI.search(query);
      setPlaces(normalizePlaces(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return {
    places,
    loading,
    error,
    searchPlaces,
    refetch: fetchPlaces,
  };
};
