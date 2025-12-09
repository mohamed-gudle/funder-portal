import { templates } from './templates';
import type { RenderedTemplate, TemplateDefinition } from './types';

type TemplatesMap = typeof templates;

type InferTemplateArgs<T> =
  T extends TemplateDefinition<infer Args> ? Args : never;

export type TemplateName = keyof TemplatesMap;

export type TemplateArgs<TTemplate extends TemplateName> = InferTemplateArgs<
  TemplatesMap[TTemplate]
>;

export const AVAILABLE_TEMPLATE_NAMES = Object.keys(
  templates
) as TemplateName[];

export const renderTemplate = <TTemplate extends TemplateName>(
  templateName: TTemplate,
  args: TemplateArgs<TTemplate>
): RenderedTemplate => {
  const template = templates[templateName] as TemplateDefinition<
    TemplateArgs<TTemplate>
  >;

  if (!template) {
    throw new Error(`Email template "${templateName}" was not found.`);
  }

  validateTemplateArgs(templateName, template, args);

  return {
    subject: template.subject(args),
    html: template.html(args)
  };
};

const validateTemplateArgs = <TArgs extends Record<string, unknown>>(
  templateName: string,
  template: TemplateDefinition<TArgs>,
  args: TArgs
) => {
  const missingFields = template.requiredFields.filter((field) => {
    if (!Object.prototype.hasOwnProperty.call(args, field)) {
      return true;
    }

    const value = args[field];

    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      return true;
    }

    return false;
  });

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required field(s) for template "${templateName}": ${missingFields.join(', ')}`
    );
  }
};
