import * as authService from "../app/services/authService";

// Re-export auth functions
export const login = authService.login;
export const signup = authService.signup;
export const verifyEmail = authService.verifyEmail;
export const logout = authService.logout;
export const getMe = authService.getMe;

// Export types
export type SignupData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  vehicleType?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  batteryCapacity: number;
  registrationNumber: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user?: any;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
};