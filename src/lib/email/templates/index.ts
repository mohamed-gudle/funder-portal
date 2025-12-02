import { template as passwordResetTemplate } from './passwordReset';
import { template as welcomeEmailTemplate } from './welcomeEmail';

export const templates = {
  welcomeEmail: welcomeEmailTemplate,
  passwordReset: passwordResetTemplate
} as const;

export type EmailTemplateName = keyof typeof templates;
