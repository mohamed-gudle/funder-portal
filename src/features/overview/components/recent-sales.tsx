'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

interface OpenCall {
  id: string;
  title: string;
  funder?: string;
  sector?: string | string[];
  status: string;
  budget: string;
  internalOwner: string;
}

interface RecentSalesProps {
  recentCalls: OpenCall[];
}

const statusColors: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  'In Review': 'secondary',
  'Go/No-Go': 'outline',
  'Proposal Writing': 'default',
  'Internal Review': 'secondary',
  'Submission Stage': 'default',
  Submitted: 'outline',
  Accepted: 'default',
  Rejected: 'destructive'
};

export function RecentSales({ recentCalls }: RecentSalesProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Open Calls</CardTitle>
        <CardDescription>
          Latest grant opportunities you're tracking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {recentCalls.map((call) => (
            <div key={call.id} className='flex flex-col gap-2'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 space-y-1'>
                  <p className='line-clamp-1 text-sm leading-none font-medium'>
                    {call.title}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {call.funder || 'Unknown funder'}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <Badge variant='outline' className='text-xs'>
                  {Array.isArray(call.sector)
                    ? call.sector.join(', ')
                    : call.sector || 'Not specified'}
                </Badge>
                <Badge
                  variant={statusColors[call.status] || 'default'}
                  className='text-xs'
                >
                  {call.status}
                </Badge>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>
                  Budget: {call.budget}
                </span>
                <span className='text-muted-foreground'>
                  {call.internalOwner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
