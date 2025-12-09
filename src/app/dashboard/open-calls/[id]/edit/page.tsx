import PageContainer from '@/components/layout/page-container';
import OpenCallEditPage from '@/features/open-calls/components/open-call-edit-page';

export const metadata = {
  title: 'Dashboard: Edit Open Call'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <PageContainer scrollable={true}>
      <OpenCallEditPage openCallId={id} />
    </PageContainer>
  );
}
