/**
 * Email Sender Utility
 * Wrapper around EmailService for backward compatibility
 * and consistent error handling
 */

require("dotenv").config();
const EmailService = require("./emailService");

// Create instance or get singleton
let emailService = null;

function getEmailService() {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}

const mailSender = async (email, title, body) => {
  try {
    if (!email || !title || !body) {
      throw new Error("Missing required parameters: email, title, body");
    }

    console.log("\n📧 MailSender Called:");
    console.log(`   To: ${email}`);
    console.log(`   Subject: ${title}`);

    const service = getEmailService();
    const result = await service.sendEmail(email, title, body);

    console.log("\n✅ MailSender: Email sent successfully");
    console.log(`   Provider: ${result.provider}`);
    console.log(`   Message ID: ${result.messageId}`);

    return {
      messageId: result.messageId,
      response: result.provider,
    };
  } catch (error) {
    console.error("\n❌ MailSender Error:");
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    throw error;
  }
};

module.exports = mailSender;
