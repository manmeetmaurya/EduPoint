/**
 * Complete Diagnostic Tool for OTP Email Issues
 * This will help identify exactly where the problem is
 */

require("dotenv").config();
const OTP = require("./models/OTP");
const User = require("./models/User");
const database = require("./config/database");

async function runDiagnostics() {
  console.log("\n" + "=".repeat(70));
  console.log("🔍 COMPLETE OTP EMAIL SYSTEM DIAGNOSTIC");
  console.log("=".repeat(70));

  try {
    // 1. Check Environment Variables
    console.log("\n1️⃣ ENVIRONMENT VARIABLES");
    console.log("─".repeat(70));

    const checks = {
      "MAIL_USER (Gmail)": process.env.MAIL_USER,
      "MAIL_PASS (Password)": process.env.MAIL_PASS ? "✅ Set (hidden)" : "❌ Missing",
      "SENDGRID_API_KEY": process.env.SENDGRID_API_KEY ? "✅ Set (hidden)" : "❌ Missing",
      "MONGODB_URL": process.env.MONGODB_URL ? "✅ Set (hidden)" : "❌ Missing",
      "JWT_SECRET": process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
      "PORT": process.env.PORT || "4000",
    };

    for (const [key, value] of Object.entries(checks)) {
      console.log(`  ${key}: ${value}`);
    }

    // 2. Check Database Connection
    console.log("\n2️⃣ DATABASE CONNECTION");
    console.log("─".repeat(70));

    try {
      await database.connect();
      console.log("  ✅ MongoDB Connected Successfully");
    } catch (dbError) {
      console.error("  ❌ MongoDB Connection Failed");
      console.error(`     Error: ${dbError.message}`);
      process.exit(1);
    }

    // 3. Check OTP Collection
    console.log("\n3️⃣ OTP COLLECTION STATUS");
    console.log("─".repeat(70));

    const otpCount = await OTP.countDocuments();
    console.log(`  Total OTPs in database: ${otpCount}`);

    const recentOTPs = await OTP.find().sort({ createdAt: -1 }).limit(5);
    if (recentOTPs.length > 0) {
      console.log(`  Last 5 OTPs created:`);
      recentOTPs.forEach((otp, index) => {
        const age = Math.floor((Date.now() - otp.createdAt) / 1000);
        console.log(`    ${index + 1}. Email: ${otp.email}`);
        console.log(`       OTP: ${otp.otp}`);
        console.log(`       Age: ${age} seconds ago`);
        console.log(`       Expires in: ${Math.max(0, 600 - age)} seconds`);
      });
    } else {
      console.log("  ⚠️  No OTPs found in database yet");
    }

    // 4. Check Users Collection
    console.log("\n4️⃣ USERS COLLECTION STATUS");
    console.log("─".repeat(70));

    const userCount = await User.countDocuments();
    console.log(`  Total users in database: ${userCount}`);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
    if (recentUsers.length > 0) {
      console.log(`  Last 3 users created:`);
      recentUsers.forEach((user, index) => {
        const age = Math.floor((Date.now() - user.createdAt) / 1000);
        console.log(`    ${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`       Email: ${user.email}`);
        console.log(`       Age: ${age} seconds ago`);
      });
    } else {
      console.log("  ⚠️  No users found in database yet");
    }

    // 5. Test Email Service
    console.log("\n5️⃣ EMAIL SERVICE TEST");
    console.log("─".repeat(70));

    const EmailService = require("./utils/emailService");
    const { emailService } = require("./utils/emailService");
    
    console.log(`  Provider detected: ${emailService.provider?.toUpperCase() || "UNKNOWN"}`);
    
    if (emailService.provider === "gmail") {
      console.log(`  ✅ Will use Gmail SMTP on port 587`);
      console.log(`  📧 From: ${process.env.MAIL_USER}`);
    } else if (emailService.provider === "sendgrid") {
      console.log(`  ✅ Will use SendGrid API`);
    } else {
      console.log(`  ⚠️  Will use console mock (testing only)`);
    }

    // 6. Quick Email Send Test
    console.log("\n6️⃣ TEST EMAIL SEND");
    console.log("─".repeat(70));

    const mailSender = require("./utils/mailSender");
    const testEmail = process.env.TEST_EMAIL || "2022021213@mmmut.ac.in";

    console.log(`  Sending test email to: ${testEmail}`);
    console.log(`  Please wait...`);

    try {
      const result = await mailSender(
        testEmail,
        "Test: Shiksha Mitra - Email System Check",
        `<h1>Email System Test</h1>
         <p>If you received this, email system is working!</p>
         <p>Sent at: ${new Date().toISOString()}</p>`
      );

      console.log(`  ✅ TEST EMAIL SENT SUCCESSFULLY!`);
      console.log(`     Message ID: ${result.messageId}`);
      console.log(`     Provider: ${result.response}`);
    } catch (emailError) {
      console.error(`  ❌ TEST EMAIL FAILED`);
      console.error(`     Error: ${emailError.message}`);
      console.error(`     Code: ${emailError.code}`);
    }

    // 7. Summary
    console.log("\n7️⃣ SUMMARY & RECOMMENDATIONS");
    console.log("─".repeat(70));

    if (otpCount === 0) {
      console.log("  ⚠️  No OTPs in database - Users might not be calling /sendotp");
      console.log("     Check if frontend is correctly sending signup request");
    } else {
      console.log("  ✅ OTPs are being generated and saved to database");
    }

    if (emailService.provider === "gmail") {
      console.log("  ✅ Gmail SMTP is configured - emails should send");
      console.log("     If emails still not arriving:");
      console.log("     1. Check user's spam folder");
      console.log("     2. Verify email address in signup form");
      console.log("     3. Check server logs for any errors");
    } else if (emailService.provider === "sendgrid") {
      console.log("  ✅ SendGrid is configured - emails should send");
    } else {
      console.log("  ❌ Using console mock - no emails being sent!");
      console.log("     Add Gmail credentials or SendGrid API key to .env");
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ DIAGNOSTIC COMPLETE");
    console.log("=".repeat(70) + "\n");

    process.exit(0);

  } catch (error) {
    console.error("\n❌ DIAGNOSTIC ERROR");
    console.error(`   ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    process.exit(1);
  }
}

runDiagnostics();
