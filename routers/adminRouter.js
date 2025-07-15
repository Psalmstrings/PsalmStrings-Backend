const express = require("express")
const adminRouter = express.Router()
const {signup, login, verifyEmail, forgotPassword, resetPassword} = require("../controllers/adminController")
const verifyAdmin = require("../middlewares/isAnAdmin")


adminRouter.post("/adminsignup", signup)
adminRouter.post("/adminlogin", login)
adminRouter.post("/verify/:token", verifyEmail)
adminRouter.post("/forgot-password", forgotPassword)
adminRouter.post("/reset-password", resetPassword)

module.exports = adminRouter