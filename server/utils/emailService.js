const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Email Service with multiple providers
 * Priority: SendGrid > Gmail SMTP > Mock (console logging)
 */

class EmailService {
  constructor() {
    this.provider = null;
    this.initializeProvider();
  }

  initializeProvider() {
    // Check if we're in a test/mock environment
    if (process.env.NODE_ENV === "test" || process.env.MOCK_EMAIL === "true") {
      console.log("✓ Email Service: Using MOCK (console logging)");
      this.provider = "mock";
      return;
    }

    console.log("\n📧 Email Service Initialization");
    console.log("================================");

    // Check for SendGrid API Key - MUST BE FIRST
    const sendgridKey = process.env.SENDGRID_API_KEY;
    console.log(`   Checking SENDGRID_API_KEY: ${sendgridKey ? "✅ Found" : "❌ Not found"}`);
    
    if (sendgridKey && sendgridKey.startsWith("SG.")) {
      try {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(sendgridKey);
        this.sgMail = sgMail;
        this.provider = "sendgrid";
        console.log("✅ SendGrid API Key: Configured and initialized");
        console.log(`   Key preview: ${sendgridKey.substring(0, 10)}...${sendgridKey.substring(sendgridKey.length - 5)}`);
        console.log(`   From Email: noreply@shikshamitra.com (must be verified in SendGrid)`);
        console.log("   🚀 PRIMARY PROVIDER (Render-compatible)");
        console.log("================================\n");
        return;
      } catch (err) {
        console.error("⚠ SendGrid initialization error:", err.message);
        console.warn("⚠ Falling back to Gmail");
        this.provider = null;
      }
    } else if (sendgridKey) {
      console.error("⚠️  SendGrid API Key format invalid (must start with SG.)");
      console.log("   ℹ️  Check SENDGRID_API_KEY value in environment");
    } else {
      console.log("⚠️  SendGrid API Key: Not configured");
      console.log("   ℹ️  To fix Render issues: Add SENDGRID_API_KEY to environment");
    }

    // Check for Gmail credentials as fallback
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      console.log("✅ Gmail Credentials: Configured");
      console.log("   📍 SECONDARY (port 587 TLS - local dev preferred)");
      this.provider = "gmail";
      console.log("================================\n");
      return;
    } else {
      console.log("❌ Gmail Credentials: Not configured");
    }

