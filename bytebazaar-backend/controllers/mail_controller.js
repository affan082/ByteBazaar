const nodemailer = require('nodemailer');


exports.MailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
        tls: {
            rejectUnauthorized: false
        }
   });


