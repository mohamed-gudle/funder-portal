import type { TemplateDefinition } from '../types';

export type TemplateArgs = {
  name: string;
  position: string;
  invitationLink: string;
  organizationName?: string;
};

export const subject = ({ name, organizationName }: TemplateArgs) =>
  `You've been invited to join ${organizationName || 'Funders Portal'}${name ? `, ${name}` : ''}!`;

export const html = ({
  name,
  position,
  invitationLink,
  organizationName = 'Funders Portal'
}: TemplateArgs) => `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f7f7f8; padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td>
            <h1 style="color: #111827;">Hi ${name},</h1>
            <p style="color: #374151; line-height: 1.6;">
              You've been invited to join <strong>${organizationName}</strong> as a <strong>${position}</strong>!
            </p>
            <p style="color: #374151; line-height: 1.6;">
              We're excited to have you on our team. Click the button below to accept the invitation and set up your account.
            </p>
            <p style="margin: 24px 0;">
              <a
                href="${invitationLink}"
                style="
                  background-color: #111827;
                  color: #ffffff;
                  padding: 12px 24px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                Accept Invitation
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br />
              <a href="${invitationLink}" style="color: #111827;">${invitationLink}</a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
              You are receiving this email because someone invited you to join ${organizationName}.
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
  requiredFields: ['name', 'position', 'invitationLink']
};
