
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// this function used middleware to authenticate 
exports.auth = async (req, res, next) => {
    try {
//         const authHeader = req.header("Authorization");
// const token = req.cookies.token ||
//               req.body.token ||
//               (authHeader && authHeader.startsWith("Bearer ")
//                 ? authHeader.replace("Bearer ", "")
//                 : null);

        const token = req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");

            console.log("👉 Token from Redux:", token)


        //token are  missing jwt
        if (!token) {
            return res.status(401).json({
                success: false,
                message: `Token Missing`
            });
        }

        try {
            // Verifying the JWT using the secret key
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, message: "token is invalid" });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
        });
    }
};


//student middeware
exports.isStudent = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        if (userDetails.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected for Student",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `User Role Can't be Verified`
        });
    }
};

//Admin portel ke liye
exports.isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        if (userDetails.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};


//Instructor ke liye!

exports.isInstructor = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        console.log(userDetails);

        console.log(userDetails.accountType);

        if (userDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};