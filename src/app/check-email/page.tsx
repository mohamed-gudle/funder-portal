import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ResendEmailButton } from './resend-button';
import { LogoutButton } from './logout-button';

export default function CheckEmailPage() {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p>
            We have sent a verification link to your email address. Please check
            your inbox (and spam folder) and click the link to activate your
            account.
          </p>
          <p className='text-sm text-gray-500'>
            Once verified, you will be able to access the dashboard.
          </p>
          <div className='flex flex-col gap-3'>
            <ResendEmailButton />
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
