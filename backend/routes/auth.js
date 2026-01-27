import express from 'express';
import {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  resendOTP,
  verifyPhone,
  sendPhoneOTP,
  refreshToken,
  updateProfile,
  getCurrentUser,
  getPublicProfile,
  deleteAccount,
  updateSubscription,
  getWalletBalance,
  addWalletBalance
} from '../controllers/authController.js';
import { userAuth, optionalAuth } from '../middlewares/authMiddleware.js';
import {
  validateUserSignUp,
  validateUserLogin,
  validateOTPVerification,
  validatePasswordReset,
  validateResendOTP,
  validateForgotPassword,
  validateUpdateProfile,
  validateChangePassword,
  validateDeleteAccount,
  validateSendPhoneOTP,
  validateUpdateSubscription,
  validateAddWalletBalance
} from '../middlewares/validate.js';
import { wrapAsync } from '../middlewares/wrapAsync.js';
import User from '../models/User.js';
import ExpressError from '../middlewares/expressError.js';

const router = express.Router();

// User Registration
router.post('/signup', validateUserSignUp, wrapAsync(signup));

// Email Verification
router.post('/verify-email', validateOTPVerification, wrapAsync(verifyEmail));

// User Login
router.post('/login', validateUserLogin, wrapAsync(login));

// User Logout
router.post('/logout', userAuth, wrapAsync(logout));

// Forgot Password
router.post('/forgot-password', validateForgotPassword, wrapAsync(forgotPassword));

// Reset Password
router.post('/reset-password', validatePasswordReset, wrapAsync(resetPassword));

// Change Password
router.put('/change-password', userAuth, validateChangePassword, wrapAsync(changePassword));

// Resend OTP
router.post('/resend-otp', validateResendOTP, wrapAsync(resendOTP));

// Phone Verification
router.post('/verify-phone', validateOTPVerification, wrapAsync(verifyPhone));

// Send Phone OTP
router.post('/send-phone-otp', validateSendPhoneOTP, wrapAsync(sendPhoneOTP));

// Refresh Token
router.post('/refresh', wrapAsync(refreshToken));

// Get Current User Profile
router.get('/me', userAuth, wrapAsync(getCurrentUser));

// Get Public Profile
router.get('/profile/:userId', optionalAuth, wrapAsync(getPublicProfile));

// Update Profile
router.put('/profile', userAuth, validateUpdateProfile, wrapAsync(updateProfile));

// Delete Account
router.delete('/account', userAuth, validateDeleteAccount, wrapAsync(deleteAccount));

// Update Subscription
router.put('/subscription', userAuth, validateUpdateSubscription, wrapAsync(updateSubscription));

// Get Wallet Balance
router.get('/wallet', userAuth, wrapAsync(getWalletBalance));

// Add Wallet Balance
router.post('/wallet/add', userAuth, validateAddWalletBalance, wrapAsync(addWalletBalance));

export default router;