/**
 * Simulate Complete Signup Flow with OTP
 * Tests the entire process from OTP generation to email sending
 */

require("dotenv").config();
const database = require("./config/database");
const User = require("./models/User");
const OTP = require("./models/OTP");
const mailSender = require("./utils/mailSender");
const otpGenerator = require("otp-generator");
const otpTemplate = require("./mail/templates/emailVerificationTemplate");

async function simulateSignupFlow() {
  console.log("\n" + "=".repeat(70));
  console.log("🔄 SIMULATING COMPLETE SIGNUP FLOW WITH OTP");
  console.log("=".repeat(70));

  try {
    // Connect to database
    console.log("\n[1/6] Connecting to MongoDB...");
    await database.connect();
    console.log("✅ Connected to MongoDB");

    // Test email for signup
    const testEmail = "2022021213@mmmut.ac.in";
    const testFirstName = "Test";
    const testLastName = "User";

    // Step 1: Check if user already exists
    console.log(`\n[2/6] Checking if user exists (${testEmail})...`);
    let existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log("⚠️  User already exists - deleting for clean test...");
      await User.deleteOne({ email: testEmail });
      console.log("✅ Old user deleted");
    } else {
      console.log("✅ No existing user - ready for test");
    }

    // Step 2: Delete any old OTPs
    console.log(`\n[3/6] Cleaning up old OTPs for this email...`);
    const oldOtpCount = await OTP.deleteMany({ email: testEmail });
    console.log(`✅ Deleted ${oldOtpCount.deletedCount} old OTPs`);

    // Step 3: Generate OTP (simulating sendotp endpoint)
    console.log(`\n[4/6] Generating OTP...`);
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`✅ OTP Generated: ${otp}`);

    // Save OTP to database
    console.log(`\n[5/6] Saving OTP to database...`);
    const otpPayload = { email: testEmail, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(`✅ OTP saved to database`);
    console.log(`   ID: ${otpBody._id}`);
    console.log(`   Email: ${otpBody.email}`);
    console.log(`   OTP: ${otpBody.otp}`);

    // Step 4: Send OTP email
    console.log(`\n[6/6] Sending OTP email...`);
    console.log(`   To: ${testEmail}`);
    console.log(`   Subject: Shiksha Mitra - Verify Your Email`);

    try {
      const emailResponse = await mailSender(
        testEmail,
        "Shiksha Mitra - Verify Your Email",
        otpTemplate(otp)
      );

      console.log(`\n✅ EMAIL SENT SUCCESSFULLY!`);
      console.log(`   Message ID: ${emailResponse.messageId}`);
      console.log(`   Provider: ${emailResponse.response}`);

    } catch (emailError) {
      console.error(`\n❌ EMAIL SENDING FAILED`);
      console.error(`   Message: ${emailError.message}`);
      console.error(`   Code: ${emailError.code}`);

      if (emailError.code === "ETIMEDOUT") {
        console.error(`\n   🔴 ISSUE: Connection timeout to SMTP server`);
        console.error(`   💡 SOLUTION: Add SENDGRID_API_KEY to .env for Render`);
      }

      if (emailError.message && emailError.message.includes("Invalid login")) {
        console.error(`\n   🔴 ISSUE: Invalid Gmail credentials`);
        console.error(`   💡 SOLUTION: Check MAIL_USER and MAIL_PASS in .env`);
      }
    }

    // Verify OTP was saved
    console.log(`\n📊 VERIFICATION`);
    console.log("─".repeat(70));

    const savedOTP = await OTP.findOne({ email: testEmail });
    if (savedOTP) {
      console.log(`✅ OTP exists in database`);
      console.log(`   Email: ${savedOTP.email}`);
      console.log(`   OTP: ${savedOTP.otp}`);
      console.log(`   Created: ${savedOTP.createdAt}`);
    } else {
      console.log(`❌ OTP not found in database!`);
    }

    // Summary
    console.log(`\n📋 SUMMARY`);
    console.log("─".repeat(70));
    console.log(`✅ Database: Connected`);
    console.log(`✅ OTP Generation: Success (${otp})`);
    console.log(`✅ OTP Storage: Success`);
    console.log(`✅ Email Sending: Check above`);
    console.log(`\n🎯 NEXT STEPS:`);
    console.log(`   1. Check ${testEmail} inbox (including spam folder)`);
    console.log(`   2. Use OTP ${otp} to complete signup`);
    console.log(`   3. If email not received: Check troubleshooting guide`);

    console.log("\n" + "=".repeat(70));
    console.log("✅ SIMULATION COMPLETE");
    console.log("=".repeat(70) + "\n");

    process.exit(0);

  } catch (error) {
    console.error("\n❌ SIMULATION ERROR");
    console.error(`   ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    process.exit(1);
  }
}

simulateSignupFlow();
