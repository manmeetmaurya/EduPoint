/**
 * Email Configuration Diagnostic Tool
 * Run this to check email service setup
 */

require("dotenv").config();

console.log("\n" + "=".repeat(70));
console.log("EMAIL SERVICE CONFIGURATION DIAGNOSTIC");
console.log("=".repeat(70) + "\n");

// Check environment variables
console.log("📋 ENVIRONMENT VARIABLES:");
console.log("─".repeat(70));

const envVars = {
  "SENDGRID_API_KEY": process.env.SENDGRID_API_KEY ? "✓ SET" : "✗ NOT SET",
  "MAIL_HOST": process.env.MAIL_HOST || "✗ NOT SET",
  "MAIL_USER": process.env.MAIL_USER || "✗ NOT SET",
  "MAIL_PASS": process.env.MAIL_PASS ? "✓ SET" : "✗ NOT SET",
};

Object.entries(envVars).forEach(([key, value]) => {
  const status = value.includes("✓") ? "✓" : "✗";
  const display = value === "✓ SET" ? "✓ Configured" : value;
  console.log(`${status} ${key.padEnd(25)}: ${display}`);
});

console.log("\n📊 DIAGNOSIS:");
console.log("─".repeat(70));

// Diagnostic checks
let issues = [];
let recommendations = [];

if (!process.env.SENDGRID_API_KEY) {
  issues.push("SendGrid API Key not configured");
  recommendations.push(
    "For Render deployment: Get SendGrid API Key from https://sendgrid.com/\n" +
    "  - Free tier: 100 emails/day\n" +
    "  - Add SENDGRID_API_KEY to environment variables"
  );
}

if (!process.env.MAIL_USER) {
  issues.push("MAIL_USER not configured");
  recommendations.push("Set MAIL_USER in .env (Gmail address for sender)");
}

if (!process.env.MAIL_PASS) {
  issues.push("MAIL_PASS not configured");
  recommendations.push(
    "Set MAIL_PASS in .env (Gmail App Password, not regular password)\n" +
    "  - Generate at: https://myaccount.google.com/apppasswords"
  );
}

if (!process.env.MAIL_HOST) {
  console.log("ℹ MAIL_HOST not set - will default to smtp.gmail.com");
}

// Print issues
if (issues.length > 0) {
  console.log("\n⚠️  ISSUES FOUND:");
  issues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue}`);
  });
} else {
  console.log("✅ All required environment variables are configured!");
}

// Print recommendations
if (recommendations.length > 0) {
  console.log("\n💡 RECOMMENDATIONS:");
  recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
}

// Check which provider will be used
console.log("\n🔍 EMAIL PROVIDER SELECTION:");
console.log("─".repeat(70));

if (process.env.SENDGRID_API_KEY) {
  console.log("✅ PRIMARY: SendGrid (API Key found)");
  console.log("   - Most reliable for Render");
  console.log("   - No SMTP port issues");
  console.log("   - Free tier: 100 emails/day");
} else if (process.env.MAIL_USER && process.env.MAIL_PASS) {
  console.log("✅ PRIMARY: Gmail SMTP");
  console.log("   ⚠️  May face connection timeouts on Render");
  console.log("   - Requires Gmail App Password (not regular password)");
  console.log("   - Fallback if SendGrid not available");
} else {
  console.log("❌ NO PROVIDER CONFIGURED");
  console.log("   Emails will be logged to console only (mock mode)");
}

// Quick test
console.log("\n🧪 QUICK TEST:");
console.log("─".repeat(70));
console.log("To test email sending, you can:");
console.log("  1. Run: npm run dev");
console.log("  2. Make a POST request to /api/v1/auth/sendotp");
console.log("  3. Include: { email: 'test@example.com' }");
console.log("  4. Check server logs for detailed output");

console.log("\n" + "=".repeat(70) + "\n");
