import nodemailer from 'nodemailer';
import { Resend } from 'resend';

import type { EmailProvider, SendEmailPayload } from './types';

let smtpTransporter: nodemailer.Transporter | null = null;
let resendClient: Resend | null = null;

export class EmailClient {
  async send(payload: SendEmailPayload) {
    assertServerEnvironment();

    const provider = getProvider();

    if (provider === 'resend') {
      await sendWithResend(payload);
      return;
    }

    await sendWithSmtp(payload);
  }
}

const sendWithSmtp = async (payload: SendEmailPayload) => {
  const transporter = getSmtpTransporter();

  const from = payload.from ?? process.env.SMTP_FROM;

  if (!from) {
    throw new Error('SMTP_FROM is not configured.');
  }

  await transporter.sendMail({
    from,
    to: payload.to,
    cc: payload.cc,
    bcc: payload.bcc,
    subject: payload.subject,
    html: payload.html
  });
};

const sendWithResend = async (payload: SendEmailPayload) => {
  const client = getResendClient();

  const from = payload.from ?? process.env.RESEND_FROM;

  if (!from) {
    throw new Error('RESEND_FROM is not configured.');
  }

  const { error } = await client.emails.send({
    from,
    to: payload.to,
    cc: payload.cc,
    bcc: payload.bcc,
    subject: payload.subject,
    html: payload.html
  });

  if (error) {
    throw new Error(error.message);
  }
};

const getSmtpTransporter = () => {
  if (smtpTransporter) {
    return smtpTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseNumber(process.env.SMTP_PORT, 587);
  const username = process.env.SMTP_USERNAME;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !username || !password) {
    throw new Error('SMTP configuration is incomplete.');
  }

  smtpTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: username,
      pass: password
    }
  });

  return smtpTransporter;
};

const getResendClient = () => {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  resendClient = new Resend(apiKey);

  return resendClient;
};

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
};

const getProvider = (): EmailProvider => {
  const provider = (process.env.EMAIL_PROVIDER ?? 'smtp').toLowerCase();

  if (provider !== 'smtp' && provider !== 'resend') {
    return 'smtp';
  }

  return provider;
};

const assertServerEnvironment = () => {
  if (typeof window !== 'undefined') {
    throw new Error('EmailClient can only be used in a server environment.');
  }
};

export const emailClient = new EmailClient();
