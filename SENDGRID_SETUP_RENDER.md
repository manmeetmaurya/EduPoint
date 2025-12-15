# Render Email Timeout Fix - SendGrid Setup

## Problem
On Render, Gmail SMTP connections timeout with error:
```
Error: Connection timeout (code: ETIMEDOUT)
```

This happens because Render may block outbound SMTP connections to Gmail.

## ✅ Solution: Use SendGrid (Recommended)

SendGrid is a reliable email service that works perfectly on Render and has a free tier.

### Step 1: Create SendGrid Account

1. Go to: https://sendgrid.com/
2. Click "Sign Up Free"
3. Create account with your email
4. Verify your email
5. You get **100 emails/day free** (enough for testing)

### Step 2: Get SendGrid API Key

1. Login to SendGrid Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it: `Shiksha Mitra`
5. Select **Restricted Access**
6. Enable only: **Mail Send**
7. Click **Create & View**
8. **Copy the API Key** (starts with `SG.`)

### Step 3: Update Environment Variables

#### For Local Development:

Add to `server/.env`:
```env
SENDGRID_API_KEY=SG.your_api_key_here
MAIL_USER=your-email@gmail.com
```

#### For Render Deployment:

Go to Render Dashboard → Your Service → Environment:

Add:
```
SENDGRID_API_KEY=SG.your_api_key_here
MAIL_USER=your-email@gmail.com
MAIL_HOST=smtp.sendgrid.net
MAIL_PASS=apikey
```

Keep the Gmail settings as fallback, but SendGrid will be used if the API key is available.

### Step 4: Redeploy

1. Commit and push changes to GitHub
2. Render will auto-redeploy
3. Check the logs - should show: **"Using SendGrid for email delivery"**

### Step 5: Test

1. Go to your deployed app on Render
2. Try signing up with an email
3. Check server logs - should see:
   ```
   Using SendGrid for email delivery
   Email sent successfully via SendGrid!
   ```

## Alternative Solutions (If SendGrid Doesn't Work)

### Option 1: Use Brevo (formerly Sendinblue)
- Free tier: 300 emails/day
- More generous than SendGrid
- Setup: Similar to SendGrid

### Option 2: Use AWS SES (Amazon Simple Email Service)
- Free tier: 62,000 emails/month
- More complex setup
- Better for production scale

### Option 3: Keep Gmail + Use Render Private Network
- Contact Render support
- May not be available on free tier

## How It Works Now

The system has **intelligent fallback**:

```
Try SendGrid (if SENDGRID_API_KEY exists)
    ↓
If SendGrid fails or no API key → Try Gmail SMTP
    ↓
If Gmail fails → Show helpful error with solutions
```

## Current Changes

Updated files:
- ✅ `server/utils/mailSender.js` - Added SendGrid support
- ✅ `server/package.json` - Added @sendgrid/mail dependency

## What's Included Now

1. **SendGrid Integration** - Primary email service
2. **Gmail Fallback** - If SendGrid API key not provided
3. **Better Error Messages** - Clear suggestions for fixing issues
4. **Retry Logic** - Attempts connection multiple times
5. **Better Logging** - Helpful debug information

## Files to Commit & Push

```bash
git add server/utils/mailSender.js
git add server/package.json
git commit -m "Add SendGrid email support for Render compatibility"
git push origin main
```

## Testing Checklist

- [ ] SendGrid account created
- [ ] API Key copied
- [ ] Added SENDGRID_API_KEY to Render environment variables
- [ ] Render service redeployed
- [ ] Tested signup - email received
- [ ] Check server logs show "Using SendGrid for email delivery"

## Quick SendGrid API Key Test

Before deploying, test locally:

```bash
# In server directory
npm install  # Install @sendgrid/mail

# Update .env with SENDGRID_API_KEY
# Start server
npm run dev

# Try signup
```

## FAQ

**Q: Do I need to update .env for local development?**
A: No, but you can add SENDGRID_API_KEY if you have it. Fallback to Gmail works too.

**Q: Will Gmail still work?**
A: Yes, SendGrid is primary but Gmail is fallback. Make sure Gmail App Password is set.

**Q: Is SendGrid's free tier enough?**
A: Yes, 100 emails/day is perfect for testing/staging. Upgrade when you go production.

**Q: What if both fail?**
A: User will see clear error message. Check logs for the specific issue.

**Q: Can I switch back to Gmail only?**
A: Yes, just don't add SENDGRID_API_KEY environment variable.

## Support

If emails still don't work on Render:

1. Check Render logs: `docker logs <container_id>`
2. Verify SENDGRID_API_KEY is set in Render dashboard
3. Test API key directly with curl:
   ```bash
   curl --request POST \
   --url https://api.sendgrid.com/v3/mail/send \
   --header "Authorization: Bearer $SENDGRID_API_KEY" \
   --header "Content-Type: application/json"
   ```
4. Contact SendGrid support if API key issue

## Summary

✅ System now supports SendGrid for Render
✅ Gmail still works as fallback
✅ Better error handling and logging
✅ Production-ready solution

🚀 Ready to deploy!
