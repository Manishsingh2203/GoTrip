import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Plane, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useClerk, useSignIn } from "@clerk/clerk-react";
import ErrorMessage from "../components/common/ErrorMessage";
import OtpVerification from "../components/common/OtpVerification";

const Login = ({ onClose, onSwitchSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordLogin, setIsPasswordLogin] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/auth/auth1.jpg",
    "/auth/auth2.jpg",
    "/auth/auth3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((p) => (p + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const {
    login,
    authStep,
    pendingEmail,
    verifyLoginOtp,
    resendOtp,
    cancelOtp,
    authError,
    loading,
  } = useAuth();

  const { signOut: clerkSignOut } = useClerk();
  const { signIn } = useSignIn();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleGoogle = async () => {
    await clerkSignOut();
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrlComplete: "/oauth/complete",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPasswordLogin) {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      
      if (result && result.success) {
        if (onClose) {
          onClose();
        } else {
          navigate("/", { replace: true });
        }
      }
      return;
    }

    // OTP login
    const result = await login({ email: formData.email });
    if (result && result.success) {
      // OTP sent successfully, state will be handled by authStep
      console.log('OTP sent to:', formData.email);
    }
  };

  const handleOtpSubmit = async (otp) => {
    const result = await verifyLoginOtp(otp);
    if (result && result.success) {
      if (onClose) {
        onClose();
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  // Clear form when switching between password/OTP login
  useEffect(() => {
    setFormData({ email: "", password: "" });
  }, [isPasswordLogin]);

  return (
    <>
      {/* OTP MODAL */}
      {authStep === "login-otp" && pendingEmail && (
        <OtpVerification
          email={pendingEmail}
          onSubmit={handleOtpSubmit}
          onResend={resendOtp}
          loading={loading}
          error={authError}
          onClose={cancelOtp}
        />
      )}

      {/* POPUP MODAL OVERLAY */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        
        {/* POPUP CARD CONTAINER */}
        <div className="bg-white rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl max-w-4xl w-full h-[650px] max-h-[650px] relative">
          
          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-all shadow-sm"
          >
            <X className="h-6 w-6" />
          </button>

          {/* LEFT IMAGE */}
          <div className="relative hidden md:block h-full">
            <img
              src={images[currentImage]}
              alt="Travel"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute top-10 left-10 text-white z-10">
              <h1 className="text-4xl font-bold drop-shadow-lg">GoTrip AI</h1>
              <p className="w-64 mt-2 opacity-90 drop-shadow-md">
                AI-powered travel companion for smarter journeys.
              </p>
            </div>
          </div>

          {/* RIGHT FORM (Scrollable) */}
          <div className="px-8 sm:px-10 py-12 flex flex-col justify-start bg-gray-50 relative overflow-y-auto h-full">
            
            <div className="flex items-center justify-center mb-6 mt-4">
              <Plane className="h-7 w-7 text-[#1e599e] mr-2" />
              <h1 className="text-3xl font-bold text-[#1e599e]">Welcome Back</h1>
            </div>

            <p className="text-center text-gray-500 mb-8">Login with Email</p>

            {authError && <ErrorMessage message={authError} />}

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <label className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 mb-4 bg-white">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent"
                  placeholder="name@example.com"
                />
              </div>

              {/* PASSWORD */}
              {isPasswordLogin && (
                <>
                  <label className="block text-gray-600 font-medium mb-1">
                    Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 relative mb-4 bg-white">
                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full focus:outline-none bg-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </>
              )}

              <button
                disabled={loading}
                className="w-full bg-[#1e599e] text-white py-3 rounded-xl font-bold hover:bg-[#1e599e] transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading 
                  ? (isPasswordLogin ? "Logging in..." : "Sending OTP...") 
                  : (isPasswordLogin ? "LOGIN" : "SEND OTP")
                }
              </button>
            </form>

              <button
              type="button"
              disabled={loading}
              className="w-full text-center text-[#1e599e] cursor-pointer mt-6 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsPasswordLogin(!isPasswordLogin)}
            >
              {isPasswordLogin
                ? "Login with OTP instead"
                : "Login with Password"}
            </button>


            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500"></span>
              </div>
            </div>
{/*  

<div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleGoogle}
                type="button"
                disabled={loading}
                className="w-full max-w-[200px] py-2.5 border border-gray-300 flex items-center justify-center rounded-xl hover:bg-white transition bg-white shadow-sm gap-2 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
*/}
            <p className="text-center mt-8 text-gray-600">
              Don't have an account?
              <button
                type="button"
                onClick={() => {
                  onSwitchSignup ? onSwitchSignup() : navigate("/signup");
                }}
                className="text-[#1e599e] font-bold ml-1 hover:underline"
              >
                Sign Up
              </button>
            </p>
            
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;