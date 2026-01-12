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

const chartConfig = {
  count: {
    label: 'Engagements'
  }
} satisfies ChartConfig;

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

type FunderData = Array<{ funder: string; count: number; fill: string }>;

interface PieGraphProps {
  data: FunderData;
}

export function PieGraph({ data }: PieGraphProps) {
  const totalEngagements = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  const topFunder = data[0];

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Top Bilateral Partners</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Organizations with the most active engagements
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
              data={data}
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
          Top 5 organizations by active engagement
        </div>
      </CardFooter>
    </Card>
  );
}
