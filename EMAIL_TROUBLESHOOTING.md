# Email Sending Troubleshooting Guide

## Problem: OTP is Created but Email Not Received

### Quick Diagnosis

When you try to signup, the OTP is created successfully but user doesn't receive email. Here's how to diagnose:

## Step 1: Check Server Logs

Start your backend server and attempt signup. Look for logs with these keywords:

```
📧 EMAIL SERVICE DEBUG
Provider: SENDGRID | GMAIL | MOCK
To: user@example.com
Subject: Shiksha Mitra - Verify Your Email
```

### If you see Provider: MOCK ❌

This means no email provider is configured!
- **Issue**: SENDGRID_API_KEY and Gmail credentials not set
- **Solution**: See setup instructions below

### If you see Provider: SENDGRID ✓

Email should be sent via SendGrid
- **Issue**: Check SendGrid API key validity
- **Solution**: Test the API key

### If you see Provider: GMAIL ✓

Email should be sent via Gmail SMTP
- **Issue**: May still fail due to network restrictions or wrong credentials
- **Solution**: Check credentials

## Step 2: Look for Error Messages

### Error: Connection timeout (ETIMEDOUT)

```
❌ EMAIL SENDING FAILED
Error: Connection timeout
Code: ETIMEDOUT
```

**Cause**: Port 465 is blocked on your network (common on Render)

**Solutions**:
1. **Use SendGrid** (recommended for Render)
2. Check Gmail account settings
3. Try port 587 with TLS

### Error: Invalid login credentials

```
❌ EMAIL SENDING FAILED
Error: Invalid login credentials
```

**Causes**:
1. Wrong MAIL_PASS (using regular password instead of app password)
2. Wrong MAIL_USER
3. Gmail account doesn't have 2-Step Verification

**Solutions**:
1. Generate Gmail App Password from https://myaccount.google.com/apppasswords
2. Ensure 2-Step Verification is enabled
3. Use the 16-character app password

### Error: Credentials invalid

```
❌ EMAIL SENDING FAILED
Error: Invalid SENDGRID_API_KEY
```

**Cause**: SendGrid API key is incorrect or invalid

**Solutions**:
1. Regenerate API key from SendGrid dashboard
2. Verify the key starts with `SG.`
3. Check for copy-paste errors (no extra spaces)

## Step 3: Configuration Setup

### Option A: Use SendGrid (Recommended for Render)

**Benefits**:
- ✅ Works reliably on Render
- ✅ Free tier: 100 emails/day
- ✅ No network/firewall issues
- ✅ Simple setup

**Setup**:

1. Go to: https://sendgrid.com/
2. Sign up and verify email
3. Go to Settings → API Keys
4. Create new API Key with "Mail Send" permission
5. Copy the key (looks like: `SG.xxxxxxxxxxx`)

**Add to Environment**:

*Local (.env)*:
```
SENDGRID_API_KEY=SG.your_api_key_here
MAIL_USER=your-email@example.com
```

*Render (Environment Variables)*:
```
SENDGRID_API_KEY=SG.your_api_key_here
MAIL_USER=your-email@example.com
MAIL_HOST=smtp.sendgrid.net
```

**Test**:
```
npm run dev
# Try signup in browser
# Look for: "Provider: SENDGRID"
# Should see: "✅ SendGrid: Email sent successfully!"
```

### Option B: Use Gmail SMTP

**Requirements**:
- Gmail account
- 2-Step Verification enabled
- Gmail App Password (not regular password)

**Setup Gmail App Password**:

1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification (if not done)
3. Go back and find "App passwords"
4. Select: Mail + Windows Computer
5. Copy generated 16-character password

**Add to Environment**:

*Local (.env)*:
```
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=xyzabcdefghijklm
JWT_SECRET=Ayush
```

*Render (Environment Variables)*:
```
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=xyzabcdefghijklm
JWT_SECRET=Ayush
```

**Test**:
```
npm run dev
# Try signup in browser
# Look for: "Provider: GMAIL"
# Should see: "✅ Gmail: Email sent successfully!"
```

## Step 4: Common Issues & Fixes

### Issue: "Email sent successfully" but user doesn't receive email

**Possible causes**:
1. Email in spam/junk folder
2. Email domain has issues
3. Typo in email address

**Solutions**:
1. Check spam folder first
2. Check if email address is correct (typo?)
3. Use a different email to test

### Issue: Server runs but shows "Provider: MOCK"

**Cause**: No email service configured

**Solutions**:
1. Check if environment variables are loaded
2. Restart server after adding .env changes
3. Run: `node -e "console.log(process.env.SENDGRID_API_KEY)"`

### Issue: Render shows emails aren't sent

**Causes**:
1. Environment variables not set in Render dashboard
2. Wrong API key copied
3. Network restrictions

**Solutions**:
1. Go to Render dashboard → Your service → Environment
2. Add SENDGRID_API_KEY
3. Redeploy service
4. Check logs in Render dashboard

## Verification Checklist

- [ ] Backend server running
- [ ] .env file has email credentials
- [ ] Server restarted after .env changes
- [ ] Email provider shows: SENDGRID or GMAIL (not MOCK)
- [ ] No error messages in server console
- [ ] Test email received (check spam folder)

## Quick Test Commands

**Check environment**:
```bash
cd server
node -e "console.log('SENDGRID:', process.env.SENDGRID_API_KEY ? '✓' : '✗')"
node -e "console.log('MAIL_USER:', process.env.MAIL_USER ? '✓' : '✗')"
node -e "console.log('MAIL_PASS:', process.env.MAIL_PASS ? '✓' : '✗')"
```

**Start server with logging**:
```bash
npm run dev 2>&1 | grep -i "email\|provider\|mail"
```

**Test specific email**:
```
POST /api/v1/auth/sendotp
{
  "email": "test@example.com"
}
```

Then check server logs for detailed email output.

## Still Having Issues?

1. **Collect debug info**:
   - Server logs (full email section)
   - Error message exactly as shown
   - Which provider is being used
   - Environment variable status

2. **Check logs pattern**:
   - If MOCK provider: No credentials configured
   - If SENDGRID with error: Check API key
   - If GMAIL with error: Check credentials or network

3. **Escalation**:
   - For SendGrid: Contact SendGrid support with API key validation
   - For Gmail: Check Gmail security settings
   - For Render: Check Render documentation on outbound connections

## Reference

**Email Service Architecture**:
```
mailSender called
    ↓
emailService.sendEmail()
    ↓
Check provider priority:
  1. SendGrid (if API key available)
  2. Gmail SMTP (if credentials available)
  3. Mock/Console (if nothing configured)
    ↓
Log detailed debug info
    ↓
Send email
    ↓
Return success/error
```

**Files Involved**:
- `server/utils/emailService.js` - Main email logic
- `server/utils/mailSender.js` - Backward compatibility wrapper
- `server/controllers/Auth.js` - sendotp function
- `server/index.js` - Service initialization
