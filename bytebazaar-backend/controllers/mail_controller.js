const nodemailer = require('nodemailer');

// SMTP configuration
const SMTP_HOST = process.env.MAILEROO_SMTP_HOST;
const SMTP_PORT = 587;
const SMTP_USERNAME = 'bytebazaar@0478dac1d704f845.maileroo.org'; // Replace with your SMTP username
const SMTP_PASSWORD = process.env.MAILEROO_SMTP_PASSWORD; // Replace with your SMTP password
const SMTP_SENDER_NAME = process.env.APPLICATION_NAME; // Replace with your preferred sender name

// Recipient email
// const receiverEmail = 'recipient@example.com'; // Replace with the recipient's email

exports.MailTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
    },
    secure: false,
    requireTLS: true,
});


// export const sendMain = async (req, res) => {
//
// }
//
//
// const mailOptions = {
//     from: `${SMTP_SENDER_NAME} <${SMTP_USERNAME}>`,
//     to: receiverEmail,
//     subject: 'Sending Email using SMTP',
//     text: 'Hey! This is a sample email sent using the Maileroo SMTP server.',
// };
//
//
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.error(`Failed to send email. Error: ${error.message}`);
//     } else {
//         console.log('Email sent successfully:', info);
//     }
// });