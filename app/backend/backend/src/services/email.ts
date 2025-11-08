// Email service - Email sending management with Nodemailer
import nodemailer from 'nodemailer';
import { logger } from './logger';

// Interface for email options
interface EmailOptions {
  to: string;      // Recipient
  subject: string; // Email subject
  text?: string;   // Text version (optional)
  html?: string;   // HTML version (optional)
}

// Centralized email service
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // SMTP transporter configuration
    this.transporter = nodemailer.createTransport({
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
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Check SMTP credentials
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        logger.warn('SMTP credentials not configured, email not sent');
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
      logger.info(`Email sent successfully to ${options.to}: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', { error: String(error) });
      return false;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
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
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
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
export const emailService = new EmailService();
