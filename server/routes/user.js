// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp);

// ✅ DEBUG TEST ENDPOINT - Remove in production
// Test SendGrid connectivity
router.get("/test-email-sendgrid", async (req, res) => {
  try {
    const EmailService = require("../utils/emailService");
    const emailService = new EmailService();
    
    console.log("\n🧪 EMAIL TEST ENDPOINT CALLED");
    console.log("================================");
    console.log(`Email Service Provider: ${emailService.provider}`);
    console.log(`SendGrid Available: ${emailService.sgMail ? "✅ Yes" : "❌ No"}`);
    
    const result = await emailService.sendEmail(
      "test@example.com",
      "SendGrid Test Email - Shiksha Mitra",
      `<h1>✅ SendGrid is working!</h1><p>This email was sent at ${new Date().toISOString()}</p>`
    );
    
    res.status(200).json({
      success: true,
      message: "Test email sent successfully!",
      provider: emailService.provider,
      result,
    });
  } catch (error) {
    console.error("❌ Test email error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.response?.body || error,
    });
  }
});

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router
