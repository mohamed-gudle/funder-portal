import PageContainer from '@/components/layout/page-container';
import BilateralForm from '@/features/bilateral-engagements/components/bilateral-form';

export const metadata = {
  title: 'Dashboard: New Bilateral Engagement'
};

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <BilateralForm
          initialData={null}
          pageTitle='Create Bilateral Engagement'
        />
      </div>
    </PageContainer>
  );
}
