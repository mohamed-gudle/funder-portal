import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { fakeOpenCalls } from '@/constants/mock-modules';

async function getRecentCalls() {
  const allCalls = await fakeOpenCalls.getAll({});
  return allCalls.slice(0, 5);
}

const statusColors: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  Intake: 'default',
  Reviewing: 'secondary',
  'Application preparation': 'default',
  'Application submitted': 'outline',
  'Go/No-Go': 'secondary',
  Outcome: 'destructive'
};

export async function RecentSales() {
  const recentCalls = await getRecentCalls();

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
                  <p className='text-muted-foreground text-xs'>{call.funder}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <Badge variant='outline' className='text-xs'>
                  {call.sector}
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
