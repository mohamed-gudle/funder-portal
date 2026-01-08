import { APIError, betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import connectDB from '@/lib/db'; // your mongodb client
import { MongoClient, ObjectId } from 'mongodb';
import TeamMember from '@/server/models/team-member.model';
import { emailClient } from '@/lib/email/emailClient';
import * as verificationEmail from '@/lib/email/templates/verificationEmail';
import * as resetPasswordEmail from '@/lib/email/templates/resetPasswordEmail';
import { randomUUID } from 'crypto';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

const allowedSignupDomains = ['africacen.org', 'bayesconsultants.com'];

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET || 'default-secret-change-in-production',
  database: mongodbAdapter(db),

  database: mongodbAdapter(db),

  baseURL: (() => {
    const url =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';
    return url.endsWith('/api/auth') ? url : `${url}/api/auth`;
  })(),

  trustedOrigins: process.env.NEXT_PUBLIC_APP_URL
    ? [process.env.NEXT_PUBLIC_APP_URL, 'https://funders.africacen.org']
    : undefined,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false
    },
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/'
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await emailClient.send({
        to: user.email,
        subject: resetPasswordEmail.subject(),
        html: resetPasswordEmail.html({
          name: user.name || '',
          resetLink: url
        })
      });
    }
  },
  plugins: [admin()],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email =
            typeof user.email === 'string' ? user.email.toLowerCase() : '';
          const domain = email.split('@')[1];

          if (!domain || !allowedSignupDomains.includes(domain)) {
            throw new APIError('FORBIDDEN', {
              message:
                'Sign ups are limited to africacen.org and bayesconsultants.com email addresses.'
            });
          }

          // Sync role from TeamMember
          await connectDB();
          const teamMember = await TeamMember.findOne({ email });
          if (teamMember) {
            // @ts-ignore
            user.role = teamMember.role;
          }
        },
        after: async (user) => {
          // Send email
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const token = randomUUID();

          // Manually update user with verification token
          await connectDB();
          const client = new MongoClient(process.env.MONGODB_URI!);
          await client.connect();
          const db = client.db();

          await db.collection('user').updateOne(
            { email: user.email },
            {
              $set: {
                emailVerified: false,
                verificationToken: token
              }
            }
          );
          await client.close();

          const link = `${baseUrl}/verify-email?token=${token}`;

          await emailClient.send({
            to: user.email,
            subject: verificationEmail.subject(),
            html: verificationEmail.html({
              name: user.name,
              verificationLink: link
            })
          });
        }
      }
    }
  }
});
