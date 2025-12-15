const bcrypt = require("bcrypt")

const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const otpTemplate = require("../mail/templates/emailVerificationTemplate")
const Profile = require("../models/Profile")
require("dotenv").config()

// Signup Controller for Registering USers

exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body
    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    let approved = ""
    approved === "ADMIN" ? (approved = false) : (approved = true)

    // Create the Additional Profile For User
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: "",
    })

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    // Find user with provided email
    const user = await User.findOne({ email }).populate("additionalDetails");

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }
   console.log("yaha tak aaya hai bhai");
    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET || process.env.JWT_SECRETE,
        {
          expiresIn: "24h",
        }
      )

      // Save token to user document in database
      user.token = token
      user.password = undefined
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      })
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}
// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    console.log("\n" + "=".repeat(60))
    console.log("📨 SENDOTP ENDPOINT CALLED")
    console.log("=".repeat(60))
    console.log(`Email: ${email}`)

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email })

    // If user found with provided email
    if (checkUserPresent) {
      console.log("⚠️ User already registered")
      return res.status(400).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    // Generate unique OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    
    console.log(`1️⃣ Generated OTP: ${otp}`)

    // Ensure OTP is unique
    let result = await OTP.findOne({ otp: otp })
    console.log(`2️⃣ OTP uniqueness check:`, result ? "Duplicate" : "Unique")

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await OTP.findOne({ otp: otp })
    }

    console.log(`3️⃣ Final OTP: ${otp}`)

    // Save OTP to database
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log(`4️⃣ OTP saved to database`)
    console.log(`   ID: ${otpBody._id}`)
    console.log(`   Email: ${otpBody.email}`)
    console.log(`   OTP: ${otpBody.otp}`)

    // Send OTP via email
    let emailSent = false
    let emailError = null

    try {
      console.log(`\n5️⃣ Attempting to send OTP email...`)
      console.log(`   To: ${email}`)
      console.log(`   Subject: Shiksha Mitra - Verify Your Email`)
      
      const emailResponse = await mailSender(
        email,
        "Shiksha Mitra - Verify Your Email",
        otpTemplate(otp)
      )

      console.log(`\n✅ Email sent successfully`)
      console.log(`   Message ID: ${emailResponse.messageId}`)
      console.log(`   Provider: ${emailResponse.response}`)
      emailSent = true

    } catch (error) {
      console.error(`\n❌ Email sending failed`)
      console.error(`   Error: ${error.message}`)
      console.error(`   Code: ${error.code}`)
      emailError = error

      if (error.code === "ETIMEDOUT") {
        console.error(`\n   🔴 TIMEOUT: Connection timeout to SMTP server`)
        console.error(`   💡 This usually means port 587 is blocked (e.g., on Render)`)
        console.error(`   💡 Solution: Configure SENDGRID_API_KEY in environment`)
      }

      if (error.message && error.message.includes("Invalid login")) {
        console.error(`\n   🔴 INVALID CREDENTIALS`)
        console.error(`   💡 Check MAIL_USER and MAIL_PASS in .env`)
      }
    }

    console.log("\n" + "=".repeat(60))

    // Send response (even if email fails, OTP was created)
    res.status(200).json({
      success: true,
      message: emailSent 
        ? "OTP sent successfully to your email" 
        : "OTP generated but email sending failed. Please check logs.",
      otp: otp, // Keep for debugging - remove in production
      emailSent: emailSent,
      error: emailError ? emailError.message : null,
    })

  } catch (error) {
    console.error("\n❌ SENDOTP ERROR")
    console.error(`   ${error.message}`)
    console.error(`   Stack: ${error.stack}`)
    
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    })
  }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}
