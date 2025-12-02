import BilateralForm from './bilateral-form';
import { notFound } from 'next/navigation';

type BilateralViewPageProps = {
  engagementId: string;
};

export default async function BilateralViewPage({
  engagementId
}: BilateralViewPageProps) {
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bilateral-engagements/${engagementId}`;

  let engagement = null;
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (response.ok) {
      engagement = await response.json();
    }
  } catch (error) {
    console.error('Error fetching engagement:', error);
  }

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
