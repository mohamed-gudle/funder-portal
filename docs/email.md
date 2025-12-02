# Email Service

This document explains how transactional emails are handled in the Funders Portal application.

## Overview

- A centralized service is exposed from `src/lib/email`.
- Templates live in `src/lib/email/templates` and each template defines its own arguments, subject, and HTML body.
- Providers (SMTP or Resend) are selected at runtime via the `EMAIL_PROVIDER` environment variable.
- All email configuration values live in `.env` (placeholders in `env.example.txt`).

## Environment Variables

```
EMAIL_PROVIDER=smtp # or resend

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=

# Resend
RESEND_API_KEY=
RESEND_FROM=
```

- Set `EMAIL_PROVIDER` to `smtp` or `resend`.
- When using SMTP, make sure the host/port credentials and `SMTP_FROM` address are provided.
- When using Resend, configure the API key and default `RESEND_FROM` address.

## Usage

```ts
import { emailService } from '@/lib/email';

await emailService.send(
  'welcomeEmail',
  {
    name: user.name,
    onboardingLink: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
  },
  {
    to: user.email
  }
);
```

- `templateName` must match one of the files under `src/lib/email/templates`.
- `args` must contain all required fields defined by that template.
- `options` accepts `to`, `from`, `cc`, and `bcc`. `from` is optional and defaults to the provider-specific environment variable.
- Use `emailService.preview(name, args)` to render the subject and HTML without sending (useful for tests or admin previews).

## Adding Templates

Create a new file in `src/lib/email/templates` that exports:

```ts
export type TemplateArgs = { /* template specific fields */ };

export const subject = (args: TemplateArgs) => '...';
export const html = (args: TemplateArgs) => `<html>...</html>`;

export const template = {
  subject,
  html,
  requiredFields: ['fieldA', 'fieldB']
} as const;
```

Finally, register the template in `src/lib/email/templates/index.ts`.

## Providers

- **SMTP** uses Nodemailer under the hood and establishes a transporter with the credentials listed in the environment.
- **Resend** uses the official `resend` SDK and surfaces API errors as thrown exceptions.

If the configuration is incomplete or a provider returns an error, the service throws so the caller can surface a useful message.
