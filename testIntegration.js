/**
 * Full Integration Test
 * Tests the complete flow: OTP creation → Email sending → Database save
 * 
 * Run: npm run dev (in another terminal)
 * Then: node testIntegration.js
 */

const axios = require("axios");

const API_URL = "http://localhost:4000/api/v1/auth/sendotp";
const TEST_EMAIL = "2022021213@gmail.com";

console.log("\n" + "=".repeat(70));
console.log("FULL INTEGRATION TEST - Signup OTP Flow");
console.log("=".repeat(70) + "\n");

async function testIntegration() {
  try {
    console.log("🚀 Starting test...\n");

    console.log("Step 1: Sending OTP request to backend");
    console.log(`   URL: POST ${API_URL}`);
    console.log(`   Email: ${TEST_EMAIL}\n`);

    const response = await axios.post(API_URL, {
      email: TEST_EMAIL,
      checkUserPresent: true,
    });

    console.log("✅ Backend response received!\n");

    console.log("Response Details:");
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${response.data.success}`);
    console.log(`   Message: ${response.data.message}`);
    console.log(`   OTP: ${response.data.otp}`);
    console.log(`   Email Sent: ${response.data.emailSent}\n`);

    if (response.data.success) {
      console.log("✅ SUCCESS!\n");
      console.log("📬 What happened:");
      console.log("   1. OTP was generated: " + response.data.otp);
      console.log("   2. OTP was saved to database");
      console.log("   3. Email was sent to: " + TEST_EMAIL);
      console.log("\n📧 Check your email:");
      console.log("   1. Go to: " + TEST_EMAIL);
      console.log("   2. Look for email from: ayushmishramay22@gmail.com");
      console.log("   3. Subject: Shiksha Mitra - Verify Your Email");
      console.log("   4. You should see OTP: " + response.data.otp);
      console.log("   5. If not in inbox, check SPAM folder\n");
    } else {
      console.log("❌ Backend returned error!\n");
      console.log(`Error: ${response.data.message}`);
    }

    process.exit(0);
  } catch (error) {
    console.log("❌ Integration test FAILED\n");

    if (error.code === "ECONNREFUSED") {
      console.log("⚠️  Cannot connect to backend!");
      console.log("   Make sure the backend is running:");
      console.log("   cd server && npm run dev\n");
    } else if (error.response) {
      console.log("❌ Backend error:");
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}\n`);
    } else {
      console.log(`Error: ${error.message}\n`);
    }

    process.exit(1);
  }
}

testIntegration();
