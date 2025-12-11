const nodemailer = require("nodemailer");
// Import the required modules
require("dotenv").config();
// This function sends an email using nodemailer
// It takes an email address, a title, and a body as parameters 
// and returns a promise that resolves to the info object or an error message
// Example usage:
// mailSender("

const mailSender = async (email, title, body) => {
  try {
    // Validate credentials
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("SMTP credentials not configured:", {
        host: !!process.env.MAIL_HOST,
        user: !!process.env.MAIL_USER,
        pass: !!process.env.MAIL_PASS,
      })
      throw new Error("SMTP credentials not configured in environment variables")
    }

    console.log("Creating transporter with host:", process.env.MAIL_HOST)
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
      connectionTimeout: 10000,
      socketTimeout: 10000,
    })

    console.log("Sending email to:", email, "with title:", title)
    let info = await transporter.sendMail({
      from: `"EduPoint | Manmeet Kishore Maurya" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log("Email sent successfully. Response:", info.response)
    return info
  } catch (error) {
    console.error("Mail sending error:", error.message || error)
    throw error
  }
}

module.exports = mailSender
