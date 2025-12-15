# 🚀 Render Deployment Email Fix - SendGrid Integration

## Problem
On Render.com, Gmail SMTP connections timeout because port 465/587 are blocked:
```
Error: Connection timeout
Code: ETIMEDOUT
REASON: Connection timeout to SMTP server
```

## Solution
Use SendGrid API (port 443 - always allowed) instead of direct SMTP connections.

---

## ✅ What's Already Done

### Backend Updates (emailService.js)
1. **Port 587 TLS Support**: Gmail fallback now uses port 587 with TLS (instead of port 465 SSL)
2. **Enhanced Logging**: Clear initialization messages show which provider is active
3. **SendGrid Priority**: When SENDGRID_API_KEY is available, it's used as PRIMARY provider
4. **Intelligent Fallback**: If SendGrid fails, automatically tries Gmail; if Gmail fails, uses console mock

### Current Provider Priority
```
1️⃣  SendGrid API (recommended for Render)
2️⃣  Gmail SMTP port 587 TLS (local development)  
3️⃣  Console Mock (testing/debugging)
```

---

## 🔧 Setup Steps

### Step 1: Get SendGrid API Key
1. Go to [sendgrid.com](https://sendgrid.com) and sign up (free account available)
2. Go to Settings → [API Keys](https://app.sendgrid.com/settings/api_keys)
3. Click "Create API Key"
4. Name: `Shiksha-Mitra-Key` (or any name)
5. Select "Restricted Access"
6. Enable only: **Mail Send**
7. Click "Create & Copy"
8. Save the key: `SG.xxxxxxxxxxxxxxxxxxxx`

### Step 2: Add to Render Environment

#### Option A: Via Render Dashboard (Recommended)
1. Go to [render.com dashboard](https://dashboard.render.com)
2. Select your **Shiksha-Mitra** service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `SENDGRID_API_KEY`
   - **Value**: `SG.xxxxxxxxxxxxxxxxxxxx` (paste your full key)
6. Click **Save Changes**
7. Service will auto-redeploy

#### Option B: Via render.yaml (if using Infrastructure as Code)
```yaml
env:
  - key: SENDGRID_API_KEY
    value: SG.xxxxxxxxxxxxxxxxxxxx
```

### Step 3: Verify on Render
After deployment, check logs for:
```
📧 Email Service Initialization
================================
✅ SendGrid API Key: Configured
   🚀 PRIMARY PROVIDER (Render-compatible)
================================
```

---

## 🧪 Test the Setup

### Local Testing (Before Render)
```bash
cd server
npm test  # If you have tests

# Or manually test:
node -e "
const EmailService = require('./utils/emailService.js');
const service = new EmailService();
service.sendEmail(
  'test@example.com',
  'Test Email',
  '<p>This is a test email</p>'
);
"
```

### Render Testing (After Setup)
1. Go to your app: `https://shiksha-mitra.onrender.com` (or your URL)
2. Try signup → OTP should arrive in seconds
3. Check logs in Render dashboard for:
   - ✅ SendGrid: Email sent successfully!
   - Message ID confirmation

---

## 📝 Gmail Still Works (Locally)

The backend still supports Gmail SMTP for local development:
- Uses port 587 (TLS) - more compatible than port 465 (SSL)
- Automatically tries if SendGrid unavailable
- Works on localhost without network restrictions

**Local .env still needs:**
```env
MAIL_USER=your-gmail@gmail.com
MAIL_PASS=your-app-specific-password
```

---

## 🔍 Troubleshooting

### SendGrid API key not working?
```
Error: Invalid API key
```
- ✅ Check the key starts with `SG.`
- ✅ Verify it's copied completely (usually 70+ characters)
- ✅ Make sure it has "Mail Send" permission
- ✅ Check Render environment variable spelling: `SENDGRID_API_KEY`

### Still getting ETIMEDOUT on Render?
- ✅ Verify SendGrid API key is set in Render dashboard
- ✅ Check that service redeployed after adding the variable
- ✅ Try manual redeploy: Go to "Deploys" → "Deploy latest commit"

### SendGrid rate limiting?
```
Error: Rate limit exceeded
```
- Free tier: 100 emails per day
- Upgrade to Pro for unlimited emails

---

## 📊 Email Service Flow (After Setup)

```
User clicks "Send OTP"
    ↓
sendotp endpoint triggered
    ↓
OTP generated (e.g., 425902)
    ↓
EmailService.sendEmail() called
    ↓
Check provider:
  - If SENDGRID_API_KEY available → Use SendGrid API ✅
  - Else if MAIL_USER/MAIL_PASS available → Use Gmail SMTP on port 587
  - Else → Console mock (for testing)
    ↓
Email sent to user@example.com
    ↓
User receives OTP in inbox
    ↓
User enters OTP to complete signup
```

---

## 🎯 Expected Outcome

✅ OTP emails send successfully on Render
✅ Emails arrive in seconds (SendGrid is fast)
✅ No more `ETIMEDOUT` errors
✅ Works with any email provider (Gmail, Outlook, corporate email, etc.)
✅ Backend logs show clear provider status

---

## 📚 Reference Files Updated

- `server/utils/emailService.js` - Multi-provider email service
- `server/utils/mailSender.js` - Backward compatibility wrapper
- `server/controllers/Auth.js` - sendotp endpoint with logging
- `server/index.js` - Email service initialization

---

## 🚀 Next Steps

1. **Get SendGrid API Key** (2 minutes)
2. **Add to Render** (1 minute)  
3. **Redeploy** (auto-redeploys when you save env vars)
4. **Test signup** (verify OTP arrives)
5. **Done!** 🎉

Questions? Check logs in Render dashboard → Logs tab → filter for "Email Service"

---

**Status**: ✅ Ready for SendGrid setup
**Last Updated**: Just now
**Backend Version**: Multi-provider with port 587 support
