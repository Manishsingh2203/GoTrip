import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/authAPI";
import { useClerk } from "@clerk/clerk-react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { signOut: clerkSignOut } = useClerk();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gotrip_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authStep, setAuthStep] = useState(null); // "login-otp" | "signup-otp"
  const [pendingEmail, setPendingEmail] = useState(null);

  // ------------------------------------------------
  // INITIAL LOAD (Check logged-in user)
  // ------------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const res = await authAPI.getMe();
        if (res?.data?.data) {
          setUser(res.data.data);
          localStorage.setItem("gotrip_user", JSON.stringify(res.data.data));
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  // ------------------------------------------------
  // REGISTER
  // ------------------------------------------------
  const register = async (payload) => {
    try {
      setAuthError(null);
      const res = await authAPI.register(payload);

      const email = res?.data?.data?.email || payload.email;
      setPendingEmail(email);
      setAuthStep("signup-otp");

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------
  // SIGNUP OTP VERIFY
  // ------------------------------------------------
  const verifySignupOtp = async (otp) => {
    try {
      const res = await authAPI.verifyOtp({ email: pendingEmail, otp });
      const userData = res?.data?.data;

      setUser(userData);
      localStorage.setItem("gotrip_user", JSON.stringify(userData));

      setPendingEmail(null);
      setAuthStep(null);

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------
  // LOGIN
  // ------------------------------------------------
  const login = async ({ email, password }) => {
    try {
      setAuthError(null);

      // PASSWORD LOGIN
      if (password) {
        const res = await authAPI.login({ email, password });
        const userData = res?.data?.data;

        setUser(userData);
        localStorage.setItem("gotrip_user", JSON.stringify(userData));

        return { success: true };
      }

      // OTP LOGIN
      const res = await authAPI.login({ email });

      setPendingEmail(res?.data?.data?.email || email);
      setAuthStep("login-otp");

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------
  // LOGIN OTP VERIFY
  // ------------------------------------------------
  const verifyLoginOtp = async (otp) => {
    try {
      const res = await authAPI.verifyLoginOtp({ email: pendingEmail, otp });
      const userData = res?.data?.data;

      setUser(userData);
      localStorage.setItem("gotrip_user", JSON.stringify(userData));

      setPendingEmail(null);
      setAuthStep(null);

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------
  // RESEND OTP
  // ------------------------------------------------
  const resendOtp = async () => {
    try {
      const purpose = authStep === "login-otp" ? "login" : "verification";
      await authAPI.resendOtp({ email: pendingEmail, purpose });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------
  // CANCEL OTP (Go back to login/signup form)
  // ------------------------------------------------
  const cancelOtp = () => {
    setAuthStep(null);
    setPendingEmail(null);
    setAuthError(null);
  };

  // ------------------------------------------------
  // CLERK SOCIAL LOGIN
  // ------------------------------------------------
 const clerkSocialLogin = async (payload) => {
  try {
    const res = await authAPI.clerkSocialLogin(payload);

    const data = res?.data?.data;
    setUser(data);
    localStorage.setItem("gotrip_user", JSON.stringify(data));

    return { success: true };
  } catch (err) {
    console.log("SOCIAL LOGIN ERROR:", err.response?.data);
    const msg = err.response?.data?.message || "Social login failed";
    return { success: false, message: msg };
  }
};


  // ------------------------------------------------
  // LOGOUT (Backend + Clerk)
  // ------------------------------------------------
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {}

    try {
      await clerkSignOut();
    } catch {}

    localStorage.removeItem("gotrip_user");
    setUser(null);
    setAuthStep(null);
    setPendingEmail(null);
  };

  // ------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        authError,
        authStep,
        pendingEmail,

        register,
        login,
        verifySignupOtp,
        verifyLoginOtp,
        resendOtp,
        cancelOtp,
        clerkSocialLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
