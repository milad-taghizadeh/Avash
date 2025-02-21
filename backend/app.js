require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { fullName, email, mobile, message } = req.body;

    if (!fullName || !email || !mobile || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `یک پیام از سایت دارید`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="text-align: center; color: #333;">Message from avashmohaseb.ir</h2>
                    <hr>
                    <p><strong>Full Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Mobile:</strong> ${mobile}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                        <p>${message}</p>
                    </div>
                    <hr>
                    <p style="text-align: center; font-size: 12px; color: #777;">This email was sent from your website contact form.</p>
                </div>
            `,
        };

        const t = await transporter.sendMail(mailOptions);
        console.log(t);
        res.status(200).json({ success: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending email', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});