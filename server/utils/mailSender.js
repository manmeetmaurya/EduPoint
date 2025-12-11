const nodemailer = require("nodemailer");
const nodemailer = require("nodemailer");
// Import the required modules
require("dotenv").config();

let sendgridAvailable = false
let sgMail
try {
  // try to require @sendgrid/mail if available
  sgMail = require("@sendgrid/mail")
  sendgridAvailable = true
} catch (e) {
  sendgridAvailable = false
}

// This function prefers SendGrid (API) when SENDGRID_API_KEY is provided.
// Falls back to nodemailer SMTP transport otherwise.
const mailSender = async (email, title, body) => {
  // If SendGrid API key is set and library is present, use it (works from Render)
  if (process.env.SENDGRID_API_KEY && sendgridAvailable) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const from = process.env.MAIL_FROM || process.env.MAIL_USER
      const msg = {
        to: email,
        from: from,
        subject: title,
        html: body,
      }
      const resp = await sgMail.send(msg)
      console.log("SendGrid send response:", resp && resp[0] && resp[0].statusCode)
      return resp
    } catch (err) {
      console.error("SendGrid error:", err && err.message ? err.message : err)
      throw err
    }
  }

  // Fallback to nodemailer SMTP
  try {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("SMTP credentials not configured:", {
        host: !!process.env.MAIL_HOST,
        user: !!process.env.MAIL_USER,
        pass: !!process.env.MAIL_PASS,
      })
      throw new Error("SMTP credentials not configured in environment variables")
    }

    const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587
    const secure = process.env.MAIL_SECURE === "true" || port === 465

    console.log("Creating transporter with host:", process.env.MAIL_HOST, "port:", port, "secure:", secure)
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      secure,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    })

    console.log("Sending email to:", email, "with title:", title)
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `"EduPoint" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    })
    console.log("Email sent successfully. Response:", info && info.response ? info.response : info)
    return info
  } catch (error) {
    console.error("Mail sending error:", error && error.message ? error.message : error)
    throw error
  }
}

module.exports = mailSender
