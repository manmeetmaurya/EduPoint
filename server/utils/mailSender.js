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
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"Shiksha Mitra | Ayush mishra" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log(info.response)
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender
