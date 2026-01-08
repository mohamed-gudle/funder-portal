'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function ResendEmailButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend email');
      }

      toast.success('Verification email sent!');

      // simplistic cooldown
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <Button
        onClick={handleResend}
        disabled={isLoading || cooldown > 0}
        variant='default'
      >
        {isLoading
          ? 'Sending...'
          : cooldown > 0
            ? `Resend available in ${cooldown}s`
            : 'Resend Verification Email'}
      </Button>
    </div>
  );
}
