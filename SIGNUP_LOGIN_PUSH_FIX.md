# Signup/Login & Push Notifications Fix Guide

## 🔍 Issues Identified

### 1. **Signup/Login Not Working**
**Possible Causes:**
- CORS issues (cookies not being set)
- Environment variables missing
- Backend errors
- Frontend not handling responses correctly

### 2. **Push Notifications Not Working**
**Possible Causes:**
- VAPID keys not set in frontend environment
- Service worker not registered
- Notification permission not granted
- Backend VAPID keys not configured

---

## 🔧 Fix 1: Signup/Login Issues

### Step 1: Check Browser Console

Open your Vercel site, press F12, and check for errors when signing up/logging in.

**Common Errors:**

#### Error: "Network Error" or CORS
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Already fixed in backend, but verify:
1. Go to Render → Backend → Environment
2. Check `CLIENT_URL` includes your Vercel URL
3. Redeploy backend

#### Error: "Invalid credentials" or "User not found"
**Solution:** User might not be created. Check backend logs.

#### Error: Cookies not being set
**Solution:** This is the most common issue!

---

### Step 2: Fix Cookie Issues (CRITICAL)

**Problem:** Vercel (HTTPS) cannot receive cookies from Render (HTTPS) due to SameSite policy.

**Solution:** Update backend cookie settings for production.

Add this to your Render backend environment variables:
```
NODE_ENV=production
COOKIE_DOMAIN=.vercel.app
```

Then update `backend/utils/generateTokens.js`:

```javascript
export const setAuthTokens = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // true in production
    sameSite: isProduction ? 'none' : 'strict', // 'none' for cross-origin
    path: '/',
    maxAge: 15 * 60 * 1000 // 15 minutes
  };

  const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
};
```

---

### Step 3: Alternative - Use localStorage Instead of Cookies

**Better for cross-origin:** Store tokens in localStorage instead of cookies.

Update `backend/controllers/authController.js`:

In `verifyEmail` and `login` functions, **remove** the `setAuthTokens` call and just return tokens in response:

```javascript
// Don't set cookies
// setAuthTokens(res, accessToken, refreshToken);

// Just return tokens in response
res.status(200).json({
  success: true,
  message: "Login successful",
  accessToken,  // Frontend will store this
  refreshToken, // Frontend will store this
  user: { ... }
});
```

Frontend already handles this correctly in `authService.ts`!

---

### Step 4: Test Signup Flow

1. **Go to your Vercel site**
2. **Click "Sign Up"**
3. **Fill the form** (all 3 steps)
4. **Check browser console** for errors
5. **Check Network tab** for API responses

**Expected Flow:**
1. POST `/api/auth/signup` → Returns `{ success: true, userId: "USR_000001" }`
2. Redirects to `/verify-email?userId=USR_000001`
3. Enter OTP from email (or check backend logs in development)
4. POST `/api/auth/verify-email` → Returns tokens
5. Redirects to dashboard

---

## 🔧 Fix 2: Push Notifications

### Step 1: Add VAPID Public Key to Vercel

1. **Go to Vercel Dashboard**
2. **Your Project → Settings → Environment Variables**
3. **Add:**
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BFn0RNQpQ6Ww85EyKWFD61qrUjvmBa1oBt5HNgeY3vawDQw4sZUp-NIhpaofQ-DamKouwc-XWFqYTBj_VEBf41s
   ```
4. **Redeploy**

### Step 2: Verify Service Worker

Check if `my-app/public/sw.js` exists and has this content:

```javascript
self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/badge.png',
    data: data.data || {},
    vibrate: [200, 100, 200],
    tag: 'notification-' + Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
```

### Step 3: Request Notification Permission

Add this to your dashboard or settings page:

```typescript
import { subscribePush } from '@/app/services/pushService';

const handleEnableNotifications = async () => {
  const success = await subscribePush();
  if (success) {
    alert('✅ Notifications enabled!');
  } else {
    alert('❌ Failed to enable notifications');
  }
};

// In your component
<Button onClick={handleEnableNotifications}>
  Enable Push Notifications
</Button>
```

### Step 4: Test Push Notifications

After enabling notifications, test from backend:

```bash
# Using curl
curl -X POST https://your-backend.onrender.com/api/push/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Or add a test button in your dashboard:

```typescript
import { testPushNotification } from '@/app/services/pushService';

const handleTestNotification = async () => {
  const success = await testPushNotification();
  if (success) {
    alert('✅ Test notification sent! Check your browser.');
  }
};
```

---

## 🧪 Complete Testing Checklist

