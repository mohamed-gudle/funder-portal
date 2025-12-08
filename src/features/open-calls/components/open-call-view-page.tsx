import CompetitiveCallDetail from './competitive-call-detail';
import { notFound } from 'next/navigation';

type OpenCallViewPageProps = {
  openCallId: string;
};

export default async function OpenCallViewPage({
  openCallId
}: OpenCallViewPageProps) {
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/open-calls/${openCallId}`;

  let openCall = null;
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (response.ok) {
      openCall = await response.json();
    }
  } catch (error) {
    console.error('Error fetching open call:', error);
  }

  if (!openCall) {
    notFound();
  }

  return <CompetitiveCallDetail data={openCall} />;
}
