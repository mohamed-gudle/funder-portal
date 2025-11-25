import { fakeOpenCalls } from '@/constants/mock-modules';
import OpenCallForm from './open-call-form';
import { notFound } from 'next/navigation';

type OpenCallViewPageProps = {
  openCallId: string;
};

export default async function OpenCallViewPage({
  openCallId
}: OpenCallViewPageProps) {
  const openCall = await fakeOpenCalls.getById(openCallId);

  if (!openCall) {
    notFound();
  }

  return (
    <OpenCallForm
      initialData={openCall}
      pageTitle={`Edit Open Call: ${openCall.title}`}
    />
  );
}
