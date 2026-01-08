import { redirect } from 'next/navigation';
import { MongoClient } from 'mongodb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='text-destructive text-center'>
              Invalid Request
            </CardTitle>
          </CardHeader>
          <CardContent className='text-center'>
            <p>No verification token provided.</p>
            <Button asChild className='mt-4'>
              <Link href='/auth/sign-in'>Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  let success = false;
  let message = '';

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('user').findOneAndUpdate(
      { verificationToken: token },
      {
        $set: { emailVerified: true },
        $unset: { verificationToken: '' }
      }
    );

    if (result) {
      success = true;
    } else {
      // Check if maybe already verified?
      // Or token is invalid.
      message = 'Invalid or expired verification token.';
    }
  } catch (error) {
    console.error('Verification error:', error);
    message = 'An error occurred during verification.';
  } finally {
    await client.close();
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle
            className={`text-center ${success ? 'text-green-600' : 'text-destructive'}`}
          >
            {success ? 'Email Verified' : 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p>
            {success
              ? 'Your email has been successfully verified. You can now log in.'
              : message}
          </p>
          <Button asChild className='mt-4'>
            <Link href={success ? '/auth/sign-in' : '/'}>
              {success ? 'Login' : 'Go Home'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
