import type { TemplateDefinition } from '../types';

export type TemplateArgs = {
  name: string;
  resetLink: string;
  expiresInMinutes: number;
};

export const subject = () => 'Reset your Funders Portal password';

export const html = ({ name, resetLink, expiresInMinutes }: TemplateArgs) => `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f7f7f8; padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td>
            <h1 style="color: #111827;">Password reset requested</h1>
            <p style="color: #374151; line-height: 1.6;">
              Hi ${name},
            </p>
            <p style="color: #374151; line-height: 1.6;">
              We received a request to reset your password. Use the button below to choose a new one.
              This link expires in ${expiresInMinutes} minutes for security reasons.
            </p>
            <p style="margin: 24px 0;">
              <a
                href="${resetLink}"
                style="
                  background-color: #dc2626;
                  color: #ffffff;
                  padding: 12px 24px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                Reset password
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If you did not request this reset, you can safely ignore this email.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
              This link will expire in ${expiresInMinutes} minutes for your security.
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
  requiredFields: ['name', 'resetLink', 'expiresInMinutes']
};
