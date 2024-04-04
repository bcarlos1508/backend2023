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
      return res.status(400).json({ status: 'error', message: 'User not found.' });
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
      <p>Hello,</p>
      <p>You have requested to reset your password. Click on the following link to reset it:</p>
      <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      <p>This link will expire in 1 hour.</p>
    `;
    
    await MailService.sendMail(user.email, subject, htmlContent);

    return res.status(200).json({ status: 'success', message: 'A password recovery link has been sent to your email address.' });
  } catch (error) {
    console.error('Error sending recovery email:', error);
    return res.status(500).json({ status: 'error', message: 'Error sending the recovery email.' });
  }
};

export { sendRecoveryEmail };
