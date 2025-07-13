const express = require("express")
const adminRouter = express.Router()
const {signup, login, verifyEmail, forgotPassword, resetPassword} = require("../controllers/authController")


adminRouter.post("/signup", signup)
adminRouter.post("/login", login)
adminRouter.post("/verify/:token", verifyEmail)
adminRouter.post("/forgot-password", forgotPassword)
adminRouter.post("/reset-password", resetPassword)

module.exports = adminRouter