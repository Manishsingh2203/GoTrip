import React, { useState } from "react";
import { Smartphone, Download, X, Sparkles } from "lucide-react";
import TravelChatbot from '../components/chat/TravelChatbot';
const API = import.meta.env.VITE_API_URL;
const DownloadApp = () => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDownloadClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowPopup(true);
    }, 1200);
  };

  const submitEmail = async () => {
    if (!email.trim()) return;
    setSubmitting(true);

    try {
      /*
      await fetch("http://localhost:5000/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      */
      await fetch(`${API}/notify`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });


      setSubmitted(true);
      setSubmitting(false);

      // Automatically hide popup after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
        setSubmitted(false);
        setEmail("");
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* MAIN UI */}
      <div className="max-w-3xl mx-auto px-4 py-16 text-center overflow-x-hidden">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#F7F7F7] rounded-2xl flex items-center justify-center mb-4">
            <Smartphone className="h-8 w-8 text-[#1e599e]" />
          </div>

          <h1 className="text-3xl font-bold text-[#222222] mb-4">Download GoTrip App</h1>
          <p className="text-[#767676] mb-8 max-w-xl">
            Experience smarter travel with AI-powered itineraries, live updates,
            flight alerts and offline access.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            <button
              onClick={handleDownloadClick}
              className="bg-[#222222] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#484848] transition"
            >
              <Download className="h-5 w-5" />
              Download for Android (APK)
            </button>

            <button
              onClick={handleDownloadClick}
              className="bg-[#1e599e] text-white py-3 rounded-lg font-semibold hover:bg-[#FF5A5F] transition"
            >
              Download for iOS
            </button>
          </div>

          <p className="text-xs text-[#767676] mt-6">
            *Apps are under development.
          </p>
        </div>
      </div>

      {/* LOADER OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center relative animate-slideUp">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-[#767676] hover:text-[#222222]"
            >
              <X className="h-6 w-6" />
            </button>

            <Sparkles className="h-10 w-10 text-[#1e599e] mx-auto mb-3" />

            <h2 className="text-2xl font-bold text-[#222222] mb-2">Coming Soon 🚧</h2>

            <p className="text-[#767676] text-sm mb-4">
              Our mobile app is under development.
              Enter your email and we'll notify you once it's live!
            </p>

            <p className="text-[#484848] text-sm font-semibold mb-4">
              App Version: <span className="text-[#1e599e]">v1.0.0-beta</span>
            </p>

            {/* SUCCESS MESSAGE */}
            {submitted ? (
              <p className="text-[#1e599e] font-semibold text-sm py-2">
                Thank you! You'll be notified soon.
              </p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-[#1e599e] outline-none text-[#222222]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={submitEmail}
                  disabled={submitting}
                  className={`w-full text-white py-2 rounded-lg font-semibold transition ${submitting
                      ? "bg-[#767676] cursor-not-allowed"
                      : "bg-[#0CA9A5] hover:bg-[#FF5A5F]"
                    }`}
                >
                  {submitting ? "Submitting..." : "Notify Me"}
                </button>
              </>
            )}
          </div>
          {/* AI Chatbot */}
          <TravelChatbot />
        </div>
      )}
    </>

  );
};

export default DownloadApp;