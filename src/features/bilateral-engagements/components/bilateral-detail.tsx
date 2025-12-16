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
  Tag,
  Thermometer,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ContactList } from './contact-list';

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
  const notes = Array.isArray((data as any).notes) ? (data as any).notes : [];
  const documents = Array.isArray((data as any).documents)
    ? (data as any).documents
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
              `/dashboard/bilateral-engagements/${data.id || (data as any)._id}/edit`
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

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Engagement Health</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <DetailItem
                  icon={<Thermometer className='h-4 w-4 text-gray-500' />}
                  label='Temperature'
                  value={
                    (data as any).temperatureLabel ? (
                      <Badge variant='secondary'>
                        {(data as any).temperatureLabel}
                      </Badge>
                    ) : (
                      'Not set'
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
                  icon={<Clock className='h-4 w-4 text-gray-500' />}
                  label='Last Updated'
                  value={
                    data.updatedAt
                      ? formatDate(data.updatedAt)
                      : 'Not available'
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                {documents.length === 0 && (
                  <p className='text-sm text-gray-500'>
                    No documents uploaded.
                  </p>
                )}
                {documents.map((doc: any) => (
                  <div
                    key={doc.id || doc._id}
                    className='flex items-center justify-between rounded-md border p-2'
                  >
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-800'>
                        {doc.name || 'Document'}
                      </span>
                    </div>
                    {doc.url && (
                      <Link
                        href={doc.url}
                        className='text-sm text-blue-600 hover:underline'
                      >
                        View
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {notes.length === 0 && (
                <p className='text-sm text-gray-500'>No notes captured yet.</p>
              )}
              {notes.map((note: any) => (
                <div
                  key={note.id || note._id}
                  className='rounded-md border p-3 shadow-sm'
                >
                  <div className='flex items-center justify-between text-xs text-gray-500'>
                    <span className='font-medium text-gray-700'>
                      {note.author || 'Unknown'}
                    </span>
                    {note.createdAt && (
                      <span>{formatDate(note.createdAt)}</span>
                    )}
                  </div>
                  <p className='mt-1 text-sm text-gray-800'>{note.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <ContactList engagementId={data.id || (data as any)._id} />
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

function formatDate(input: string | Date) {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
