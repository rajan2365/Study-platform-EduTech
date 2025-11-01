const express = require("express");

//router me convert krna 
const router = express.Router()
const {contactUsController} = require("../controllers/ContactUs");

router.post("/contact",contactUsController)

module.exports = router
