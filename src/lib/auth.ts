import { APIError, betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import connectDB from '@/lib/db'; // your mongodb client
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

const allowedSignupDomains = ['africacen.org', 'bayesconsultants.com'];

export const auth = betterAuth({
  database: mongodbAdapter(db),
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
