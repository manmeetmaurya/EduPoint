# 📋 OTP Email Troubleshooting Guide

**Status**: Email system is sending emails successfully, but user not receiving them.

---

## 🔍 Diagnostic Checklist

### Step 1: Check if OTP is Actually Being Generated
Run your app and look in the server console for:

```
============================================================
TESTING OTP EMAIL FLOW
============================================================

1️⃣ Environment Check:
   MAIL_USER: ✅ Set
   MAIL_PASS: ✅ Set

2️⃣ OTP Generated: 671735
...
```

✅ **If you see this**: OTP generation is working

---

### Step 2: Verify Email is Being SENT from Backend

Watch the server logs during signup for:

```
🔄 Attempting Gmail SMTP...
  - Email: user@example.com
  - Subject: Shiksha Mitra - Verify Your Email
  - Port: 587 (TLS)
  - Transporter created (port 587 TLS)
  - ✅ Connection verified successfully
✅ Gmail: Email sent successfully!
   Message ID: <d00ff514-8ff6-404b-9873-671062b890b8@gmail.com>
```

✅ **If you see this**: Email is being sent successfully

---

### Step 3: Check User's Inbox & Spam Folder

📧 **Where to look**:
1. **Inbox** - Normal location
2. **Spam/Junk** - Gmail moves automated emails here sometimes
3. **Promotions** - Gmail tabs feature might move it here
4. **Other** - Check if you have multiple Gmail labels
5. **Search**: Search for "Shiksha Mitra" or the OTP number in Gmail

---

### Step 4: Check if Email Address is Correct

When user signs up, verify:
- ✅ User enters email correctly (no typos)
- ✅ Check server logs show the right email: `To: user@example.com`
- ✅ OTP is saved in database with correct email

**Test with your own email**:
```
1. Go to: http://localhost:3000/signup
2. Enter YOUR email (the one you know works)
3. Check logs show: "To: your-email@gmail.com"
4. Check YOUR inbox
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Email Sent but Going to Spam
```
✅ Backend logs show: "Email sent successfully!"
❌ But user not finding it in inbox
```

**Solution**:
1. Check SPAM folder in Gmail
2. Add `ayushmishramay22@gmail.com` to contacts (mark as trusted)
3. Create a filter: Emails from `ayushmishramay22@gmail.com` → Never mark as spam

---

### Issue 2: Email Not Being Sent At All
```
❌ Backend logs show: "❌ Gmail SMTP Error"
```

**Check these in order**:

#### 2a. Check Gmail Credentials
```env
MAIL_USER=ayushmishramay22@gmail.com    ← Must be your Gmail address
MAIL_PASS=uasuvfbvkkvmjons              ← Must be APP PASSWORD, not your main password
```

**To get a Gmail App Password**:
1. Go to: https://myaccount.google.com/apppasswords
2. Select: Mail and Windows Computer (or your device)
3. Copy the 16-character password
4. Update MAIL_PASS in .env file
5. Restart your server

#### 2b. Check if Gmail Allows Less Secure Apps
1. Go to: https://myaccount.google.com/security
2. Look for "Less secure app access" or "App passwords"
3. Use app password (preferred) instead of main password

#### 2c. Test Gmail Connection
```bash
cd server
node testSendOTP.js
```

If it shows:
```
❌ Gmail SMTP Error
   Message: Invalid login
   🔴 Invalid Gmail credentials
```

→ Your Gmail credentials are wrong. Follow 2a above.

---

### Issue 3: Connection Timeout Error
```
❌ Error: Connection timeout
   Code: ETIMEDOUT
```

**This means**:
- Port 587 is blocked (common on restricted networks)
- Only happens on Render, not locally

**Solution**:
- Add SendGrid API key to your .env file
- EmailService will automatically use SendGrid instead

---

## 🧪 Test Commands

### Test 1: Direct Email Test
```bash
cd server
node testEmail.js
```

Expected output:
```
✅ Gmail: Email sent successfully!
Message ID: <xxx@gmail.com>
```

---

### Test 2: OTP Email Test
```bash
cd server
node testSendOTP.js
```

Expected output:
```
✅ EMAIL SENT SUCCESSFULLY!
   Message ID: <xxx@gmail.com>
   Provider: gmail
