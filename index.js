const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan("dev"))


const connectToDB = require("./config/connectToDB")
const authRouter = require("./routers/authRouter")
const adminRouter = require("./routers/adminRouter");
const transporter = require("./services/nodemailer/transporter")
const commentRouter = require("./routers/commentRouter");
const movieRouter = require("./routers/movieRouter");
const userRouter = require("./routers/userRouter");


app.listen(4008, () => {
    console.log('listening to port 4008');
})


app.get("/", (req, res)=>{res.send("Welcome to Psalmstrings Movie App Backend")})
app.use("/api/auth", authRouter)
app.use("/api/comment", commentRouter)
app.use("/api/movie", movieRouter)
app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)


app.all("/{*any}", (req, res) => {
    res.json(`${req.method} ${req.originalUrl} is not an endpoint on this server.`)
})
