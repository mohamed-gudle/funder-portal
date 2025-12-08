# Better Auth Integration

This project uses [Better Auth](https://better-auth.com) for authentication. The custom sign-in and sign-up forms are fully integrated with Better Auth.

## Features

- ✅ Custom email/password authentication
- ✅ GitHub OAuth (optional)
- ✅ Form validation with Zod
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Password strength requirements
- ✅ Forgot password link

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Better Auth Secret (generate using: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string
```

Optional (for GitHub OAuth):

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Generate Secret Key

Generate a secure secret key for Better Auth:

```bash
openssl rand -base64 32
```

Add this to your `BETTER_AUTH_SECRET` in `.env.local`.

### 3. Setup GitHub OAuth (Optional)

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create a new OAuth App
3. Set the callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

### 4. MongoDB Setup

Make sure your MongoDB connection string is configured in `MONGODB_URI`. Better Auth will automatically create the necessary collections.

## Components

### SignInForm

Located at: `src/features/auth/components/sign-in-form.tsx`

Features:
- Email/password authentication
- GitHub OAuth option
- Forgot password link
- Form validation
- Loading states

### SignUpForm

Located at: `src/features/auth/components/sign-up-form.tsx`

Features:
- Name, email, password fields
- Password confirmation
- Password strength validation (min 8 chars, uppercase, lowercase, number)
- GitHub OAuth option
- Form validation
- Loading states

## Usage

The forms are automatically integrated into:
- `/auth/sign-in` - Sign in page
- `/auth/sign-up` - Sign up page

After successful authentication, users are redirected to `/dashboard`.

## API Routes

Better Auth API routes are handled at: `/api/auth/[...all]`

This includes:
- `/api/auth/sign-in` - Email/password sign in
- `/api/auth/sign-up` - User registration
- `/api/auth/callback/github` - GitHub OAuth callback
- And more...

## Session Management

To use the session in your components:

```tsx
'use client';

import { useSession } from '@/lib/auth-client';

export function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome {session.user.name}!</div>;
}
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Customization

To customize the forms, edit:
- `src/features/auth/components/sign-in-form.tsx`
- `src/features/auth/components/sign-up-form.tsx`

To modify validation rules, update the `formSchema` in each component.

## Resources

- [Better Auth Documentation](https://better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
