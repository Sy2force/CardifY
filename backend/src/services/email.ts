// Service d'email - Gestion des envois d'emails avec Nodemailer
import nodemailer from 'nodemailer';
import { logger } from './logger';

// Interface pour les options d'email
interface EmailOptions {
  to: string;      // Destinataire
  subject: string; // Sujet de l'email
  text?: string;   // Version texte (optionnel)
  html?: string;   // Version HTML (optionnel)
}

// Service d'email centralisé
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration du transporteur SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER, // Email SMTP
        pass: process.env.SMTP_PASS, // Mot de passe SMTP
      },
    });
  }

  // Méthode générique pour envoyer un email
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Vérification des credentials SMTP
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        logger.warn('Identifiants SMTP non configurés, email non envoyé');
        return false;
      }

      const mailOptions = {
        from: `"Cardify" <${process.env.SMTP_USER}>`, // Expéditeur
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email envoyé avec succès à ${options.to}: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Échec envoi email:', { error: String(error) });
      return false;
    }
  }

  // Email de bienvenue pour nouveaux utilisateurs
  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const subject = 'Bienvenue sur Cardify !';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Bienvenue sur Cardify, ${firstName} !</h1>
        <p>Merci de rejoindre notre plateforme. Vous pouvez maintenant créer et gérer vos cartes de visite professionnelles.</p>
        <p>Commencez par :</p>
        <ul>
          <li>Créer votre première carte de visite</li>
          <li>Explorer les cartes d'autres professionnels</li>
          <li>Vous connecter avec votre réseau</li>
        </ul>
        <p>Cordialement,<br>L'équipe Cardify</p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }

  // Email de réinitialisation de mot de passe
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const subject = 'Demande de réinitialisation de mot de passe';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Demande de réinitialisation de mot de passe</h1>
        <p>Vous avez demandé une réinitialisation de mot de passe pour votre compte Cardify.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        <p>Cordialement,<br>L'équipe Cardify</p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }
}

// Instance unique du service d'email
export const emailService = new EmailService();
