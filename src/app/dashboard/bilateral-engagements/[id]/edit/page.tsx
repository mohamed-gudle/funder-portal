import PageContainer from '@/components/layout/page-container';
import BilateralEditPage from '@/features/bilateral-engagements/components/bilateral-edit-page';

export const metadata = {
  title: 'Dashboard: Edit Bilateral Engagement'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <PageContainer scrollable={true}>
      <BilateralEditPage engagementId={id} />
    </PageContainer>
  );
}
