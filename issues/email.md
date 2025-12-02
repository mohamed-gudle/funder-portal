Feature: Integrate Email Service Into Next.js Application
Summary

We need to introduce a centralized, scalable email service into the Next.js application. The system should support both SMTP and Resend as providers, use a clean file structure for templates, and offer a uniform interface for generating and sending emails. Environment variables should be clearly documented via .env.example with placeholder values.

Goals

Add an email service layer accessible throughout the application.

Support SMTP and Resend providers (switchable via config).

Implement an organized file structure for templates (each template in its own file).

Provide a consistent way to pass data/arguments into templates.

Enable rendering email templates on the fly (e.g., for transactional emails).

Update .env.example with all required placeholder variables.

Requirements
1. Environment Variables

Add the following placeholders in .env.example:

# Email Provider: smtp | resend
EMAIL_PROVIDER=smtp

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=

# Resend
RESEND_API_KEY=
RESEND_FROM=

2. Proposed File Structure
/src
  /lib
    /email
      index.ts                # Entry point for the email service
      emailClient.ts          # Provider selection & transport setup (SMTP / Resend)
      templateRenderer.ts     # Renders templates with passed args
      /templates
        welcomeEmail.ts       # Example template
        passwordReset.ts      # Example template
        ...

3. Email Template Format

Each template file should export:

export type TemplateArgs = { /* required dynamic fields */ };

export const subject = (args: TemplateArgs) => `...`;

export const html = (args: TemplateArgs) => `
  <html>
    ...
  </html>
`;


This gives consistent argument passing, predictable structure, and easy extendability.

4. Centralized Email Service

emailService.send(templateName, args, options?) should:

Load the correct template.

Validate required arguments.

Render subject + HTML.

Delegate sending to the selected provider client.

Example usage:

await emailService.send("welcomeEmail", {
  name: user.name,
  onboardingLink,
});

5. Provider Implementation
SMTP

Use nodemailer or similar library.

Resend

Use @resend/client.

The service should automatically route to the active provider based on EMAIL_PROVIDER.

Acceptance Criteria

 .env.example updated with placeholder variables.

 Template folder created with at least 2 sample templates.

 Email service exposes a simple unified API.

 SMTP and Resend clients fully functional behind the service interface.

 Templates render correctly with dynamic arguments.

 Developer documentation added (README.md or /docs/email.md).