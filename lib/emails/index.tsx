import { Resend } from 'resend';
import { Email } from './email';
import { siteConfig } from '../config/site';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA code: ',
    react: (
      <Email
        title='Verify your email address'
        description={`Thanks for starting the new ${siteConfig.name} account creation process We wan't to make sure its really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.`}
        verificationCode={token}
      />
    ),
  });
};
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;
  const to = {
    url: resetLink,
    title: 'reset',
  };

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    react: (
      <Email
        title='Verify your email address'
        description={`Thanks for starting the new ${siteConfig.name} account creation process We wan't to make sure its really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.`}
        redirect={to}
      />
    ),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;
  const to = {
    url: confirmLink,
    title: 'Comfirm',
  };

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm Your Email',
    react: (
      <Email
        title='Verify your email address'
        description={`Thanks for starting the new ${siteConfig.name} account creation process We wan't to make sure its really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.`}
        redirect={to}
      />
    ),
  });
};
