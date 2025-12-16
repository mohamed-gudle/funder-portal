import { AreaGraph } from '@/features/overview/components/area-graph';
import { openCallService } from '@/server/services/open-call.service';

async function getApplicationStatusData() {
  const allCalls = await openCallService.findAll();

  const statusCounts = allCalls.reduce(
    (acc, call) => {
      const existing = acc.find((item) => item.status === call.status);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ status: call.status, count: 1 });
      }
      return acc;
    },
    [] as Array<{ status: string; count: number }>
  );

  return statusCounts.sort((a, b) => b.count - a.count);
}

export default async function AreaStats() {
  const data = await getApplicationStatusData();
  // Serialize to plain object for client component
  const plainData = JSON.parse(JSON.stringify(data));
  return <AreaGraph data={plainData} />;
}
