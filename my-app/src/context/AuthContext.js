import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Verify token with backend
        const userData = await authService.verifyToken();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Set user data
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        return { 
          success: true, 
          message: 'Registration successful. Please verify your email.',
          userId: response.data.userId 
        };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of backend response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);
      
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data.accessToken;
      } else {
        // Refresh failed, logout user
        logout();
        return null;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (userId, otp) => {
    try {
      setLoading(true);
      const response = await authService.verifyEmail(userId, otp);
      
      if (response.success) {
        // Auto-login after email verification
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Email verification failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);
      
      return { 
        success: response.success, 
        message: response.message || 'Password reset email sent' 
      };
    } catch (error) {
      console.error('Forgot password failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send reset email' 
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword(email, otp, newPassword);
      
      return { 
        success: response.success, 
        message: response.message || 'Password reset successful' 
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password reset failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};