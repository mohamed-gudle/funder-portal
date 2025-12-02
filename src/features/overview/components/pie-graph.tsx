'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { fakeBilateralEngagements } from '@/constants/mock-modules';

const chartConfig = {
  count: {
    label: 'Engagements'
  }
} satisfies ChartConfig;

const colorPalette = [
  'var(--primary)',
  'var(--accent)',
  'var(--primary)',
  'var(--accent)',
  'var(--primary)'
];

async function getFunderData() {
  const allEngagements = await fakeBilateralEngagements.getAll({});

  const funderCounts = allEngagements.reduce(
    (acc, engagement) => {
      const existing = acc.find((item) => item.funder === engagement.funder);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          funder: engagement.funder.split(' ').slice(0, 3).join(' '),
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

export function PieGraph() {
  const [chartData, setChartData] = React.useState<
    Array<{ funder: string; count: number; fill: string }>
  >([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    getFunderData().then(setChartData);
  }, []);

  const totalEngagements = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (!isClient || chartData.length === 0) {
    return null;
  }

  const topFunder = chartData[0];

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Top Bilateral Funders</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Funders with the most active engagements
          </span>
          <span className='@[540px]/card:hidden'>Active engagements</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='funder'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalEngagements}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Engagements
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {topFunder.funder} leads with {topFunder.count} engagement
          {topFunder.count !== 1 ? 's' : ''}{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Top 5 funders by active engagement
        </div>
      </CardFooter>
    </Card>
  );
}