    console.log("\n📊 Runtime Provider Priority:");
    console.log("1️⃣  SendGrid (API-based - recommended for Render)");
    console.log("2️⃣  Gmail SMTP (port 587 TLS - local development)");
    console.log("3️⃣  Mock Console (testing/debugging)");
    console.warn("⚠ Email Service: No email provider configured! Using MOCK mode");
    this.provider = "mock";
    console.log("================================\n");
  }

  async sendEmail(email, subject, htmlBody) {
    console.log("\n📧 EMAIL SERVICE DEBUG");
    console.log("─".repeat(50));
    console.log(`Provider: ${this.provider.toUpperCase()}`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML Length: ${htmlBody.length} chars`);

    try {
      if (this.provider === "sendgrid") {
        return await this.sendViaSendGrid(email, subject, htmlBody);
      } else if (this.provider === "gmail") {
        try {
          return await this.sendViaGmail(email, subject, htmlBody);
        } catch (gmailError) {
          // If Gmail fails with ETIMEDOUT (Render/restricted network), try SendGrid as fallback
          if (gmailError.code === "ETIMEDOUT") {
            console.error("\n⚠️ Gmail SMTP failed with ETIMEDOUT (port 587 blocked - common on Render)");
            console.error("   Attempting SendGrid fallback...");
            
            if (process.env.SENDGRID_API_KEY) {
              console.error(`   ✅ SendGrid API Key found - trying now...`);
              try {
                return await this.sendViaSendGrid(email, subject, htmlBody);
              } catch (sgError) {
                console.error("   ❌ SendGrid fallback also failed");
                console.error(`   Error: ${sgError.message}`);
                throw sgError;
              }
            } else {
              console.error("   ❌ SendGrid API Key not configured!");
              console.error("   💡 SOLUTION: Add SENDGRID_API_KEY to Render environment variables");
              console.error("   💡 Steps:");
              console.error("      1. Go to sendgrid.com and create API key");
              console.error("      2. Go to Render Dashboard → Environment → Add SENDGRID_API_KEY");
              console.error("      3. Service will auto-redeploy and use SendGrid");
              throw new Error("Email failed: Gmail timeout (port 587 blocked) and SendGrid not configured. Add SENDGRID_API_KEY to environment.");
            }
          }
          throw gmailError;
        }
      } else {
        return await this.sendViaMock(email, subject, htmlBody);
      }
    } catch (error) {
      console.error("\n❌ EMAIL SENDING FAILED");
      console.error("─".repeat(50));
      console.error(`Error: ${error.message}`);
      console.error(`Code: ${error.code}`);
      
      // Log detailed error info
      if (error.response) {
        console.error("Response:", error.response);
      }
      if (error.status) {
        console.error("Status:", error.status);
      }
      
      throw error;
    }
  }

  async sendViaSendGrid(email, subject, htmlBody) {
    try {
      console.log("\n🔄 Attempting SendGrid...");
      console.log(`  - Email: ${email}`);
      console.log(`  - Subject: ${subject}`);
      console.log(`  - API Key set: ${this.sgMail ? "Yes" : "No"}`);
      console.log(`  - API Key value: ${process.env.SENDGRID_API_KEY ? "✅ Loaded from environment" : "❌ Missing"}`);
      
      if (!this.sgMail) {
        console.error("  ❌ SendGrid client not initialized!");
        console.error(`     - sgMail object: ${this.sgMail}`);
        console.error(`     - Provider set to: ${this.provider}`);
        throw new Error("SendGrid API client not initialized");
      }

      // Use verified SendGrid sender email - must be verified in SendGrid dashboard
      // Use MAIL_USER which is already configured
      const fromEmail = process.env.MAIL_USER || "noreply@shikshamitra.com";
      const msg = {
        to: email,
        from: fromEmail,
        subject: subject,
        html: htmlBody,
      };

      console.log(`  - From: ${msg.from}`);
      console.log(`  - To: ${msg.to}`);
      console.log(`  - Subject: ${msg.subject}`);
      console.log(`  - HTML Length: ${msg.html.length} chars`);
      console.log(`  - Sending via SendGrid API...`);

      const response = await this.sgMail.send(msg);
      
      console.log("✅ SendGrid: Email sent successfully!");
      console.log(`   Response: ${JSON.stringify(response[0])}`);
      console.log(`   Message ID: ${response[0].headers["x-message-id"]}`);
      console.log(`   Status Code: ${response[0].statusCode}`);
      console.log("─".repeat(50) + "\n");
      
      return {
        success: true,
        provider: "sendgrid",
        messageId: response[0].headers["x-message-id"],
        statusCode: response[0].statusCode,
      };
    } catch (error) {
      console.error("\n❌ SendGrid Error:");
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      console.error(`   SENDGRID_API_KEY loaded: ${process.env.SENDGRID_API_KEY ? "Yes (✅)" : "No (❌)"}`);
      console.error(`   SENDGRID_API_KEY format valid: ${process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith("SG.") ? "Yes (✅)" : "No (❌)"}`);
      
      // SendGrid error details
      if (error.response) {
        console.error(`   Response Status: ${error.response.status}`);
        
        if (error.response.status === 401) {
          console.error(`   ❌ 401 UNAUTHORIZED - API key is invalid or expired`);
          console.error(`      Solution: Generate new SendGrid API key and update SENDGRID_API_KEY`);
        } else if (error.response.status === 403) {
          console.error(`   ❌ 403 FORBIDDEN - API key doesn't have Mail Send permission`);
          console.error(`      Solution: Check SendGrid API key has "Mail Send" permission enabled`);
        } else if (error.response.status === 400) {
          console.error(`   ❌ 400 BAD REQUEST - Invalid email or request format`);
          console.error(`      Solution: Check email address format or SendGrid configuration`);
        } else if (error.response.status === 429) {
          console.error(`   ❌ 429 RATE LIMITED - Too many emails sent`);
          console.error(`      Solution: Free tier limit 100/day. Upgrade account or wait until tomorrow`);
        }
        
        console.error(`   Response Headers:`, error.response.headers);
        console.error(`   Response Body:`, JSON.stringify(error.response.body, null, 2));
      }
      
      if (error.status) {
        console.error(`   Status: ${error.status}`);
      }
      
      if (error.code) {
        console.error(`   Error Code: ${error.code}`);
      }
      
      console.error("─".repeat(50) + "\n");
      throw error;
    }
  }

  async sendViaGmail(email, subject, htmlBody) {
    try {
      console.log("\n🔄 Attempting Gmail SMTP...");
      console.log(`  - Email: ${email}`);
      console.log(`  - Subject: ${subject}`);
      console.log(`  - Port: 587 (TLS)`);
      
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || "smtp.gmail.com",
        port: 587,
        secure: false, // Use TLS, not SSL
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        connectionTimeout: 5000, // Reduced from 10000 - fail faster on Render
        socketTimeout: 5000,    // Reduced from 10000 - fail faster on Render
        logger: true,
        debug: process.env.DEBUG_EMAIL === "true",
      });

      console.log("  - Transporter created (port 587 TLS)");
      
      // Verify connection
      try {
        await transporter.verify();
        console.log("  - ✅ Connection verified successfully");
      } catch (verifyError) {
        console.warn(`  ⚠ Verification warning: ${verifyError.message}`);
        console.log("  - Continuing with send attempt...");
      }

      // Send email
      const info = await transporter.sendMail({
        from: `"Shiksha Mitra" <${process.env.MAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlBody,
      });

      console.log("✅ Gmail: Email sent successfully!");
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   To: ${email}`);
      console.log("─".repeat(50) + "\n");
      
      return {
        success: true,
        provider: "gmail",
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("\n❌ Gmail SMTP Error");
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      
      if (error.code === "ETIMEDOUT") {
        console.error("   🔴 Port 587 connection timeout");
        console.error("   💡 This is common on restricted networks (Render, corporate proxies)");
        console.error("   💡 Solution: Use SendGrid API key with port 443");
      }
      
      if (error.message && error.message.includes("Invalid login")) {
        console.error("   🔴 Invalid Gmail credentials");
        console.error("   💡 Check MAIL_USER and MAIL_PASS in .env");
        console.error("   💡 Use app-specific password, not your main Gmail password");
      }
      
      console.error(`   Full Error: ${error.code || error.message}\n`);
      throw error;
    }
  }

  async sendViaMock(email, subject, htmlBody) {
    console.log("\n🔄 Using MOCK Email Service (development/testing)...");
    console.log("  ⚠ Emails are NOT actually sent, only logged to console");
    console.log(`  To: ${email}`);
    console.log(`  Subject: ${subject}`);
    console.log("  Body preview:", htmlBody.substring(0, 100) + "...");
    console.log("✅ Mock: Email 'sent' successfully!");
    console.log("─".repeat(50) + "\n");

    return {
      success: true,
      provider: "mock",
      messageId: "mock-" + Date.now(),
    };
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = EmailService;
module.exports.emailService = emailService;
