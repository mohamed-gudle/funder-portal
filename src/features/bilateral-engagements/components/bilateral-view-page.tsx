import { fakeBilateralEngagements } from '@/constants/mock-modules';
import BilateralForm from './bilateral-form';
import { notFound } from 'next/navigation';

type BilateralViewPageProps = {
  engagementId: string;
};

export default async function BilateralViewPage({
  engagementId
}: BilateralViewPageProps) {
  const engagement = await fakeBilateralEngagements.getById(engagementId);

  if (!engagement) {
    notFound();
  }

  return (
    <BilateralForm
      initialData={engagement}
      pageTitle={`Edit Engagement: ${engagement.funder}`}
    />
  );
}
