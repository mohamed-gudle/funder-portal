export type EmailProvider = 'smtp' | 'resend';

export type SendEmailPayload = {
  to: string | string[];
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
};

export type SendEmailOptions = Omit<SendEmailPayload, 'subject' | 'html'>;

export type TemplateDefinition<TArgs extends Record<string, unknown>> = {
  subject: (args: TArgs) => string;
  html: (args: TArgs) => string;
  requiredFields: readonly (keyof TArgs & string)[];
};

export type RenderedTemplate = {
  subject: string;
  html: string;
};
