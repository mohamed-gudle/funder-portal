import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { teamMemberService } from '@/server/services/team-member.service';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TeamTable from './team-table';

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function TeamListingPage({ searchParams }: ParamsProps) {
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const rawData = await teamMemberService.findAll({ search });
  const data = JSON.parse(JSON.stringify(rawData)); // Serialize for client component
  const totalItems = data.length;

  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Team Members (${totalItems})`}
            description='Manage your team members and their roles.'
          />
          <Link
            href={'/dashboard/team/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <TeamTable data={data} totalItems={totalItems} />
      </div>
    </PageContainer>
  );
}
