import PageContainer from '@/components/layout/page-container';
import OpenCallViewPage from '@/features/open-calls/components/open-call-view-page';

export const metadata = {
  title: 'Dashboard: Open Call Details'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <OpenCallViewPage openCallId={id} />
      </div>
    </PageContainer>
  );
}
