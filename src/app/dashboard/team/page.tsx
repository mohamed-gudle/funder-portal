import TeamListingPage from '@/features/team/components/team-listing-page';

export const metadata = {
  title: 'Team Management',
  description:
    'Manage team members, roles, and permissions. Collaborate effectively on funding applications and partnership engagements.'
};

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  return <TeamListingPage searchParams={searchParams} />;
}
