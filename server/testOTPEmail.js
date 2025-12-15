/**
 * OTP Email Test Script
 * Simulates actual signup → OTP creation → Email sending
 * 
 * Usage: node testOTPEmail.js
 */

require("dotenv").config();
const otpGenerator = require("otp-generator");
const mailSender = require("./utils/mailSender");
const otpTemplate = require("./mail/templates/emailVerificationTemplate");

console.log("\n" + "=".repeat(70));
console.log("OTP EMAIL SENDING TEST - Full Simulation");
console.log("=".repeat(70) + "\n");

async function testOTPEmail() {
  const testEmail = "2022021213@gmail.com"; // Your test email

  try {
    // Step 1: Generate OTP (same as in real signup)
    console.log("📝 Step 1: Generating OTP...");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`   Generated OTP: ${otp}\n`);

    // Step 2: Create email body (same as in real signup)
    console.log("📧 Step 2: Creating email body...");
    const emailBody = otpTemplate(otp);
    console.log(`   Email body length: ${emailBody.length} characters\n`);

    // Step 3: Send email (same as in real signup)
    console.log("📤 Step 3: Sending email...");
    console.log(`   To: ${testEmail}`);
    console.log(`   Subject: Shiksha Mitra - Verify Your Email\n`);

    const emailResponse = await mailSender(
      testEmail,
      "Shiksha Mitra - Verify Your Email",
      emailBody
    );

    // Step 4: Success!
    console.log("✅ SUCCESS!\n");
    console.log("Email sent successfully!");
    console.log(`   Message ID: ${emailResponse.messageId}`);
    console.log(`   Provider: ${emailResponse.response}`);
    console.log();
    console.log("📬 Email Details:");
    console.log(`   To: ${testEmail}`);
    console.log(`   OTP in email: ${otp}`);
    console.log(`   Subject: Shiksha Mitra - Verify Your Email\n`);
    console.log("🔍 Next steps:");
    console.log("   1. Check your email inbox at: 2022021213@gmail.com");
    console.log("   2. If not in inbox, check SPAM folder");
    console.log("   3. You should see the OTP: " + otp);
    console.log("   4. Copy the OTP from email");
    console.log("   5. Paste it in the signup form\n");

    process.exit(0);
  } catch (error) {
    console.log("❌ FAILED!\n");
    console.log("Error Details:");
    console.log(`   Message: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    console.log();

    if (error.code === "ETIMEDOUT") {
      console.log("⚠️  Issue: Connection timeout");
      console.log("   Solution: Check your network or use SendGrid API key\n");
    }

    if (error.message.includes("Invalid login")) {
      console.log("⚠️  Issue: Email credentials are invalid");
      console.log("   Solution: Generate new Gmail App Password\n");
    }

    console.log("📋 Debug Info:");
    console.log(`   Test Email: ${testEmail}`);
    console.log(`   MAIL_USER: ${process.env.MAIL_USER}`);
    console.log(`   MAIL_HOST: ${process.env.MAIL_HOST}`);
    console.log(`   MAIL_PASS: ${process.env.MAIL_PASS ? "SET" : "NOT SET"}\n`);

    process.exit(1);
  }
}

testOTPEmail();
