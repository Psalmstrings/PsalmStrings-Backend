const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    secure: false,
    port: 587,
    auth: {
        user: process.env.nodemailer_email,
        pass: process.env.nodemailer_pass
    },
})

module.exports = transporter;

transporter.verify((error, success) => {
    if (error) {
        console.log("Error in nodemailer transporter: ", error);
    } else {
        console.log("Nodemailer transporter is ready to send emails");
    }
}
);