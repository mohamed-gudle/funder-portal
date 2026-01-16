'use client';

import { ChatInterface } from '@/features/grant-drafter/components/chat-interface';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/lib/auth-client';

export default function GrantDrafterPage() {
  const { user } = useSession().data || {};

  return (
    <PageContainer scrollable={true}>
      <div className='flex h-full flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Grant Application Drafter'
            description='Draft proposals using AI with context from Open Calls.'
          />
        </div>
        <Separator />

        <ChatInterface userId={user?.id || ''} />
      </div>
    </PageContainer>
  );
}
