// user
// user.role === "seller"
const isAdmin = (req, res, next)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json({
            status: "error",
            message: "You must be an Admin to upload Movies."
        })
    }
    next()
}

module.exports = isAdmin