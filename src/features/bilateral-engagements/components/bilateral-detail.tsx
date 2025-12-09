'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronPath } from '@/components/ui/chevron-path';
import { ActivityFeed } from '@/components/activity-feed/activity-feed';
import { BilateralEngagement } from '@/types/modules';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Building,
  Mail,
  User,
  Edit,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const engagementStages = [
  'Cold Email',
  'First Engagement',
  'Proposal Stage',
  'Contracting',
  'Partner',
  'Funder',
  'No Relationship'
] as const;

export function BilateralDetail({ data }: { data: BilateralEngagement }) {
  const router = useRouter();
  const tags = Array.isArray(data.tags)
    ? data.tags
    : data.tags
      ? [data.tags]
      : [];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Building className='h-4 w-4' />
            <span>{data.organizationName}</span>
          </div>
          <div className='flex items-center gap-2'>
            <h1 className='text-3xl leading-tight font-bold text-gray-900'>
              {data.contactPerson || 'Bilateral Engagement'}
            </h1>
            <Badge variant='outline'>{data.status}</Badge>
          </div>
          {data.contactRole && (
            <p className='text-sm text-gray-500'>{data.contactRole}</p>
          )}
        </div>
        <Button
          variant='outline'
          onClick={() =>
            router.push(
              `/dashboard/bilateral-engagements/${data.id || data._id}/edit`
            )
          }
        >
          <Edit className='mr-2 h-4 w-4' />
          Edit Engagement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>
            Engagement Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChevronPath
            steps={[...engagementStages]}
            currentStep={data.status}
            className='pb-2'
          />
        </CardContent>
      </Card>

      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <DetailItem
                icon={<User className='h-4 w-4 text-gray-500' />}
                label='Internal Owner'
                value={data.internalOwner || 'Unassigned'}
              />
              <DetailItem
                icon={<Mail className='h-4 w-4 text-gray-500' />}
                label='Email'
                value={
                  data.email ? (
                    <a
                      href={`mailto:${data.email}`}
                      className='text-blue-600 hover:underline'
                    >
                      {data.email}
                    </a>
                  ) : (
                    'Not provided'
                  )
                }
              />
              <DetailItem
                icon={<Calendar className='h-4 w-4 text-gray-500' />}
                label='Likelihood to Fund'
                value={
                  typeof data.likelihoodToFund === 'number'
                    ? `${data.likelihoodToFund}%`
                    : 'N/A'
                }
              />
              <DetailItem
                icon={<DollarSign className='h-4 w-4 text-gray-500' />}
                label='Estimated Value'
                value={
                  data.estimatedValue
                    ? `${data.currency || ''} ${data.estimatedValue}`
                    : 'N/A'
                }
              />
              <DetailItem
                icon={<Tag className='h-4 w-4 text-gray-500' />}
                label='Tags'
                value={
                  tags.length ? (
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((tag) => (
                        <Badge key={tag} variant='secondary'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    'No tags'
                  )
                }
                className='sm:col-span-2'
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Counterparty Contacts</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <DetailItem
                icon={<User className='h-4 w-4 text-gray-500' />}
                label='Primary Contact'
                value={data.contactPerson || 'Not provided'}
              />
              <DetailItem
                icon={<Building className='h-4 w-4 text-gray-500' />}
                label='Role / Title'
                value={data.contactRole || 'Not provided'}
              />
              <DetailItem
                icon={<Mail className='h-4 w-4 text-gray-500' />}
                label='Email'
                value={
                  data.email ? (
                    <a
                      href={`mailto:${data.email}`}
                      className='text-blue-600 hover:underline'
                    >
                      {data.email}
                    </a>
                  ) : (
                    'Not provided'
                  )
                }
                className='sm:col-span-2'
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='activity'>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                parentId={data.id || (data as any)._id}
                parentModel='BilateralEngagement'
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
  className
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-lg border border-gray-200 p-3 shadow-sm',
        className
      )}
    >
      <div className='flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase'>
        {icon}
        <span>{label}</span>
      </div>
      <div className='text-sm text-gray-900'>{value}</div>
    </div>
  );
}