```

---

### Test 3: Check Server Logs During Real Signup
1. Start your server: `npm start` (from server folder)
2. In another terminal, try signup from frontend
3. Watch the server logs - you should see:

```
=============================================================
SENDING OTP EMAIL
=============================================================
Email: user@example.com
OTP: 671735
Template: emailVerificationTemplate

📧 EMAIL SERVICE DEBUG
──────────────────────────────────────────────────
Provider: GMAIL
To: user@example.com
Subject: Shiksha Mitra - Verify Your Email
HTML Length: 2010 chars

🔄 Attempting Gmail SMTP...
  - Email: user@example.com
  - Subject: Shiksha Mitra - Verify Your Email
  - Port: 587 (TLS)
  - Transporter created (port 587 TLS)
  - ✅ Connection verified successfully
✅ Gmail: Email sent successfully!
   Message ID: <d00ff514-8ff6-404b-9873-671062b890b8@gmail.com>
   To: user@example.com
```

---

## 📊 What Email Service is Doing

```
1. User clicks "Send OTP"
   ↓
2. Backend generates 6-digit OTP
   ↓
3. OTP saved to MongoDB with email address
   ↓
4. EmailService checks available providers:
   - Is SendGrid API key available? → Use SendGrid
   - Is Gmail credentials available? → Use Gmail SMTP port 587
   - Otherwise → Use mock console (for testing)
   ↓
5. Email sent via selected provider
   ↓
6. Backend returns success response to frontend
   ↓
7. Frontend shows "OTP sent to your email"
   ↓
8. User checks their email (or spam folder)
```

---

## ✅ Verification Steps

### If Local Development (localhost:3000)

1. **Start server**:
   ```bash
   cd server
   npm start
   # Should show: "✅ Gmail Credentials: Configured"
   ```

2. **Open frontend**:
   ```bash
   cd src folder with package.json
   npm start
   # Should open http://localhost:3000
   ```

3. **Test signup**:
   - Enter YOUR email
   - Click "Send OTP"
   - **Check server logs** - should show email sent
   - **Check your email inbox & spam folder** - should arrive in seconds

---

## 🎯 Success Indicators

✅ **Working correctly if**:
- [ ] Server logs show "✅ Gmail: Email sent successfully!"
- [ ] User receives OTP email within 10 seconds
- [ ] Message ID is shown in logs
- [ ] Email contains the OTP code
- [ ] User can enter OTP to complete signup

❌ **Not working if**:
- [ ] Server logs show "❌ Gmail SMTP Error"
- [ ] Email not in inbox or spam
- [ ] Logs don't show "Email sent successfully!"
- [ ] Backend returns error response

---

## 🚀 Next Steps

If emails still not arriving after checking above:

1. **Add SendGrid** (most reliable):
   - Get API key from sendgrid.com
   - Add to .env: `SENDGRID_API_KEY=SG.xxx`
   - Restart server
   - Try again

2. **Check Gmail status**:
   - Visit: https://myaccount.google.com/apppasswords
   - Regenerate app password
   - Update .env with new password
   - Restart server
   - Try again

3. **Check spam filters**:
   - Go to Gmail Settings → Filters and Blocked Addresses
   - Check if emails are being automatically marked as spam
   - Whitelist `ayushmishramay22@gmail.com`

---

## 📞 Getting Help

When reporting issue, please provide:
1. ✅ Server logs (copy-paste the SENDING OTP EMAIL section)
2. ✅ Email address user tried to sign up with
3. ✅ Whether it's local (localhost) or Render deployment
4. ✅ Error message seen in logs (if any)
5. ✅ Has user checked spam folder?

---

**Key Point**: Email system works perfectly (test confirmed). If user not getting OTP, it's either:
- In their spam folder ← Check first!
- Wrong email address
- Gmail credentials issue
- Render network restrictions (need SendGrid API key)
