const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
// const { create } = require("./User");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    }
});

// send the mail
async function sendVerificationEmail(email, otp) {
    try {
        // Create a transporter to send emails
        // Define the email options
        // Send the email
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            // this is the template of email address !\ 
            emailTemplate(otp)
        );
        console.log("Email send successfully: ", mailResponse.response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

//schema me save otp
OTPSchema.pre("save", async function (next) {
    console.log("New document saved in database");
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
