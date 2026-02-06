# Backend Connection Debugging Guide

## 🔍 Diagnose the Issue

### Step 1: Check if Backend is Running

Open your browser and visit your Render backend URL directly:
```
https://your-backend.onrender.com
```

**Expected Response:**
```json
{
  "message": "Voltix Backend API is running",
  "status": "healthy",
  "timestamp": "2026-02-06T...",
  "endpoints": { ... }
}
```

**If you see this** ✅ → Backend is running, go to Step 2
**If you see error** ❌ → Backend is down, go to "Backend Not Running" section

---

### Step 2: Check Health Endpoint

Visit:
```
https://your-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "Backend is running",
  "timestamp": "2026-02-06T...",
  "environment": "production"
}
```

**If you see this** ✅ → Backend API is working, go to Step 3
**If you see error** ❌ → Backend has issues, check Render logs

---

### Step 3: Check Vercel Environment Variable

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Settings" → "Environment Variables"
4. Check if `NEXT_PUBLIC_API_URL` is set

**Should be:**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**Common Mistakes:**
- ❌ Missing `https://`
- ❌ Extra `/` at the end
- ❌ Wrong URL
- ❌ Typo in domain name

**If wrong** → Fix it and redeploy Vercel

---

### Step 4: Check Browser Console

1. Open your Vercel site
2. Press F12 (DevTools)
3. Go to "Console" tab
4. Look for errors

**Common Errors:**

#### Error: "CORS policy blocked"
```
Access to XMLHttpRequest at 'https://backend...' from origin 'https://vercel...' 
has been blocked by CORS policy
```

**Solution:** Backend CORS not configured for your Vercel URL
→ Go to "Fix CORS Issues" section below

#### Error: "Network Error" or "Failed to fetch"
```
Error: Network Error
    at createError (axios.js:...)
```

**Possible Causes:**
1. Backend URL is wrong
2. Backend is down
3. CORS issue
4. SSL/HTTPS issue

**Solution:** Check Steps 1-3 again

#### Error: "ERR_NAME_NOT_RESOLVED"
```
net::ERR_NAME_NOT_RESOLVED
```

**Solution:** Backend URL is wrong or has typo
→ Check `NEXT_PUBLIC_API_URL` in Vercel

---

## 🔧 Fix CORS Issues

### Option 1: Update Backend Environment Variable (Recommended)

1. **Go to Render Dashboard**
2. **Click your backend service**
3. **Go to "Environment" tab**
4. **Add or update:**
   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```

5. **If you have multiple Vercel URLs, use comma-separated:**
   ```
   CLIENT_URL=https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-app-preview.vercel.app
   ```

6. **Save and Redeploy**

### Option 2: Allow All Origins (Development Only)

⚠️ **Not recommended for production!**

In Render, set:
```
NODE_ENV=development
```

This will allow all origins (already configured in the updated server.js)

---

## 🚨 Backend Not Running

### Check Render Logs

1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for errors

**Common Issues:**

#### MongoDB Connection Failed
```
MongoServerError: Authentication failed
```

**Solution:** Check `MONGO_URL` in Render environment variables

#### Redis Connection Failed
```
[ioredis] Unhandled error event: ECONNREFUSED
```

**Solution:** This is OK! Backend works without Redis (graceful fallback)

#### Port Binding Error
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Render should handle this automatically. Try redeploying.

#### Missing Environment Variables
```
Error: JWT_SECRET is not defined
```

**Solution:** Add missing environment variables in Render

---

## ✅ Complete Fix Checklist

### Backend (Render)

- [ ] Service is deployed and running
- [ ] Environment variables are set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGO_URL=<your-mongodb-url>`
  - [ ] `JWT_SECRET=<your-secret>`
  - [ ] `CLIENT_URL=<your-vercel-url>`
- [ ] Health endpoint works: `https://your-backend.onrender.com/api/health`
- [ ] No errors in logs

### Frontend (Vercel)

