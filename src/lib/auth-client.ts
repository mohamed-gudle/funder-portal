import { createAuthClient } from 'better-auth/react';

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  undefined;

export const authClient = createAuthClient(
  baseURL
    ? {
        // Keep Better Auth calls anchored to the correct origin when provided.
        baseURL
      }
    : {}
);

export const { signIn, signUp, useSession } = authClient;
