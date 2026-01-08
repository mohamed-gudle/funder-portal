import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  undefined;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include'
  },
  plugins: [adminClient()]
});

export const { signIn, signUp, useSession } = authClient;
