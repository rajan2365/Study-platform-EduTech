// const Razorpay = require("razorpay");

// exports.instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY,
//     key_secret: process.env.RAZORPAY_SECRET,
//f-razorpay.js
// });
const Stripe = require("stripe");

exports.instance = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2024-06-20", // optional, but recommended to lock API version
});
