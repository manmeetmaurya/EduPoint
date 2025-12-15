/**
 * Email Test Script
 * Run this to test if emails are actually being sent
 * 
 * Usage: node testEmail.js
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("\n" + "=".repeat(70));
console.log("EMAIL DELIVERY TEST");
console.log("=".repeat(70) + "\n");

// Configuration
const mailConfig = {
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

console.log("Configuration:");
console.log(`  Host: ${mailConfig.host}`);
console.log(`  Port: ${mailConfig.port}`);
console.log(`  User: ${mailConfig.auth.user}`);
console.log(`  Pass: ${"*".repeat(mailConfig.auth.pass.length)}`);
console.log(`  Pass Length: ${mailConfig.auth.pass.length} chars`);
console.log();

// Create transporter
const transporter = nodemailer.createTransport(mailConfig);

// Test sending
async function testEmail() {
  try {
    console.log("Step 1: Verifying connection...");
    await transporter.verify();
    console.log("✅ Connection verified successfully!\n");

    console.log("Step 2: Sending test email...");
    const testOTP = "123456"; // Test OTP
    const testEmail = "2022021213@gmail.com"; // Your email

    const mailOptions = {
      from: `"Shiksha Mitra" <${process.env.MAIL_USER}>`,
      to: testEmail,
      subject: "Shiksha Mitra - Test Email (OTP Verification)",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #333;">Shiksha Mitra</h1>
          <h2 style="color: #666;">Email Test - Your OTP</h2>
          <p style="font-size: 16px; color: #333;">
            This is a test email to verify that our email system is working correctly.
          </p>
          <div style="background-color: #FFD60A; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #000; margin: 0; font-size: 48px; letter-spacing: 5px;">
              ${testOTP}
            </h1>
          </div>
          <p style="font-size: 14px; color: #666;">
            If you did not request this verification, please disregard this email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            Shiksha Mitra - EdTech Platform
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully!\n");
    console.log("Email Details:");
    console.log(`  To: ${testEmail}`);
    console.log(`  Subject: ${mailOptions.subject}`);
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Response: ${info.response}`);
    console.log();
    console.log("📧 Please check your email at: " + testEmail);
    console.log("   (Check spam folder if not in inbox)\n");
    
    process.exit(0);
  } catch (error) {
    console.log("❌ Email sending FAILED\n");
    console.log("Error Details:");
    console.log(`  Message: ${error.message}`);
    console.log(`  Code: ${error.code}`);
    console.log();

    if (error.code === "ETIMEDOUT") {
      console.log("⚠️  ISSUE: Connection timeout");
      console.log("   - Port 465 might be blocked on your network");
      console.log("   - This is common on restricted networks");
    }

    if (error.message.includes("Invalid login")) {
      console.log("⚠️  ISSUE: Gmail credentials are INVALID");
      console.log("   - MAIL_PASS might be wrong or expired");
      console.log("   - Check: https://myaccount.google.com/apppasswords");
      console.log("   - Generate a NEW app password");
      console.log("   - Update server/.env with the new password");
    }

    if (error.message.includes("Username and password not accepted")) {
      console.log("⚠️  ISSUE: Username or password incorrect");
      console.log("   - Verify MAIL_USER: " + process.env.MAIL_USER);
      console.log("   - Verify MAIL_PASS is Gmail App Password");
      console.log("   - NOT your regular Gmail password");
    }

    console.log("\n💡 SOLUTION: Generate new Gmail App Password");
    console.log("   1. Go to: https://myaccount.google.com/apppasswords");
    console.log("   2. Select: Mail + Windows Computer");
    console.log("   3. Copy the 16-character password");
    console.log("   4. Update server/.env MAIL_PASS=your_new_password");
    console.log("   5. Run this test again\n");

    process.exit(1);
  }
}

testEmail();
