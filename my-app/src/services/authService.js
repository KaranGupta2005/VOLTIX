import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session management
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          });

          if (response.data.success) {
            const newAccessToken = response.data.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // User Registration
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User Login
  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User Logout
  async logout() {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh Access Token
  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/api/auth/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify Token (check if user is still authenticated)
  async verifyToken() {
    try {
      const response = await api.get('/api/auth/verify');
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  },

  // Email Verification
  async verifyEmail(userId, otp) {
    try {
      const response = await api.post('/api/auth/verify-email', {
        userId,
        otp
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resend OTP
  async resendOTP(userId, type = 'email_verification') {
    try {
      const response = await api.post('/api/auth/resend-otp', {
        userId,
        type
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot Password
  async forgotPassword(email) {
    try {
      const response = await api.post('/api/auth/forgot-password', {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset Password
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await api.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update User Profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change Password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete Account
  async deleteAccount(password) {
    try {
      const response = await api.delete('/api/auth/account', {
        data: { password }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get User Profile
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send Phone OTP
  async sendPhoneOTP(userId) {
    try {
      const response = await api.post('/api/auth/send-phone-otp', {
        userId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify Phone OTP
  async verifyPhoneOTP(userId, otp) {
    try {
      const response = await api.post('/api/auth/verify-phone', {
        userId,
        otp
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export the configured axios instance for other services
export { api };