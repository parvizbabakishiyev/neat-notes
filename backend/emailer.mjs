import { sendEmail } from './utils.mjs';

export function resetPassword(to, resetLink, validity) {
  const emailText = `** Neat Notes - Notes made easy
  ------------------------------------------------------------
  
  A password reset request is made for your email.
  Please click the button below to reset your password.

  Reset password >> (${resetLink})

  The link is valid for ${validity}.
  
  `;

  return sendEmail(to, emailText, 'Password Reset');
}
