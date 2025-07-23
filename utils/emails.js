const nodemailer = require('nodemailer');
require('dotenv').config();

// 1. Setup reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // e.g. smtp.gmail.com
    port: process.env.MAIL_PORT, // usually 465 (secure) or 587
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// 2. Verify transport
transporter.verify((err, success) => {
    if (err) {
        console.error('❌ Email transporter setup failed:', err);
    } else {
        console.log('✅ Email transporter ready to send messages');
    }
});

// 3. Send email
async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: `"NXG Markets" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text: text || '',  // optional plain text version
        html: html || ''   // required HTML content
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendEmail
};
