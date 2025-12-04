import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPin, Star, CheckCircle, Clock, Loader2 } from "lucide-react";
const API = import.meta.env.VITE_API_URL;

const DealDetails = () => {
  const { slug } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    try {
      /*
      const res = await axios.get(
        `http://localhost:5000/api/ai/deal-details?slug=${slug}`
      );
*/
      const res = await axios.get(
        `${API}/ai/deal-details?slug=${slug}`
      );


      // Ensure arrays always exist to prevent UI crashes
      const safeDeal = {
        ...res.data,
        gallery: res.data.gallery || [],
        highlights: res.data.highlights || [],
        itinerary: res.data.itinerary || [],
        includes: res.data.includes || []
      };

      setDeal(safeDeal);
    } catch (err) {
      console.log("Deal Details Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading || !deal)
    return (
      <div className="min-h-screen flex items-center justify-center overflow-x-hidden">
        <Loader2 className="h-10 w-10 animate-spin text-[#1664FF]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20 overflow-x-hidden">

      {/* Hero Image */}
      <img
        src={deal.image}
        alt={deal.title}
        className="w-full h-72 object-cover rounded-b-3xl shadow-lg"
      />

      <div className="max-w-4xl mx-auto px-6 mt-6">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>

        {/* Location + Rating */}
        <div className="flex items-center gap-3 mt-2 text-gray-600">
          <MapPin className="h-5 w-5 text-[#1664FF]" /> {deal.location}
          <Star className="h-5 w-5 text-yellow-400 ml-2" /> {deal.rating}
        </div>

        {/* Price Box */}
        <div className="mt-5 bg-white rounded-2xl shadow-md p-5">
          <p className="text-[#DC143C] font-bold text-lg">{deal.discount}</p>
          <p className="font-semibold text-gray-800 text-xl">{deal.price}</p>
          <p className="text-gray-600 flex items-center mt-1">
            <Clock className="h-5 w-5 mr-2 text-[#1664FF]" />
            {deal.duration}
          </p>
        </div>

        {/* Gallery */}
        <h3 className="mt-8 text-xl font-bold">Gallery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          {deal.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="gallery"
              className="rounded-xl shadow-md object-cover h-40 w-full"
            />
          ))}
        </div>

        {/* Highlights */}
        <h3 className="mt-10 text-xl font-bold">Highlights</h3>
        <ul className="mt-3 space-y-2">
          {deal.highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" /> {h}
            </li>
          ))}
        </ul>

        {/* Itinerary */}
        <h3 className="mt-10 text-xl font-bold">Itinerary</h3>
        <ul className="mt-3 space-y-2">
          {deal.itinerary.map((item, i) => (
            <li key={i} className="bg-white shadow-sm p-3 rounded-xl">
              {item}
            </li>
          ))}
        </ul>

        {/* Includes */}
        <h3 className="mt-10 text-xl font-bold">Includes</h3>
        <ul className="mt-3 space-y-2">
          {deal.includes.map((inc, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" /> {inc}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default DealDetails;
