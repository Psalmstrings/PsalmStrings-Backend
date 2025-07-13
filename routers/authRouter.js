const express = require("express")
const authRouter = express.Router()
const {signup, login, verifyEmail, forgotPassword, resetPassword} = require("../controllers/authController")

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/verify/:token", verifyEmail)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)

module.exports = authRouter