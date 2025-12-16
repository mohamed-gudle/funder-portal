'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'Open calls by sector';

const chartConfig = {
  count: {
    label: 'Number of Calls',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

type SectorData = Array<{ sector: string; count: number }>;

interface BarGraphProps {
  data: SectorData;
}

export function BarGraph({ data }: BarGraphProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className='@container/card pt-3!'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0! sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-0!'>
          <CardTitle>Open Calls by Sector</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Distribution of active funding opportunities
            </span>
            <span className='@[540px]/card:hidden'>Funding opportunities</span>
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>Total Calls</span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              {total}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='sector'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={<ChartTooltipContent className='w-[150px]' />}
            />
            <Bar dataKey='count' fill='url(#fillBar)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
