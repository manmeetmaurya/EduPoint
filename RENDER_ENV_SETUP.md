# Render Deployment - Environment Variables Setup

## Required Environment Variables for Render

Add these environment variables in your Render dashboard:

### 1. Database Configuration
- **MONGODB_URL**: `mongodb+srv://Ayush:s3D9VJpqjqXDwdTD@shiksha.tubxelh.mongodb.net/`

### 2. Email Configuration (Gmail)
- **MAIL_HOST**: `smtp.gmail.com`
- **MAIL_USER**: `ayushmishramay22@gmail.com`
- **MAIL_PASS**: Your Gmail App Password (NOT your regular password)

#### How to get Gmail App Password:
1. Go to [Google Account](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification (enable if not done)
3. Scroll down to "App passwords"
4. Select Mail and Windows Computer
5. Copy the generated 16-character password
6. Use this in MAIL_PASS

### 3. JWT Configuration
- **JWT_SECRET**: `Ayush` (or use a stronger secret in production)

### 4. Razorpay (Payment Gateway)
- **RAZORPAY_KEY**: `rzp_test_XyDVUGKfbPnrv1`
- **RAZORPAY_SECRET**: `pzl7d4zDRrz3Cfj496bB0OZW`

### 5. Cloudinary (Image Upload)
- **CLOUD_NAME**: `dciv3db5z`
- **API_KEY**: `861912878782726`
- **API_SECRET**: `uiRMitbHNknS3wSWJSEwVVCThtg`

### 6. Other Configuration
- **FOLDER_NAME**: `Ayush_Stuff`
- **PORT**: `4000`

## Steps to Add in Render Dashboard

1. Go to your Render service dashboard
2. Click on "Environment" tab
3. Add each variable as key-value pair
4. Click "Deploy" to redeploy with new environment variables

## Common Issues & Fixes

### Issue: "secretOrPrivateKey must have a value"
- **Fix**: Ensure `JWT_SECRET` is set in Render environment variables

### Issue: "Connection timeout" for emails
- **Fix**: 
  1. Use Gmail App Password instead of regular password
  2. Ensure MAIL_USER and MAIL_PASS are correct
  3. Check if Gmail account has 2-Step Verification enabled

### Issue: Database connection errors
- **Fix**: Verify MONGODB_URL is correct and MongoDB cluster allows Render's IP

## Testing Deployment

After setting environment variables:
1. Deploy your code
2. Test signup - should receive OTP email
3. Test login - should generate JWT token successfully
