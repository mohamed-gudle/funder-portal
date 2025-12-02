import PageContainer from '@/components/layout/page-container';
import OpenCallForm from '@/features/open-calls/components/open-call-form';

export const metadata = {
  title: 'Dashboard: New Open Call'
};

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <OpenCallForm initialData={null} pageTitle='Create Open Call' />
    </PageContainer>
  );
}
