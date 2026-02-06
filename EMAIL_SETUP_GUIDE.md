# Email OTP Setup Guide

## 🔧 Current Status

OTP emails are **not working** because Gmail requires an **App Password**, not your regular Gmail password.

## ✅ How to Fix Email OTP

### Step 1: Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. **App name**: Enter "EV Copilot Backend"
4. Click **"Create"**
5. Copy the **16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update Render Environment Variables

1. Go to **Render.com**
2. Open your backend service
3. Go to **"Environment"** tab
4. Update these variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  (the 16-char app password, no spaces)
```

5. Click **"Save Changes"**
6. Backend will auto-redeploy

### Step 3: Test

After redeployment:
1. Try signup on your Vercel site
2. OTP should arrive in email within 30 seconds
3. If not, check Render logs - OTP is always printed there

---

## 🔍 Troubleshooting

### Issue: "Invalid credentials" error in logs

**Cause**: App Password is wrong or has spaces

**Solution**: 
- Copy app password again (remove all spaces)
- Should be exactly 16 characters
- Update in Render and redeploy

### Issue: "Less secure app access" error

**Cause**: Using regular password instead of App Password

**Solution**: 
- Generate App Password (see Step 1)
- Don't use your regular Gmail password

### Issue: Email still not arriving

**Check**:
1. Render logs show: `✅ OTP email sent successfully`
2. Check spam folder
3. Verify email address is correct
4. Try different email provider (not Gmail)

---

## 📧 Alternative: Use Different Email Service

If Gmail doesn't work, you can use:

### Option 1: SendGrid (Recommended for Production)

```javascript
// In backend/services/otpService.js
this.transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

**Environment Variables:**
```
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Option 2: AWS SES

```javascript
this.transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASSWORD
  }
});
```

### Option 3: Mailgun

```javascript
this.transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  }
});
```

---

## 🎯 Current Fallback

**Even if email fails, OTP is ALWAYS logged to Render console!**

Users can:
1. Signup
2. Check Render logs for OTP
3. Enter OTP to verify

This ensures signup always works, even without email.

---

## ✅ Verification Checklist

After setting up App Password:

- [ ] Generated Gmail App Password
- [ ] Updated `EMAIL_PASSWORD` in Render
- [ ] Backend redeployed
- [ ] Render logs show: `✅ Mailer ready to send emails`
- [ ] Test signup
- [ ] OTP arrives in email
- [ ] Can verify and login

---

## 📝 Environment Variables Summary

**Required for Email:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=EV Copilot <noreply@evcopilot.com>
```

**Optional:**
```
EMAIL_SERVICE=gmail  (default)
NODE_ENV=production
```

---

## 🔐 Security Notes

1. **Never commit** email passwords to Git
2. **Use App Passwords** not regular passwords
3. **Rotate passwords** regularly
4. **Use environment variables** only
5. **Consider SendGrid/SES** for production

---

## 💡 Pro Tips

### Tip 1: Test Email Service

Add this test endpoint to check if email works:

```javascript
// backend/routes/test.js
router.post('/test-email', async (req, res) => {
  const { email } = req.body;
  try {
    await otpService.generateAndSendOTP('TEST_USER', email, 'email_verification');
    res.json({ success: true, message: 'Test email sent' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
```

### Tip 2: Monitor Email Delivery

Check Render logs after each signup:
- `✅ OTP email sent successfully` = Working
- `❌ OTP email failed` = Check credentials

### Tip 3: Backup Plan

Always keep OTP console logging enabled as backup:
```javascript
console.log("OTP:", otp);  // Always log for backup
```

---

**Last Updated**: February 6, 2026
