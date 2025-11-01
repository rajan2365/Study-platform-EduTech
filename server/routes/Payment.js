// const express = require("express");
// const router = express.Router()

// const {capturePayment,verifyPayment,sendPaymentSuccessEmail}=require("../controllers/Payments");
// const {auth,isInstructor,isAdmin,isStudent} = require("../middlewares/auth");


// router.post("/capturePayment",auth,isStudent,capturePayment);
// router.post("/verifyPayment",auth,isStudent,verifyPayment);
// router.post("/sendPaymentSuccessEmail",auth,isStudent,sendPaymentSuccessEmail);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/Payments");
const { auth, isStudent } = require("../middlewares/auth");

// Direct buy (enroll directly)
router.post("/capturePayment", auth, isStudent, capturePayment);

// Confirm enrollment (previously Stripe verify, now just confirms success)
router.post("/verifyPayment", auth, isStudent, verifyPayment);

// Send success email (purchase confirmation)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
