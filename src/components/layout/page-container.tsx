import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)] w-full'>
          <div className='flex h-full min-w-0 flex-1 flex-col space-y-2 p-3 md:space-y-4 md:p-4 lg:px-6'>
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className='flex h-full w-full min-w-0 flex-1 flex-col space-y-2 p-3 md:space-y-4 md:p-4 lg:px-6'>
          {children}
        </div>
      )}
    </>
  );
}
