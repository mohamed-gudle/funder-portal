import PageContainer from '@/components/layout/page-container';
import OpportunitiesListingPage from '@/features/opportunities/components/opportunities-listing';

export const metadata = {
  title: 'Funding Opportunities',
  description:
    'Discover new funding opportunities across various programs and organizations. Search, filter, and find grants that match your needs.'
};

export default function Page() {
  return (
    <PageContainer>
      <OpportunitiesListingPage />
    </PageContainer>
  );
}
