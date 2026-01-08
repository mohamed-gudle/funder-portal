'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logged out successfully');
          router.push('/auth/sign-in'); // Redirect to login after logout
        }
      }
    });
  };

  return (
    <Button onClick={handleLogout} variant='outline' className='w-full'>
      Logout
    </Button>
  );
}
