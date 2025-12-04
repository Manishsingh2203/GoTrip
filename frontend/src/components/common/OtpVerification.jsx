import React, { useState, useEffect } from "react";
import { Mail, RotateCcw, ArrowLeft, CheckCircle, X } from "lucide-react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const OtpVerification = ({ email, onSubmit, onResend, loading, error, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(300); // 5 minutes

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp(otp.map((d, i) => (i === index ? element.value : d)));

    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) return;

    await onSubmit(otpValue);
  };

  const handleResendOtp = async () => {
    const result = await onResend();
    if (result?.success) {
      setCountdown(300);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 10;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-[999]">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#0CA9A5]/10 rounded-2xl flex items-center justify-center">
            <Mail className="h-8 w-8 text-[#1e599e]" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-center text-[#1e599e] mb-2">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-600">
          We've sent a verification code to
        </p>
        <p className="text-center text-[#1e599e] text-lg font-semibold mb-5">
          {email}
        </p>

        {error && <ErrorMessage message={error} />}

        {/* OTP inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target, index)}
                className="w-12 h-14 text-center text-xl font-semibold
                bg-white border border-gray-300 rounded-xl 
                focus:border-[#0CA9A5] focus:ring-2 focus:ring-[#0CA9A5]/20
                transition-all outline-none"
              />
            ))}
          </div>

          {/* Timer */}
          <p
            className={`text-center text-sm ${
              countdown === 0 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {countdown > 0
              ? `Code expires in ${Math.floor(countdown / 60)}:${(
                  countdown % 60
                )
                  .toString()
                  .padStart(2, "0")}`
              : "Code expired. Please resend"}
          </p>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6 || countdown === 0}
            className="w-full bg-[#1e599e] text-white py-3 rounded-xl font-semibold
             transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Verify & Continue
              </>
            )}
          </button>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={countdown > 250}
            className="w-full border border-[#1e599e]/30 text-[#1e599e] py-3 rounded-xl
            hover:bg[#1e599e]/5 transition flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
            Resend Code
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl
            hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
