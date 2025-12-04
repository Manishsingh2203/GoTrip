import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Plane, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useClerk, useSignIn } from "@clerk/clerk-react";
import ErrorMessage from "../components/common/ErrorMessage";
import OtpVerification from "../components/common/OtpVerification";

const Signup = ({ onClose, onSwitchLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/auth/auth1.jpg",
    "/auth/auth2.jpg",
    "/auth/auth3.jpg",
  ];

  useEffect(() => {
    const i = setInterval(
      () => setCurrentImage((p) => (p + 1) % images.length),
      3000
    );
    return () => clearInterval(i);
  }, []);

  const {
    register,
    authStep,
    pendingEmail,
    verifySignupOtp,
    resendOtp,
    cancelOtp,
    authError,
    loading,
  } = useAuth();

  const { signOut: clerkSignOut } = useClerk();
  const { signIn } = useSignIn();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const handleGoogle = async () => {
    await clerkSignOut();
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrlComplete: "/oauth/complete",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    if (result && result.success) {
      // OTP sent successfully, state will be handled by authStep
      console.log('Registration OTP sent to:', formData.email);
    }
  };

  const handleOtpSubmit = async (otp) => {
    const result = await verifySignupOtp(otp);
    if (result && result.success) {
      if (onClose) {
        onClose();
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <>
      {authStep === "signup-otp" && pendingEmail && (
        <OtpVerification
          email={pendingEmail}
          onSubmit={handleOtpSubmit}
          onResend={resendOtp}
          loading={loading}
          error={authError}
          onClose={cancelOtp}
        />
      )}

      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

        {/* MODAL */}
        <div className="bg-white rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl max-w-4xl w-full h-[650px] relative">

          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-800 shadow-sm"
          >
            <X className="h-6 w-6" />
          </button>

          {/* LEFT IMAGE */}
          <div className="relative hidden md:block h-full">
            <img
              src={images[currentImage]}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              alt="Travel"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute top-10 left-10 text-white">
              <h1 className="text-4xl font-bold">Join GoTrip AI</h1>
              <p className="w-64 mt-2 opacity-90">
                Start your personalized travel journey.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE FORM — scrollable */}
          <div className="px-8 sm:px-10 py-10 bg-gray-50 overflow-y-auto h-full">

            <div className="flex items-center justify-center mb-6">
              <Plane className="h-7 w-7 text-[#1e599e] mr-2" />
              <h1 className="text-3xl font-bold text-[#1e599e]">
                Create Account
              </h1>
            </div>

            {authError && <ErrorMessage message={authError} />}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="text-gray-600 text-sm font-medium">Full Name</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 bg-white">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full focus:outline-none bg-transparent text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-gray-600 text-sm font-medium">Email</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 bg-white">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full focus:outline-none bg-transparent text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-gray-600 text-sm font-medium">Password</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 relative bg-white">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full focus:outline-none bg-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-gray-600 text-sm font-medium">
                  Confirm Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 bg-white">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full focus:outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* SIGNUP BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-[#1e599e] text-white py-3 rounded-xl font-bold hover:bg-[#0CA9A5] transition shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "SIGN UP"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <button
                onClick={handleGoogle}
                type="button"
                disabled={loading}
                className="w-full max-w-[200px] py-2.5 border border-gray-300 flex items-center justify-center rounded-xl hover:bg-white bg-white shadow-sm gap-2 font-medium text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
            </div>

            <p className="text-center mt-3 text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={() => {
                  onSwitchLogin ? onSwitchLogin() : navigate("/login");
                }}
                className="text-[#1e599e] font-bold ml-1 cursor-pointer hover:underline"
              >
                Login
              </button>
            </p>

            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;