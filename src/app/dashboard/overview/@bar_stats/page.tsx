import { BarGraph } from '@/features/overview/components/bar-graph';
import { openCallService } from '@/server/services/open-call.service';

async function getSectorData() {
  const allCalls = await openCallService.findAll();

  const sectorCounts = allCalls.reduce(
    (acc, call) => {
      const sectors = Array.isArray(call.sector)
        ? call.sector
        : call.sector
          ? [call.sector]
          : ['Unspecified'];

      sectors.forEach((sector) => {
        const existing = acc.find((item) => item.sector === sector);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ sector, count: 1 });
        }
      });
      return acc;
    },
    [] as Array<{ sector: string; count: number }>
  );

  return sectorCounts.sort((a, b) => b.count - a.count);
}

export default async function BarStats() {
  const data = await getSectorData();
  // Serialize to plain object for client component
  const plainData = JSON.parse(JSON.stringify(data));
  return <BarGraph data={plainData} />;
}
