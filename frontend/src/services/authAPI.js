import api from "./api";

export const authAPI = {
  register: (data) => api.post('/auth/register', data, { withCredentials: true }),
  login: (data) => api.post('/auth/login', data, { withCredentials: true }),
  getMe: () => api.get('/auth/me', { withCredentials: true }),
  verifyOtp: (data) => api.post('/auth/verify-otp', data, { withCredentials: true }),
  verifyLoginOtp: (data) => api.post('/auth/verify-login-otp', data, { withCredentials: true }),
  logout: () => api.post('/auth/logout', {}, { withCredentials: true }),
  resendOtp: (data) => api.post('/auth/resend-otp', data, { withCredentials: true }),

  // GOOGLE LOGIN (Old flow)
  googleLogin: (token) => api.post('/auth/google', { token }, { withCredentials: true }),

  // FACEBOOK LOGIN (Old flow)
  facebookLogin: (accessToken) =>
    api.post('/auth/facebook', { accessToken }, { withCredentials: true }),

  // ⭐ REQUIRED FOR CLERK LOGIN ⭐
  clerkSocialLogin: (data) =>
    api.post('/auth/clerk-social-login', data, { withCredentials: true }),
};
