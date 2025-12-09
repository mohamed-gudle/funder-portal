import Image from 'next/image';
import { SignInForm } from './sign-in-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-white' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image src='/logo.svg' alt='logo' width={150} height={150} />
        </div>
        <div className='relative z-20 mt-auto'></div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <SignInForm />
      </div>
    </div>
  );
}
