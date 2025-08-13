import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // Your email
                pass: process.env.SMTP_PASS, // Your email password or app password
            },
        });
    }

    async sendMail({to, subject, html, text}) {
        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to,
            subject,
            text,
            html,
        };
        
        return this.transporter.sendMail(mailOptions);
    }
}

export default new EmailService();

