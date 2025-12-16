import { APIError, betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import connectDB from '@/lib/db'; // your mongodb client
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

const allowedSignupDomains = ['africacen.org', 'bayesconsultants.com'];

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: process.env.NEXT_PUBLIC_APP_URL
    ? [process.env.NEXT_PUBLIC_APP_URL]
    : undefined,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookiePrefix: 'better-auth'
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  emailAndPassword: {
    enabled: true
  },
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
        }
      }
    }
  }
});
