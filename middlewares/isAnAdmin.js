const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");

const verifyAdmin = async (req, res, next) => {
    try {
        
        // 3. Get fresh user data from database
        const user = await userModel.findById({role: "admin"});
        
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Only Admin can Sign in"
            });
        }

        // 4. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token"
        });
    }
};

module.exports = verifyAdmin