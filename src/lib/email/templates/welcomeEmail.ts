import type { TemplateDefinition } from '../types';

export type TemplateArgs = {
  name: string;
  onboardingLink: string;
};

export const subject = ({ name }: TemplateArgs) =>
  `Welcome to Funders Portal${name ? `, ${name}` : ''}!`;

export const html = ({ name, onboardingLink }: TemplateArgs) => `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f7f7f8; padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td>
            <h1 style="color: #111827;">Hi ${name},</h1>
            <p style="color: #374151; line-height: 1.6;">
              Welcome to Funders Portal! Your account is ready and we can't wait for you to explore
              the latest funding opportunities.
            </p>
            <p style="margin: 24px 0;">
              <a
                href="${onboardingLink}"
                style="
                  background-color: #111827;
                  color: #ffffff;
                  padding: 12px 24px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                Get started
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br />
              <a href="${onboardingLink}" style="color: #111827;">${onboardingLink}</a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
              You are receiving this email because you created an account on Funders Portal.
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
  requiredFields: ['name', 'onboardingLink']
};
