# Debug Signup/Login Issues - Step by Step

## 🔍 Step 1: Check Browser Console

1. Open your Vercel site
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to signup or login
5. **Copy ALL error messages** you see

### What to look for:
- ❌ Network errors
- ❌ CORS errors
- ❌ API URL errors
- ❌ Any red error messages

---

## 🔍 Step 2: Check Network Tab

1. Keep DevTools open (F12)
2. Go to **Network** tab
3. Try to signup or login
4. Look for the **POST** request to `/api/auth/signup` or `/api/auth/login`
5. Click on that request

### Check these details:

**Request URL:**
- Should be: `https://your-backend.onrender.com/api/auth/signup`
- Is it correct? ___________

**Status Code:**
- What status code? ___________
- 200 = Success
- 400 = Bad request
- 401 = Unauthorized
- 404 = Not found
- 500 = Server error
- (failed) = Network error

**Response:**
- Click on "Response" tab
- What does it say? ___________

**Headers:**
- Click on "Headers" tab
- Look for "Set-Cookie"
- Are cookies being set? ___________

---

## 🔍 Step 3: Check Environment Variables

### On Vercel:

1. Go to Vercel Dashboard
2. Your project → Settings → Environment Variables
3. Check if `NEXT_PUBLIC_API_URL` is set
4. What is the value? ___________

**Should be:**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**Common mistakes:**
- ❌ Missing `https://`
- ❌ Extra `/` at the end
- ❌ Wrong domain
- ❌ Not set at all

---

## 🔍 Step 4: Test Backend Directly

Open a new browser tab and visit:
```
https://your-backend.onrender.com/api/health
```

**What do you see?**
- ✅ JSON response with "healthy" → Backend is working
- ❌ Error page → Backend is down
- ❌ Nothing loads → Wrong URL

---

## 🔍 Step 5: Check Render Backend

1. Go to Render Dashboard
2. Click your backend service
3. Check if it's running (green dot)
4. Click "Logs" tab
5. Look for recent errors

**Is backend running?** ___________

---

## 🔍 Step 6: Test API Call Manually

Open browser console on your Vercel site and run:

```javascript
// Test 1: Check API URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test 2: Test backend connection
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend response:', data))
  .catch(err => console.error('❌ Error:', err));

// Test 3: Test signup API
fetch('https://your-backend.onrender.com/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+919876543210',
    password: 'test123',
    city: 'Mumbai',
    vehicleType: 'sedan',
    vehicleMake: 'Tesla',
    vehicleModel: 'Model 3',
    vehicleYear: 2024,
    batteryCapacity: 60,
    registrationNumber: 'MH01AB1234'
  })
})
  .then(r => r.json())
  .then(data => console.log('✅ Signup response:', data))
  .catch(err => console.error('❌ Signup error:', err));
```

**What are the results?** ___________

---

## 🔍 Step 7: Check CORS

In browser console, check the failed request headers:

```javascript
// Look for these in Network tab → Failed request → Headers
Access-Control-Allow-Origin: ?
Access-Control-Allow-Credentials: ?
```

**Are CORS headers present?** ___________

---

## 🔍 Step 8: Check Cookies

After trying to login:

1. Press F12 → Application tab
2. Go to Cookies → Your Vercel domain
3. Look for `accessToken` and `refreshToken`

**Are cookies set?** ___________

If NO cookies:
- CORS issue
- Backend not setting cookies
- SameSite issue

---

## 🔧 Quick Fixes to Try

### Fix 1: Clear Cache
1. Press Ctrl+Shift+Delete
2. Clear cookies and cache
3. Try again

### Fix 2: Try Incognito
1. Open incognito/private window
2. Go to your Vercel site
3. Try signup/login
4. Does it work? ___________

### Fix 3: Check Backend URL
Run this in browser console:
```javascript
localStorage.getItem('NEXT_PUBLIC_API_URL')
```

### Fix 4: Manually Set API URL
Run this in browser console:
```javascript
localStorage.setItem('apiUrl', 'https://your-backend.onrender.com');
```

---

## 📋 Information Needed

Please provide:

1. **Vercel URL**: ___________
2. **Backend URL**: ___________
3. **Error message from console**: ___________
4. **Status code from Network tab**: ___________
5. **Response from backend**: ___________
6. **Are cookies being set?**: ___________
7. **CORS headers present?**: ___________

---

## 🚨 Common Issues & Solutions

### Issue: "Network Error"
**Cause**: Backend URL is wrong or backend is down
**Solution**: 
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Test backend URL directly
- Check if backend is running on Render

### Issue: "CORS Error"
**Cause**: Backend doesn't allow your Vercel domain
**Solution**:
- Add Vercel URL to `CLIENT_URL` in Render
- Redeploy backend

### Issue: "401 Unauthorized"
**Cause**: Cookies not being sent
**Solution**:
- Check if cookies are set
- Verify `credentials: 'include'` in API calls
- Check SameSite cookie settings

### Issue: "400 Bad Request"
**Cause**: Invalid data being sent
**Solution**:
- Check request payload in Network tab
- Verify all required fields are present
- Check backend logs for validation errors

### Issue: Cookies not set
**Cause**: SameSite or CORS issue
**Solution**:
- Verify backend uses `sameSite: 'none'` in production
- Verify `secure: true` for HTTPS
- Check CORS allows credentials

---

## 🎯 Next Steps

Based on your answers above, I can provide specific fixes.

**Most likely issues:**
1. `NEXT_PUBLIC_API_URL` not set in Vercel
2. Backend `CLIENT_URL` doesn't include Vercel domain
3. Cookies not being set due to SameSite
4. Backend is down or crashed

---

**Please run through these steps and provide the information requested!**