### Signup Flow
- [ ] Fill signup form (all 3 steps)
- [ ] Click "Create Account"
- [ ] Check browser console for errors
- [ ] Check Network tab - POST `/api/auth/signup` returns 201
- [ ] Redirects to `/verify-email?userId=...`
- [ ] Enter OTP (check email or backend logs)
- [ ] POST `/api/auth/verify-email` returns 200 with tokens
- [ ] Tokens stored in localStorage
- [ ] Redirects to dashboard
- [ ] Dashboard loads user data

### Login Flow
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] Check browser console for errors
- [ ] POST `/api/auth/login` returns 200 with tokens
- [ ] Tokens stored in localStorage
- [ ] Redirects to dashboard
- [ ] Dashboard loads user data

### Push Notifications
- [ ] Click "Enable Notifications" button
- [ ] Browser asks for permission
- [ ] Grant permission
- [ ] Service worker registers
- [ ] Subscription sent to backend
- [ ] Test notification works
- [ ] Notification appears in browser

---

## 🐛 Debugging Commands

### Check Backend Logs (Render)
```
1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for signup/login attempts
```

### Check Frontend Console
```javascript
// In browser console on your Vercel site

// Check if API URL is correct
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Check if tokens are stored
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// Test API connection
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);

// Check service worker
navigator.serviceWorker.getRegistration()
  .then(reg => console.log('Service Worker:', reg));

// Check push subscription
navigator.serviceWorker.ready
  .then(reg => reg.pushManager.getSubscription())
  .then(sub => console.log('Push Subscription:', sub));
```

### Test Signup API Directly
```bash
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "test123",
    "city": "Mumbai",
    "vehicleType": "sedan",
    "vehicleMake": "Tesla",
    "vehicleModel": "Model 3",
    "vehicleYear": 2024,
    "batteryCapacity": 60,
    "registrationNumber": "MH01AB1234"
  }'
```

---

## 🔑 Quick Fixes Summary

### Issue: Signup returns 400/500 error
**Fix:** Check backend logs for specific error. Common issues:
- Duplicate email/phone/registration number
- Missing required fields
- MongoDB connection issue

### Issue: Login says "Invalid credentials"
**Fix:** 
- Verify email first (check OTP in email or backend logs)
- Make sure password is correct
- Check if user exists in MongoDB

### Issue: Tokens not being saved
**Fix:**
- Check if `accessToken` and `refreshToken` are in API response
- Check browser console for localStorage errors
- Verify `authService.ts` is storing tokens correctly

### Issue: Push notifications not working
**Fix:**
- Add `NEXT_PUBLIC_VAPID_PUBLIC_KEY` to Vercel env vars
- Check if service worker is registered
- Grant notification permission
- Verify VAPID keys match between frontend and backend

### Issue: "Network Error" on all requests
**Fix:**
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify backend is running on Render
- Check CORS configuration in backend

---

## 📋 Environment Variables Checklist

### Vercel (Frontend)
- [ ] `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY=BFn0RNQpQ6Ww85EyKWFD61qrUjvmBa1oBt5HNgeY3vawDQw4sZUp-NIhpaofQ-DamKouwc-XWFqYTBj_VEBf41s`

### Render (Backend)
- [ ] `NODE_ENV=production`
- [ ] `CLIENT_URL=https://your-vercel-app.vercel.app`
- [ ] `JWT_SECRET=<your-secret>`
- [ ] `JWT_REFRESH_SECRET=<your-secret>`
- [ ] `MONGO_URL=<your-mongodb-url>`
- [ ] `PUBLIC_VAPID_KEY=BFn0RNQpQ6Ww85EyKWFD61qrUjvmBa1oBt5HNgeY3vawDQw4sZUp-NIhpaofQ-DamKouwc-XWFqYTBj_VEBf41s`
- [ ] `PRIVATE_VAPID_KEY=Czs8rW20ALa1fYF80FU5vUM7wSJK0IHbwhgrUxNae3k`

---

## 🆘 Still Not Working?

### Provide This Information:

1. **Error Message:** (from browser console)
2. **Network Tab:** (screenshot of failed request)
3. **Backend Logs:** (from Render)
4. **Environment Variables:** (verify all are set)
5. **Test Results:** (which tests pass/fail from checklist)

### Common Solutions:

1. **Clear browser cache and cookies**
2. **Try in incognito mode**
3. **Redeploy both frontend and backend**
4. **Check MongoDB Atlas allows connections**
5. **Verify all environment variables are set**

---

**Last Updated:** February 6, 2026
