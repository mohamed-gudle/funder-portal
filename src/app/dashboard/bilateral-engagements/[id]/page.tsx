import PageContainer from '@/components/layout/page-container';
import BilateralViewPage from '@/features/bilateral-engagements/components/bilateral-view-page';

export const metadata = {
  title: 'Dashboard: Bilateral Engagement Details'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <BilateralViewPage engagementId={id} />
      </div>
    </PageContainer>
  );
}
