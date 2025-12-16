import { createAuthClient } from 'better-auth/react';

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  undefined;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include'
  }
});

export const { signIn, signUp, useSession } = authClient;
