'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Calendar,
  Building,
  Banknote,
  Tag,
  Link as LinkIcon,
  Edit,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronPath } from '@/components/ui/chevron-path';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ActivityFeed } from '@/components/activity-feed/activity-feed';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

// Re-using the stages constant if exported, otherwise redefining matches the model
const callStages = [
  'In Review',
  'Go/No-Go',
  'Proposal Writing',
  'Internal Review',
  'Submission Stage',
  'Submitted',
  'Accepted',
  'Rejected'
] as const;

interface CompetitiveCallDetailProps {
  data: any; // Type as OpenCall
}

export default function CompetitiveCallDetail({
  data
}: CompetitiveCallDetailProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(data.status);
  const [updating, setUpdating] = useState(false);

  // New state for confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const onStepClick = (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setPendingStage(newStatus);
    setShowConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStage) return;

    const newStatus = pendingStage;
    setUpdating(true);
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setShowConfirm(false); // Close dialog

    try {
      const res = await fetch(`/api/open-calls/${data.id || data._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
      setCurrentStatus(previousStatus); // Revert
    } finally {
      setUpdating(false);
      setPendingStage(null);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            {data.title}
          </h1>
          <div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
            {data.funder && (
              <div className='flex items-center gap-1'>
                <Building className='h-4 w-4' />
                <span>{data.funder}</span>
              </div>
            )}
            {data.sector && (
              <>
                <span>•</span>
                <Badge variant='secondary'>{data.sector}</Badge>
              </>
            )}
          </div>
        </div>
        <Button
          onClick={() =>
            router.push(`/dashboard/open-calls/${data.id || data._id}/edit`)
          }
          variant='outline'
        >
          <Edit className='mr-2 h-4 w-4' />
          Edit Details
        </Button>
      </div>

      {/* Opportunity Path */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg font-medium'>
            Opportunity Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChevronPath
            steps={[...callStages]}
            currentStep={currentStatus}
            onStepClick={onStepClick}
            className='pb-2'
          />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Left Column: Details & Assignment */}
        <div className='space-y-6 xl:col-span-2'>
          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='mb-2 text-sm font-medium text-gray-500'>
                  Description
                </h3>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {data.description}
                </p>
              </div>

              <Separator />

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <DetailItem label='Grant Type' value={data.grantType} />
                <DetailItem label='Funding Type' value={data.fundingType} />
                <DetailItem
                  label='Budget'
                  value={data.budget}
                  icon={<Banknote className='h-4 w-4 text-gray-400' />}
                />
                <DetailItem
                  label='Deadline'
                  value={
                    data.deadline
                      ? format(new Date(data.deadline), 'PPP')
                      : 'N/A'
                  }
                  icon={<Calendar className='h-4 w-4 text-gray-400' />}
                />
                <DetailItem
                  label='Priority'
                  value={data.priority}
                  valueClassName={cn(
                    data.priority === 'High' ? 'text-red-600 font-medium' : '',
                    data.priority === 'Medium' ? 'text-yellow-600' : '',
                    data.priority === 'Low' ? 'text-gray-600' : ''
                  )}
                />
                <DetailItem
                  label='URL'
                  value={
                    data.url ? (
                      <a
                        href={data.url}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center gap-1 text-blue-600 hover:underline'
                      >
                        Link <LinkIcon className='h-3 w-3' />
                      </a>
                    ) : (
                      'N/A'
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Alignment */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <User className='h-5 w-5 text-gray-500' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Internal Owner
                    </p>
                    <p className='text-sm text-gray-500'>
                      {data.internalOwner || 'Unassigned'}
                    </p>
                  </div>
                </div>
                {data.priorityProject && (
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                      <User className='h-5 w-5 text-gray-500' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Project Owner
                      </p>
                      <p className='text-sm text-gray-500'>
                        {data.priorityProject}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
                  Alignment
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {data.thematicAlignment && (
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>Thematic</p>
                    <p className='text-sm'>{data.thematicAlignment}</p>
                  </div>
                )}
                {data.relatedProgram && (
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>
                      Related Program
                    </p>
                    <p className='text-sm'>
                      {typeof data.relatedProgram === 'object'
                        ? (data.relatedProgram as any).name
                        : data.relatedProgram}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className='xl:col-span-1'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Activity & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                parentId={data.id || data._id}
                parentModel='OpenCall'
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Competitive Call Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this call to{' '}
              <strong>{pendingStage}</strong>? This action will be recorded in
              the activity log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStage(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
  valueClassName
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className='flex flex-col'>
      <span className='mb-1 text-xs font-medium text-gray-500'>{label}</span>
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-gray-900',
          valueClassName
        )}
      >
        {icon}
        {value || '-'}
      </div>
    </div>
  );
}
