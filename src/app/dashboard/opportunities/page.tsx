import PageContainer from '@/components/layout/page-container';
import OpportunitiesListingPage from '@/features/opportunities/components/opportunities-listing';

export const metadata = {
  title: 'Dashboard: Opportunities'
};

export default function Page() {
  return (
    <PageContainer>
      <OpportunitiesListingPage />
    </PageContainer>
  );
}
