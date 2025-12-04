import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DealsComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 py-10 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-6 py-8 sm:px-10 sm:py-10 text-center">
          <div className="inline-flex items-center justify-center mb-4 h-10 w-10 rounded-full bg-[#FFF1E8] text-[#FF7A32]">
            <Sparkles className="h-5 w-5" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            More deals are coming soon
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We&apos;re working on a new section with extra offers and smart
            recommendations. This feature is currently in{" "}
            <span className="font-semibold text-[#FF7A32]">beta</span>.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-4 mb-2">
            <button
              onClick={() => navigate("/explore-deals")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A32] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#e46d28] transition-colors"
            >
              Back to current deals
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            You&apos;ll start seeing more offers here as we roll this out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealsComingSoon;