/**
 * Test the complete OTP sending flow
 * This simulates what happens during signup
 */

require("dotenv").config();

const mailSender = require("./utils/mailSender");
const otpTemplate = require("./mail/templates/emailVerificationTemplate");
const otpGenerator = require("otp-generator");

async function testOTPFlow() {
  console.log("\n" + "=".repeat(60));
  console.log("TESTING OTP EMAIL FLOW");
  console.log("=".repeat(60));

  try {
    // 1. Check environment
    console.log("\n1️⃣ Environment Check:");
    console.log(`   MAIL_USER: ${process.env.MAIL_USER ? "✅ Set" : "❌ Missing"}`);
    console.log(`   MAIL_PASS: ${process.env.MAIL_PASS ? "✅ Set" : "❌ Missing"}`);
    console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? "✅ Set" : "❌ Missing"}`);

    // 2. Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log(`\n2️⃣ OTP Generated: ${otp}`);

    // 3. Create email template
    const htmlBody = otpTemplate(otp);
    console.log(`\n3️⃣ Email Template: ${htmlBody.length} characters`);
    console.log(`   First 100 chars: ${htmlBody.substring(0, 100)}...`);

    // 4. Send email
    const testEmail = "2022021213@mmmut.ac.in"; // Your test email
    console.log(`\n4️⃣ Sending OTP to: ${testEmail}`);
    console.log("   Subject: Shiksha Mitra - Verify Your Email");

    const emailResponse = await mailSender(
      testEmail,
      "Shiksha Mitra - Verify Your Email",
      htmlBody
    );

    console.log(`\n✅ EMAIL SENT SUCCESSFULLY!`);
    console.log(`   Message ID: ${emailResponse.messageId}`);
    console.log(`   Provider: ${emailResponse.response}`);

  } catch (error) {
    console.error(`\n❌ ERROR SENDING OTP EMAIL`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);

    if (error.code === "ETIMEDOUT") {
      console.error(`\n   ⚠️  TIMEOUT: Port 465/587 likely blocked`);
      console.error(`   💡 Solution: Add SENDGRID_API_KEY to .env`);
    }

    if (error.message && error.message.includes("Invalid login")) {
      console.error(`\n   ⚠️  INVALID CREDENTIALS`);
      console.error(`   💡 Check MAIL_USER and MAIL_PASS in .env`);
    }

    console.error(`\n   Full Error: ${error.stack}`);
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

testOTPFlow();
