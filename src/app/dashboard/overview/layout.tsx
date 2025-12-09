import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';
import {
  fakeOpenCalls,
  fakeBilateralEngagements
} from '@/constants/mock-modules';

async function getDashboardStats() {
  const openCalls = await fakeOpenCalls.getAll({});
  const bilateralEngagements = await fakeBilateralEngagements.getAll({});

  // Calculate stats for open calls
  const totalBudget = openCalls.reduce((sum, call) => {
    const budget = parseInt((call.budget || '0').replace(/[$,]/g, '')) || 0;
    return sum + budget;
  }, 0);

  const reviewingCalls = openCalls.filter(
    (call) => call.status === 'In Review'
  ).length;
  const applicationSubmitted = openCalls.filter(
    (call) => call.status === 'Submitted'
  ).length;

  // Calculate stats for bilateral engagements
  const activeEngagements = bilateralEngagements.filter(
    (engagement) => engagement.status !== 'No Relationship'
  ).length;

  const highConfidenceEngagements = bilateralEngagements.filter(
    (engagement) => (engagement.likelihoodToFund || 0) >= 70
  ).length;

  return {
    totalOpenCalls: openCalls.length,
    totalBudget,
    reviewingCalls,
    applicationSubmitted,
    totalBilateralEngagements: bilateralEngagements.length,
    activeEngagements,
    highConfidenceEngagements
  };
}

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const stats = await getDashboardStats();
  const budgetInMillions = (stats.totalBudget / 1000000).toFixed(0);

  return (
    <PageContainer>
      <div className='flex w-full max-w-full min-w-0 flex-1 flex-col'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Open Calls</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.totalOpenCalls}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  Active
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.reviewingCalls} under review{' '}
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                {stats.applicationSubmitted} applications submitted
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Grant Budget</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                ${budgetInMillions}M
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  {stats.reviewingCalls} reviewing
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Across all open calls <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Multiple sectors and funders
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Bilateral Engagements</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.totalBilateralEngagements}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  {stats.activeEngagements} active
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.highConfidenceEngagements} high confidence{' '}
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Ongoing funder partnerships
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.activeEngagements > 0
                  ? Math.round(
                      (stats.highConfidenceEngagements /
                        stats.activeEngagements) *
                        100
                    )
                  : 0}
                %
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  High confidence
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Engagement confidence level{' '}
                <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Based on active bilateral partnerships
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-1 md:col-span-2 lg:col-span-4'>
            {bar_stats}
          </div>
          <div className='col-span-1 md:col-span-1 lg:col-span-3'>
            {/* sales arallel routes */}
            {sales}
          </div>
          <div className='col-span-1 md:col-span-1 lg:col-span-3'>
            {pie_stats}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
