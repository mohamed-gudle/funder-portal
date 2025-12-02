'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import React from 'react';
import { fakeOpenCalls } from '@/constants/mock-modules';

const chartConfig = {
  count: {
    label: 'Number of Calls',
    color: 'var(--accent)'
  }
} satisfies ChartConfig;

async function getApplicationStatusData() {
  const allCalls = await fakeOpenCalls.getAll({});

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

export function AreaGraph() {
  const [chartData, setChartData] = React.useState<
    Array<{ status: string; count: number }>
  >([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    getApplicationStatusData().then(setChartData);
  }, []);

  if (!isClient || chartData.length === 0) {
    return null;
  }

  const totalCalls = chartData.reduce((sum, item) => sum + item.count, 0);
  const topStatus = chartData[0];

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Applications by Status</CardTitle>
        <CardDescription>
          Distribution of open calls across application pipeline stages
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--accent)' stopOpacity={0.8} />
                <stop
                  offset='100%'
                  stopColor='var(--accent)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='status'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor='end'
              height={100}
            />
            <YAxis />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey='count' fill='url(#fillBar)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {topStatus.status} has the most calls ({topStatus.count}){' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Total of {totalCalls} open calls across all stages
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
