# OTP & Demo Agents Fix Guide

## 📧 Issue 1: OTP Not Coming

### Why OTP Email Doesn't Work:
- Gmail SMTP requires "App Password" (not regular password)
- Production email service may be blocked
- Email credentials might be wrong

### ✅ Solution: Get OTP from Backend Logs

**OTP is ALWAYS printed in backend logs!**

#### Steps:
1. Go to **Render.com**
2. Click your backend service
3. Click **"Logs"** tab
4. After signup, search for: `"OTP"` or `"DEV MODE"`
5. You'll see:

```
========================================
🔐 DEV MODE - OTP GENERATED
   User ID: USR_000001
   Email: test@example.com
   Type: email_verification
   OTP: 123456
========================================
```

6. Copy the 6-digit OTP
7. Enter it on verify-email page

---

## 🤖 Issue 2: Demo Agents Not Working

### Why Demo Not Working:
1. **WebSocket not connected** to backend
2. **Socket.IO URL wrong**
3. **CORS blocking WebSocket**

### ✅ Check WebSocket Connection

Open browser console (F12) and run:

```javascript
// Check if socket is connected
import { getSocket } from '@/app/config/socket';
const socket = getSocket();
console.log('Socket connected:', socket?.connected);
console.log('Socket ID:', socket?.id);
```

### ✅ Fix WebSocket Connection

The socket config should use the backend URL:

**File**: `my-app/app/config/socket.ts`

```typescript
export const connectSocket = (): Socket => {
  if (!socket) {
    // Use API URL for socket connection
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};
```

---

## 🧪 Test Demo Manually

### Test 1: Check Demo Endpoint

```bash
curl -X POST https://your-backend.onrender.com/api/demo/mechanic/self-healing \
  -H "Content-Type: application/json" \
  -d '{"stationId": "ST001", "faultType": "protocol_timeout"}'
```

**Expected**: JSON response with demo steps

### Test 2: Check WebSocket from Frontend

```javascript
// In browser console on your Vercel site
import { io } from 'socket.io-client';

const socket = io('https://your-backend.onrender.com', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Socket connected!', socket.id);
});

socket.on('agent_activity', (data) => {
  console.log('🤖 Agent activity:', data);
});

socket.on('notification', (data) => {
  console.log('🔔 Notification:', data);
});

socket.connect();
```

---

## 🔧 Complete Fix Steps

### Step 1: Update Socket Config

Make sure `my-app/app/config/socket.ts` uses `NEXT_PUBLIC_API_URL`:

```typescript
const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
socket = io(socketUrl, { ... });
```

### Step 2: Verify Environment Variable

In Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Step 3: Check Backend CORS for WebSocket

Backend should allow WebSocket connections from Vercel.

In Render → Backend → Environment:
```
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Step 4: Test Demo

1. Login to dashboard
2. Go to Agents page
3. Click "Run Demo"
4. Watch for:
   - Agent activity updates
   - Notifications
   - Step-by-step progress

---

## 🎯 Expected Demo Flow

### Self-Healing Demo:

1. **Step 1**: Fault detected (⚠️ warning notification)
2. **Step 2**: Analyzing fault
3. **Step 3**: Decision made (auto-healing initiated)
4. **Step 4**: Auto-healing in progress
5. **Step 5**: Self-healed or escalated
6. **Step 6**: Blockchain audit complete

### Traffic Incentive Demo:

1. **Step 1**: Congestion detected
2. **Step 2**: Analyzing demand
3. **Step 3**: Incentive calculated
4. **Step 4**: Minting coupons
5. **Step 5**: Acceptance tracked
6. **Step 6**: Blockchain audit

---

## 🐛 Debugging

### Check 1: Backend Logs

After clicking "Run Demo", check Render logs for:
```
🔧 === SELF-HEALING AGENT DEMO ===
📍 Station: ST001
⚠️ Fault Type: PROTOCOL_TIMEOUT
```

### Check 2: Network Tab

In browser DevTools → Network tab:
- Look for WebSocket connection (ws:// or wss://)
- Should show "101 Switching Protocols"
- Check for socket.io messages

### Check 3: Console Errors

Look for:
- ❌ "Socket connection failed"
- ❌ "CORS error"
- ❌ "Failed to fetch"

---

## 📋 Quick Checklist

### For OTP:
- [ ] Signup successful (returns userId)
- [ ] Check Render backend logs
- [ ] Search for "OTP" in logs
- [ ] Copy 6-digit code
- [ ] Enter on verify-email page

### For Demo:
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Socket connects to backend URL
- [ ] Backend allows WebSocket from Vercel
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Click "Run Demo"
- [ ] Watch for notifications

---

## 💡 Pro Tips

### Tip 1: Keep Render Logs Open
While testing, keep Render logs open in another tab to see real-time OTPs and demo activity.

### Tip 2: Use Browser Console
Monitor WebSocket connection and events in real-time:
```javascript
socket.on('connect', () => console.log('Connected'));
socket.on('agent_activity', console.log);
socket.on('notification', console.log);
```

### Tip 3: Test Backend First
Always test backend endpoints directly before testing through frontend.

---

## 🆘 Still Not Working?

### For OTP:
If OTP not in logs, backend might have crashed during signup. Check:
1. Render logs for errors
2. MongoDB connection
3. Email service errors (should be graceful)

### For Demo:
If demo not working:
1. Check if WebSocket connected
2. Test demo endpoint with curl
3. Check CORS settings
4. Verify socket.io version compatibility

---

**Last Updated**: February 6, 2026
