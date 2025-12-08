import BilateralForm from './bilateral-form';
import { notFound } from 'next/navigation';
import { ActivityFeed } from '@/components/activity-feed/activity-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
      <div className='xl:col-span-2'>
        <BilateralForm
          initialData={engagement}
          pageTitle={`Edit Engagement: ${engagement.organizationName}`}
        />
      </div>
      <div className='xl:col-span-1'>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed
              parentId={engagement.id || engagement._id}
              parentModel='BilateralEngagement'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
