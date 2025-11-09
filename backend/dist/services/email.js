"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
// Email service - Email sending management with Nodemailer
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
// Centralized email service
class EmailService {
    constructor() {
        // SMTP transporter configuration
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // SMTP email
                pass: process.env.SMTP_PASS, // SMTP password
            },
        });
    }
    // Generic method to send an email
    async sendEmail(options) {
        try {
            // Check SMTP credentials
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                logger_1.logger.warn('SMTP credentials not configured, email not sent');
                return false;
            }
            const mailOptions = {
                from: `"Cardify" <${process.env.SMTP_USER}>`, // Sender
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger_1.logger.info(`Email sent successfully to ${options.to}: ${info.messageId}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error('Failed to send email:', { error: String(error) });
            return false;
        }
    }
    // Welcome email for new users
    async sendWelcomeEmail(email, firstName) {
        const subject = 'Welcome to Cardify!';
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Cardify, ${firstName}!</h1>
        <p>Thank you for joining our platform. You can now create and manage your professional business cards.</p>
        <p>Get started by:</p>
        <ul>
          <li>Creating your first business card</li>
          <li>Exploring other professionals' cards</li>
          <li>Connecting with your network</li>
        </ul>
        <p>Best regards,<br>The Cardify Team</p>
      </div>
    `;
        return this.sendEmail({ to: email, subject, html });
    }
    // Password reset email
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const subject = 'Password Reset Request';
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You requested a password reset for your Cardify account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Cardify Team</p>
      </div>
    `;
        return this.sendEmail({ to: email, subject, html });
    }
}
// Unique instance of the email service
exports.emailService = new EmailService();
