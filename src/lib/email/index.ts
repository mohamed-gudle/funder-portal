'use server';

import { emailClient } from './emailClient';
import {
  renderTemplate,
  type TemplateArgs,
  type TemplateName
} from './templateRenderer';
import type { SendEmailOptions } from './types';

class EmailService {
  async send<TTemplate extends TemplateName>(
    templateName: TTemplate,
    args: TemplateArgs<TTemplate>,
    options?: SendEmailOptions
  ) {
    if (!options?.to) {
      throw new Error('A destination email address ("to") is required.');
    }

    const rendered = renderTemplate(templateName, args);

    await emailClient.send({
      ...options,
      ...rendered
    });
  }

  preview<TTemplate extends TemplateName>(
    templateName: TTemplate,
    args: TemplateArgs<TTemplate>
  ) {
    return renderTemplate(templateName, args);
  }
}

export const emailService = new EmailService();
export type { TemplateArgs, TemplateName } from './templateRenderer';
export type { SendEmailOptions } from './types';
