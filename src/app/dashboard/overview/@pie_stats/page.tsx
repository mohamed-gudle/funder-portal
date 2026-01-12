import { PieGraph } from '@/features/overview/components/pie-graph';
import { bilateralEngagementService } from '@/server/services/bilateral-engagement.service';

const colorPalette = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(210, 70%, 55%)',
  'hsl(150, 60%, 45%)',
  'hsl(45, 90%, 55%)'
];

async function getFunderData() {
  const allEngagements = await bilateralEngagementService.findAll();

  const funderCounts = allEngagements.reduce(
    (acc, engagement) => {
      const label =
        engagement.organizationName?.split(' ').slice(0, 3).join(' ') || '';
      const existing = acc.find((item) => item.funder === label);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          funder: label,
          count: 1
        });
      }
      return acc;
    },
    [] as Array<{ funder: string; count: number }>
  );

  return funderCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      fill: colorPalette[index % colorPalette.length]
    }));
}

export default async function Stats() {
  const data = await getFunderData();
  // Serialize to plain object for client component
  const plainData = JSON.parse(JSON.stringify(data));
  return <PieGraph data={plainData} />;
}
