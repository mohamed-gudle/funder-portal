import TeamListingPage from '@/features/team/components/team-listing-page';

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  return <TeamListingPage searchParams={searchParams} />;
}
