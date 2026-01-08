import type { TemplateDefinition } from '../types';

export type TemplateArgs = {
  name: string;
  resetLink: string;
};

export const subject = () => 'Reset your password';

export const html = ({ name, resetLink }: TemplateArgs) => `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f7f7f8; padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td>
            <h1 style="color: #111827;">Hi ${name || 'there'},</h1>
            <p style="color: #374151; line-height: 1.6;">
              You requested to reset your password. Click the link below to set a new password.
            </p>
            <p style="margin: 24px 0;">
              <a
                href="${resetLink}"
                style="
                  background-color: #111827;
                  color: #ffffff;
                  padding: 12px 24px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br />
              <a href="${resetLink}" style="color: #111827;">${resetLink}</a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

export const template: TemplateDefinition<TemplateArgs> = {
  subject,
  html,
  requiredFields: ['resetLink']
};
