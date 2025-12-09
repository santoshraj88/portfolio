const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const nodemailer = require('nodemailer');

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILGUN_SMTP_USER,
        pass: process.env.MAILGUN_SMTP_PASSWORD
    }
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill in all required fields' 
        });
    }

    const emailData = {
        from: `"${name}" <santosh@${MAILGUN_DOMAIN}>`,
        to: `santosh@${MAILGUN_DOMAIN}`,
        'h:Reply-To': email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 20px; background-color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #000000;">
                    <div style="padding: 30px; border-bottom: 2px solid #000000;">
                        <h2 style="color: #000000; margin: 0; font-size: 24px; font-weight: 600;">
                            New Contact
                        </h2>
                    </div>
                    <div style="padding: 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                                    <strong style="color: #000000; font-size: 14px;">Name</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                                    <span style="color: #333333; font-size: 14px;">${name}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                                    <strong style="color: #000000; font-size: 14px;">Email</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                                    <span style="color: #333333; font-size: 14px;">${email}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                                    <strong style="color: #000000; font-size: 14px;">Subject</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                                    <span style="color: #333333; font-size: 14px;">${subject}</span>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-left: 3px solid #000000;">
                            <p style="margin: 0 0 10px 0; color: #000000; font-weight: 600; font-size: 14px;">Message</p>
                            <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <div style="padding: 20px 30px; background: #000000; text-align: center;">
                        <p style="margin: 0; color: #ffffff; font-size: 12px;">Portfolio Contact Form</p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        // Try SMTP first
        const mailOptions = {
            from: `"${name}" <santosh@${MAILGUN_DOMAIN}>`,
            to: `santosh@${MAILGUN_DOMAIN}`,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            html: emailData.html
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully! I will get back to you soon.' 
        });
    } catch (smtpError) {
        console.error('SMTP error:', smtpError.message);
        
        // Fallback to Mailgun API
        try {
            await mg.messages.create(MAILGUN_DOMAIN, emailData);
            
            res.json({ 
                success: true, 
                message: 'Message sent successfully! I will get back to you soon.' 
            });
        } catch (apiError) {
            console.error('Mailgun API fallback error:', apiError.message);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send message. Please try again later.' 
            });
        }
    }
};
