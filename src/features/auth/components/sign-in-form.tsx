'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type FormValues = z.infer<typeof formSchema>;

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/dashboard/overview');
    }
  }, [router, session]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { data: signInData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password');
        console.error('Sign in error:', error);
        return;
      }

      if (!signInData) {
        toast.error('Unable to sign in. Please try again.');
        return;
      }

      toast.success('Welcome back!');
      router.replace('/dashboard/overview');
      router.refresh();
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your email to sign in to your account
        </p>
      </div>

      <div className='grid gap-6'>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='name@example.com'
                    autoComplete='email'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='••••••••'
                    autoComplete='current-password'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Sign In
          </Button>
        </Form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
        </div>
      </div>

      <p className='text-muted-foreground px-8 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link
          href='/auth/sign-up'
          className='hover:text-primary underline underline-offset-4'
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
