import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import BilateralListingPage from '@/features/bilateral-engagements/components/bilateral-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Bilateral Engagements',
  description:
    'Track bilateral funding engagements and partnership conversations. Manage relationships with funders and monitor engagement progress.'
};

export default async function Page({ searchParams }: pageProps) {
  await searchParamsCache.parse(searchParams);

  return (
    <PageContainer>
      <div className='w-full max-w-full min-w-0 space-y-4'>
        <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Bilateral Engagements'
            description='Track bilateral funding engagements and conversations.'
          />
          <Link
            href='/dashboard/bilateral-engagements/new'
            className={
              buttonVariants({ variant: 'default' }) +
              ' w-full shrink-0 justify-center whitespace-nowrap sm:w-auto'
            }
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <BilateralListingPage />
      </div>
    </PageContainer>
  );
}
