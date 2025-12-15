/**
 * Complete Email Flow Test
 * Tests the mailSender and emailService integration
 */

require("dotenv").config();
const mailSender = require("./utils/mailSender");
const otpTemplate = require("./mail/templates/emailVerificationTemplate");

async function testCompleteEmailFlow() {
  console.log("\n" + "=".repeat(70));
  console.log("🔍 COMPLETE EMAIL FLOW TEST");
  console.log("=".repeat(70));

  try {
    // Test 1: Check environment
    console.log("\n1️⃣ Environment Check:");
    console.log(`   MAIL_USER: ${process.env.MAIL_USER ? "✅ Set" : "❌ Missing"}`);
    console.log(`   MAIL_PASS: ${process.env.MAIL_PASS ? "✅ Set" : "❌ Missing"}`);
    console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? "✅ Set" : "❌ Missing"}`);

    // Test 2: Generate OTP
    console.log("\n2️⃣ Generating OTP:");
    const otpGenerator = require("otp-generator");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`   Generated: ${otp}`);

    // Test 3: Create email template
    console.log("\n3️⃣ Creating Email Template:");
    const htmlTemplate = otpTemplate(otp);
    console.log(`   Template length: ${htmlTemplate.length} chars`);
    console.log(`   First 150 chars: ${htmlTemplate.substring(0, 150)}...`);

    // Test 4: Test mailSender
    console.log("\n4️⃣ Testing mailSender Function:");
    const testEmail = "2022021213@mmmut.ac.in";
    
    try {
      const result = await mailSender(
        testEmail,
        "Shiksha Mitra - Test Email",
        htmlTemplate
      );

      console.log("\n   ✅ mailSender executed successfully!");
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`   Provider: ${result.response}`);

    } catch (error) {
      console.error("\n   ❌ mailSender failed!");
      console.error(`   Error: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      throw error;
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ EMAIL FLOW TEST COMPLETE");
    console.log("=".repeat(70) + "\n");

    process.exit(0);

  } catch (error) {
    console.error("\n❌ TEST FAILED");
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    process.exit(1);
  }
}

testCompleteEmailFlow();
