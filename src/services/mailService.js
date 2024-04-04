import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import Logger from '../utils/logger.js';
import config from '../config/config.js';

dotenv.config();

const MAILING_PASSWORD = config.mailing.MAILING_PASSWORD;
const MAILING_USER = config.mailing.MAILING_USER;

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAILING_USER,
                pass: MAILING_PASSWORD,
            },
        });
    }

    async sendMail(to, subject, htmlContent) {
        try {
            const mailOptions = {
                from: MAILING_USER,
                to: to,
                subject: subject,
                html: htmlContent,
            };
            await this.transporter.sendMail(mailOptions);
            Logger.info('Correo enviado exitosamente');
        } catch (error) {
            Logger.error('Error al enviar email:', error);
            throw error;
        }
    }

    async sendPasswordResetEmail(email, resetToken) {
        const subject = 'Se requiere reestablecer contraseña';
        const htmlContent = `
            <p>Hola,</p>
            <p>Ha solicitado restablecer su contraseña. Haga clic en el siguiente enlace para restablecerla:</p>
            <a href="${config.mailing.BASE}/reset-password/${resetToken}">Restablecer contraseña</a>
            <p>Si no lo solicitó, por favor ignorar este correo.</p>
        `;
        
        try {
            await this.sendMail(email, subject, htmlContent);
        } catch (error) {
            Logger.error('Error al enviar mail para reestablecer la contraseña:', error);
        }
    }
}

export default new MailService();
