const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const userModel = require("../models/user");
const sendVerificationEmail = require("../services/nodemailer/sendVerificationEmail");
const generateRandomString = require("../utils/randomString");

const signup = async (req, res, next) => {
    const { password, email, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
        return res.status(400).json({
            status: "error",
            message: "Please provide name, email, and password"
        });
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "Email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // Generate verification token and expiration (5 minutes)
        const token = generateRandomString(8);
        const verificationExp = Date.now() + 900000;

        // Create user
        const user = await userModel.create({ 
            ...req.body, 
            email: email.toLowerCase().trim(),
            password: hashedpassword, 
            verificationToken: token, 
            verificationExp,
            isVerified: false
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Could not create user"
            });
        }
        
        // Send verification email
        const userFirstName = name.split(" ")[0];
        await sendVerificationEmail(email, userFirstName, token);

        res.status(201).json({
            status: "success",
            message: "Sign up successful. Check your email to verify your account"
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred during signup"
        });
    }
};

const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    
    try {
        // Find user with verification token
        const user = await userModel.findOne({ verificationToken: token });
        
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid verification token"
            });
        }

        // Check if token has expired
        if (user.verificationExp < Date.now()) {
            return res.status(403).json({
                status: "error",
                message: "Verification token has expired"
            });


        }



        // Update user as verified
        await userModel.findByIdAndUpdate(user._id, { 
            verificationExp: null, 
            verificationToken: null, 
            isVerified: true 
        });

        res.status(200).json({
            status: "success",
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred during verification"
        });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Please provide both email and password"
        });
    }

    try {
        // Find user by email (case-insensitive)
        const user = await userModel.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        // Check if account is verified
        if (!user.isVerified) {
            return res.status(403).json({
                status: "error",
                message: "Account not verified. Please check your email."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role || "user"
            }, 
            process.env.JWT_SECRET, // Make sure this matches your .env variable
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        // Omit password from user data
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            status: "success",
            message: "Login successful",
            accessToken,
            user: userData.id
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred during login"
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        // Check if user exists
        const user = await userModel.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ 
                status: "error",
                message: "If this email exists, a reset link has been sent" 
            });
        }

        // Generate reset token and expiry (4 minutes)
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiry = Date.now() + 240000;

        // Save to user document
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            service: process.env.EMAIL_SERVICE || "gmail",
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send email
        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link expires in 4 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });

        res.status(200).json({
            status: "success",
            message: "Password reset email sent if account exists"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing your request"
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find user by valid token
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired token"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user and clear token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Password reset successful"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while resetting your password"
        });
    }
};

module.exports = {
    signup,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
};