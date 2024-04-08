import crypto from 'crypto';
import RecoveryToken from '../dao/models/recoveryToken.js';
import User from '../dao/models/users.js';
import MailService from '../services/mailService.js';
import config from './config/config.js';

const sendRecoveryEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Usuario no encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expireAt = new Date(Date.now() + 3600000);

    const recoveryToken = new RecoveryToken({
      userId: user._id,
      token,
      expireAt,
    });

    await recoveryToken.save();

    const resetPasswordLink = `${config.mailing.BASE}/reset-password/${token}`;
    const subject = 'Password Recovery';
    const htmlContent = `
      <p>Hola,</p>
      <p>Ha solicitado reestablecer su contraseña. Haga click en el siguiente enlace para reestablecerla:</p>
      <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;
    
    await MailService.sendMail(user.email, subject, htmlContent);

    return res.status(200).json({ status: 'success', message: 'Se ha enviado un enlace de recuperación de contraseña a su dirección de correo electrónico.' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico de recuperación:', error);
    return res.status(500).json({ status: 'error', message: 'Error al enviar el correo electrónico de recuperación.' });
  }
};

export { sendRecoveryEmail };