- [ ] Deployment successful
- [ ] Environment variable set:
  - [ ] `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- [ ] No trailing slash in URL
- [ ] Redeployed after adding env var

### Testing

- [ ] Backend root URL loads
- [ ] Backend health endpoint works
- [ ] Frontend loads without errors
- [ ] Browser console shows no CORS errors
- [ ] API calls work (test login/register)

---

## 🧪 Test API Connection

### From Browser Console

Open your Vercel site, press F12, go to Console tab, and run:

```javascript
// Test 1: Check API URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Test 2: Test fetch
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend response:', data))
  .catch(err => console.error('❌ Error:', err));

// Test 3: Test with credentials
fetch('https://your-backend.onrender.com/api/health', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(data => console.log('✅ With credentials:', data))
  .catch(err => console.error('❌ Error:', err));
```

### From Command Line

```bash
# Test backend directly
curl https://your-backend.onrender.com/api/health

# Test with verbose output
curl -v https://your-backend.onrender.com/api/health

# Test CORS
curl -H "Origin: https://your-vercel-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.onrender.com/api/health
```

---

## 📋 Quick Fixes Summary

### Issue: "Network Error"

**Most Common Cause:** Wrong backend URL

**Fix:**
1. Check Vercel env var: `NEXT_PUBLIC_API_URL`
2. Should be: `https://your-backend.onrender.com` (no trailing slash)
3. Redeploy Vercel after fixing

---

### Issue: "CORS Error"

**Most Common Cause:** Backend doesn't allow Vercel URL

**Fix:**
1. Go to Render → Backend → Environment
2. Set: `CLIENT_URL=https://your-vercel-app.vercel.app`
3. Redeploy backend

---

### Issue: "Backend Not Responding"

**Most Common Cause:** Backend crashed or sleeping (free tier)

**Fix:**
1. Check Render logs for errors
2. If free tier, first request takes 30-60 seconds
3. Try visiting backend URL directly to wake it up

---

## 🔍 Advanced Debugging

### Check Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Try to login or make API call
4. Click on the failed request
5. Check:
   - **Request URL**: Is it correct?
   - **Status Code**: What error code?
   - **Response**: What's the error message?
   - **Headers**: Are CORS headers present?

### Common Status Codes

- **0 or (failed)**: Network error, CORS issue, or backend down
- **404**: Endpoint not found (check URL)
- **500**: Backend error (check Render logs)
- **502/503**: Backend not responding (check if running)

---

## 💡 Pro Tips

### 1. Test Backend First
Always test backend directly before testing through frontend:
```
https://your-backend.onrender.com/api/health
```

### 2. Check Both URLs
Make sure both URLs are correct:
- Backend URL in Vercel env vars
- Frontend URL in Render env vars

### 3. Redeploy After Changes
After changing environment variables:
- Vercel: Redeploy from Deployments tab
- Render: Automatically redeploys

### 4. Clear Browser Cache
Sometimes browser caches old API URLs:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear cache in DevTools

### 5. Use Incognito Mode
Test in incognito to avoid cache issues

---

## 📞 Still Not Working?

### Provide This Information:

1. **Backend URL**: `https://your-backend.onrender.com`
2. **Frontend URL**: `https://your-vercel-app.vercel.app`
3. **Error Message**: (from browser console)
4. **Backend Logs**: (from Render)
5. **Network Tab**: (screenshot of failed request)

### Check These Files:

1. `backend/server.js` - CORS configuration
2. `my-app/app/config/api.ts` - API base URL
3. Vercel environment variables
4. Render environment variables

---

## ✅ Success Indicators

When everything works, you should see:

1. ✅ Backend URL loads with JSON response
2. ✅ Health endpoint returns "healthy"
3. ✅ No CORS errors in console
4. ✅ API calls succeed
5. ✅ Login/register works
6. ✅ Dashboard loads data

---

**Last Updated**: February 6, 2026
