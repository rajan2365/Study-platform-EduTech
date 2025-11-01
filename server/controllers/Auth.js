const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();


//sign up 
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
    console.log(response)
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
    approved === "Instructor" ? (approved = false) : (approved = true)

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
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
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


//login  controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please fill up All the Required Fields`,
            })
        }
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            })
        };

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id, role: user.role },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            )

            user.token = token
            user.password = undefined

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Login Success!"
            })
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is Incorrect`,
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        })
    }
}

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;

        //database me se check kre!
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: `User is Already Registered!`,
            })
        }


        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        const result = await OTP.findOne({ otp: otp });
        console.log("Result is generate OTP Function!")
        console.log("OTP", otp);
        console.log("Result", result);
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
        }
        // otp in database! 
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);
        res.status(200).json({
            success: true,
            message: `OTP sent successfully`,
            otp,
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


//changePassword 
exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id);

        const { oldPasssword, newPassword } = req.body;

        const isPasswordMatch = await bcrypt.compare(
            oldPasssword,
            userDetails.password
        )
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "the Passsword is incorrect"
            })

        }

        //update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10); //hashing for Password
        const updateUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )

        // send notification for email id for password change
        try {
            const emailResponse = await mailSender(
                updateUserDetails.email,
                "Password for your account has been updated",
                (
                    updateUserDetails.email,
                    `Password updated successfully for ${updateUserDetails.firstName} ${updateUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
        
    } catch (error) {
        console.error("Error occurred while updating password : ", error)
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    }
};