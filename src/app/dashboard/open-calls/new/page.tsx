import PageContainer from '@/components/layout/page-container';
import OpenCallForm from '@/features/open-calls/components/open-call-form';

export const metadata = {
  title: 'Dashboard: New Open Call'
};

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <OpenCallForm initialData={null} pageTitle='Create Open Call' />
      </div>
    </PageContainer>
  );
}
