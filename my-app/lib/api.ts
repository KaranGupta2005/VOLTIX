// API Configuration and Utility Functions for VOLTIX

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  error?: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, unknown> | object;
  headers?: Record<string, string>;
}

/**
 * Make an API request to the backend
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Important for cookies (JWT)
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
        error: data.error,
      };
    }

    return data;
  } catch (error) {
    console.error("API Request failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

// =============================================================================
// AUTH API FUNCTIONS
// =============================================================================

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  batteryCapacity: number;
  registrationNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  userId: string;
  profile: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    city: string;
  };
  vehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    batteryCapacity: number;
    registrationNumber: string;
  };
  subscription: {
    plan: string;
  };
  isEmailVerified: boolean;
}

/**
 * Register a new user
 */
export async function signup(data: SignupData): Promise<ApiResponse<User>> {
  // Transform frontend form data to match backend schema
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    city: data.city,
    vehicle: {
      type: data.vehicleType,
      make: data.vehicleMake,
      model: data.vehicleModel,
      year: data.vehicleYear,
      batteryCapacity: data.batteryCapacity,
      registrationNumber: data.registrationNumber,
    },
  };

  return apiRequest<User>("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

/**
 * Verify email with OTP
 */
export async function verifyEmail(
  email: string,
  otp: string,
): Promise<ApiResponse> {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: { email, otp },
  });
}

/**
 * Login user
 */
export async function login(data: LoginData): Promise<ApiResponse<User>> {
  return apiRequest<User>("/auth/login", {
    method: "POST",
    body: data,
  });
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse> {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiRequest<User>("/auth/me");
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<ApiResponse> {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

/**
 * Reset password with OTP
 */
export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
): Promise<ApiResponse> {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: { email, otp, newPassword },
  });
}

/**
 * Resend OTP
 */
export async function resendOTP(
  email: string,
  type: "email" | "password" | "phone" = "email",
): Promise<ApiResponse> {
  return apiRequest("/auth/resend-otp", {
    method: "POST",
    body: { email, type },
  });
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<ApiResponse> {
  return apiRequest("/auth/refresh", {
    method: "POST",
  });
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

/**
 * Check if the backend is running
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL.replace("/api", "")}/test`);
    return response.ok;
  } catch {
    return false;
  }
}

export { apiRequest, API_URL };
