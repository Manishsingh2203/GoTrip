import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { aiAPI } from "../../services/aiAPI";
import { useNavigate } from "react-router-dom";

const VoiceTripAssistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState("en");
  const navigate = useNavigate();

  const userLang = navigator.language?.split("-")[0] || "en";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = userLang + "-IN";
    recognition.interimResults = true;
  }

  const startListening = () => {
    if (!recognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    setTranscript("");
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => setListening(false);
  };

  const stopListening = () => {
    recognition && recognition.stop();
    setListening(false);
  };

  const speakSummary = (summaryText) => {
    if (!window.speechSynthesis) return;

    const msg = new SpeechSynthesisUtterance(summaryText);

    const langMap = {
      hi: "hi-IN",
      en: "en-US",
      ta: "ta-IN",
      bn: "bn-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      te: "te-IN",
    };

    msg.lang = langMap[detectedLang] || "en-US";

    window.speechSynthesis.speak(msg);
  };

  const handleGenerateFromVoice = async () => {
    if (!transcript.trim()) return;

    try {
      setLoading(true);

      const res = await aiAPI.voicePlan({ query: transcript });
      const plan = res.data.data;

      const langRes = await aiAPI.detectLang({ text: transcript });

      if (langRes.data.success) {
        setDetectedLang(langRes.data.lang);
      }

      const summary =
        plan.tripOverview ||
        `Here is your ${plan.duration || ""} trip plan.`;

      speakSummary(summary);

      navigate("/itinerary", { state: { plan } });
    } catch (err) {
      console.error(err);
      alert("Failed to create multilingual trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-xl font-bold text-[#222222]">🎙 Voice Trip Planner</h3>

      <p className="text-sm text-[#767676]">
        Speak in <b>Hindi, English, Tamil, Bengali, Marathi...</b>
        <br />
        Example: <i>“4 din ka Manali trip plan banao”</i>
      </p>

      <div className="flex items-center gap-3">
        {!listening ? (
          <button
            onClick={startListening}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF7A32] text-white rounded-xl hover:bg-[#FF7A32] transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Talking 
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex items-center gap-2 px-4 py-2 bg-[#222222] text-white rounded-xl hover:bg-[#484848] transition-colors"
          >
            <MicOff className="w-5 h-5" />
            Stop
          </button>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-[#1e599e]">
            <Loader2 className="animate-spin w-4 h-4" />
            Planning your trip...
          </div>
        )}
      </div>

      {transcript && (
        <>
          <p className="text-xs text-[#767676]">You said:</p>
          <div className="p-3 bg-[#F7F7F7] rounded-xl text-sm text-[#484848]">{transcript}</div>

          <button
            onClick={handleGenerateFromVoice}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0CA9A5] text-white rounded-xl mt-2 hover:bg-[#0CA9A5] disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Creating Trip...
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" /> Generate Trip From Voice
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default VoiceTripAssistant;