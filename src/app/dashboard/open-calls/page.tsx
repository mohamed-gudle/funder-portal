import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import OpenCallListingPage from '@/features/open-calls/components/open-call-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Open Calls',
  description:
    'Manage and track open funding opportunities. Browse available grants, submit applications, and monitor your funding pipeline.'
};

export default async function Page({ searchParams }: pageProps) {
  await searchParamsCache.parse(searchParams);

  return (
    <PageContainer>
      <div className='w-full max-w-full min-w-0'>
        <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Open Calls'
            description='Manage and track open funding opportunities.'
          />
          <Link
            href='/dashboard/open-calls/new'
            className={
              buttonVariants({ variant: 'default' }) +
              ' w-full shrink-0 justify-center whitespace-nowrap sm:w-auto'
            }
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <OpenCallListingPage />
      </div>
    </PageContainer>
  );
}
