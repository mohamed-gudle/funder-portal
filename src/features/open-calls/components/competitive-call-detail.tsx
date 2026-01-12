'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Calendar,
  Building,
  Banknote,
  Link as LinkIcon,
  Edit,
  User,
  Search,
  Loader2,
  Send
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
import { StageFlow, callStagesWithFlow } from '@/components/ui/stage-flow';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Re-using the stages constant if exported, otherwise redefining matches the model
const callStages = callStagesWithFlow;

type ActivityRecord = {
  _id: string;
  type:
    | 'Call Log'
    | 'Email'
    | 'Meeting Note'
    | 'Internal Comment'
    | 'Status Change';
  content: string;
  author?: { name?: string; email?: string; image?: string; id?: string };
  createdAt: string;
};

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

  const sectors: string[] = useMemo(
    () =>
      Array.isArray(data.sector)
        ? data.sector.filter(Boolean)
        : data.sector
          ? [data.sector]
          : [],
    [data.sector]
  );

  const onStepClick = (newStatus: string) => {
    if (newStatus === currentStatus || updating) return;
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
    <div className='min-w-0 space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6'>
        <div className='min-w-0'>
          <h1 className='text-3xl leading-tight font-bold tracking-tight break-words text-gray-900'>
            {data.title}
          </h1>
          <div className='mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500'>
            {data.funder && (
              <div className='flex items-center gap-1'>
                <Building className='h-4 w-4' />
                <span>{data.funder}</span>
              </div>
            )}
            {sectors.length > 0 && (
              <>
                {data.funder && <span>•</span>}
                <div className='flex flex-wrap gap-2'>
                  {sectors.map((sector) => (
                    <Badge key={sector} variant='secondary'>
                      {sector}
                    </Badge>
                  ))}
                </div>
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
          <StageFlow
            currentStep={currentStatus}
            onStepClick={onStepClick}
            className='pb-2'
          />
        </CardContent>
      </Card>

      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='w-full flex-wrap justify-start gap-2 md:w-auto'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='activities'>Activities</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
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
                <div className='sm:col-span-2'>
                  <DetailItem
                    label='Sectors'
                    value={
                      sectors.length ? (
                        <div className='flex flex-wrap gap-2'>
                          {sectors.map((sector) => (
                            <Badge
                              key={sector}
                              variant='outline'
                              className='bg-slate-50 text-slate-700'
                            >
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        'Not specified'
                      )
                    }
                  />
                </div>
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
                  label='Call Lifecycle'
                  value={data.callStatus}
                  valueClassName='text-gray-600'
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
                  Program
                </CardTitle>
                <CardDescription>
                  Lifecycle context and program linkage.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='mb-1 text-xs text-gray-500'>Lifecycle</p>
                  <p className='text-sm'>{data.callStatus || 'Open'}</p>
                </div>
                <div>
                  <p className='mb-1 text-xs text-gray-500'>Related Program</p>
                  <p className='text-sm'>
                    {data.relatedProgram
                      ? typeof data.relatedProgram === 'object'
                        ? (data.relatedProgram as any).name
                        : data.relatedProgram
                      : 'Not linked to a program yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='activities'>
          <ActivityTable
            parentId={data.id || data._id}
            parentModel='OpenCall'
          />
        </TabsContent>
      </Tabs>

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
            <AlertDialogAction
              onClick={confirmStatusChange}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ActivityTable({
  parentId,
  parentModel
}: {
  parentId: string;
  parentModel: 'OpenCall' | 'CompetitiveCall' | 'BilateralEngagement';
}) {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [newActivityType, setNewActivityType] =
    useState<ActivityRecord['type']>('Internal Comment');
  const [newActivityContent, setNewActivityContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/activities?parentId=${parentId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load activities');
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    void fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = useMemo(() => {
    const needle = searchTerm.toLowerCase().trim();
    return activities.filter((activity) => {
      const matchesSearch =
        !needle ||
        activity.content.toLowerCase().includes(needle) ||
        activity.type.toLowerCase().includes(needle) ||
        (activity.author?.name &&
          activity.author.name.toLowerCase().includes(needle));

      const matchesType = (() => {
        if (typeFilter === 'all') return true;
        if (typeFilter === 'comment')
          return activity.type === 'Internal Comment';
        if (typeFilter === 'other') return activity.type !== 'Internal Comment';
        return activity.type === typeFilter;
      })();

      return matchesSearch && matchesType;
    });
  }, [activities, searchTerm, typeFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newActivityType,
          content: newActivityContent,
          parent: parentId,
          parentModel
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create activity');
      }

      setNewActivityContent('');
      await fetchActivities();
      toast.success('Activity logged');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save activity');
    } finally {
      setSubmitting(false);
    }
  };

  const typeBadgeMap: Record<ActivityRecord['type'], string> = {
    'Internal Comment': 'bg-blue-50 text-blue-700 border-blue-200',
    'Call Log': 'bg-amber-50 text-amber-700 border-amber-200',
    Email: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Meeting Note': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Status Change': 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <Card className='shadow-sm'>
      <CardHeader className='space-y-1'>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          Search, filter, and log updates tied to this call.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-3 md:grid-cols-2'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
            <Input
              placeholder='Search by content or author'
              className='pl-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All activity</SelectItem>
              <SelectItem value='comment'>Comments</SelectItem>
              <SelectItem value='other'>Non-comment activity</SelectItem>
              <SelectItem value='Status Change'>Status changes</SelectItem>
              <SelectItem value='Email'>Email</SelectItem>
              <SelectItem value='Call Log'>Call log</SelectItem>
              <SelectItem value='Meeting Note'>Meeting note</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-3 rounded-lg border p-4'
        >
          <div className='flex flex-col gap-3 md:flex-row md:items-center'>
            <div className='w-full md:w-64'>
              <Select
                value={newActivityType}
                onValueChange={(value) =>
                  setNewActivityType(value as ActivityRecord['type'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Internal Comment'>Comment</SelectItem>
                  <SelectItem value='Call Log'>Call Log</SelectItem>
                  <SelectItem value='Email'>Email</SelectItem>
                  <SelectItem value='Meeting Note'>Meeting Note</SelectItem>
                  <SelectItem value='Status Change'>Status Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder='Add a quick note about this call...'
              className='min-h-[90px] flex-1'
              value={newActivityContent}
              onChange={(e) => setNewActivityContent(e.target.value)}
            />
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              size='sm'
              disabled={submitting || !newActivityContent.trim()}
            >
              {submitting ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Send className='mr-2 h-4 w-4' />
              )}
              Post Activity
            </Button>
          </div>
        </form>

        <div className='space-y-3'>
          {loading ? (
            <div className='bg-background flex items-center gap-2 rounded-lg border p-4 text-sm text-gray-600'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading activities...
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className='bg-background rounded-lg border py-6 text-center text-sm text-gray-500'>
              No activity found for this call.
            </div>
          ) : (
            <>
              <div className='hidden md:block'>
                <div className='overflow-hidden rounded-lg border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-28 text-sm md:w-32'>
                          Type
                        </TableHead>
                        <TableHead className='min-w-[220px] text-sm whitespace-normal'>
                          Summary
                        </TableHead>
                        <TableHead className='w-28 text-sm whitespace-normal'>
                          Author
                        </TableHead>
                        <TableHead className='w-[150px] text-sm whitespace-nowrap'>
                          Created
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity._id}>
                          <TableCell>
                            <Badge
                              variant='outline'
                              className={
                                typeBadgeMap[activity.type] ||
                                'border-gray-200 bg-gray-50 text-gray-700'
                              }
                            >
                              {activity.type}
                            </Badge>
                          </TableCell>
                          <TableCell className='max-w-[360px] align-top break-words whitespace-normal'>
                            <p className='line-clamp-2 text-sm leading-snug text-gray-800'>
                              {activity.content}
                            </p>
                          </TableCell>
                          <TableCell className='text-sm break-words whitespace-normal text-gray-600'>
                            {activity.author?.name || 'Unknown'}
                          </TableCell>
                          <TableCell className='text-sm whitespace-nowrap text-gray-600'>
                            {activity.createdAt
                              ? format(new Date(activity.createdAt), 'PP p')
                              : ''}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className='space-y-3 md:hidden'>
                {filteredActivities.map((activity) => (
                  <div
                    key={activity._id}
                    className='bg-background rounded-lg border p-3 shadow-sm'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <Badge
                        variant='outline'
                        className={
                          typeBadgeMap[activity.type] ||
                          'border-gray-200 bg-gray-50 text-gray-700'
                        }
                      >
                        {activity.type}
                      </Badge>
                      <span className='text-xs text-gray-500'>
                        {activity.createdAt
                          ? format(new Date(activity.createdAt), 'PP p')
                          : ''}
                      </span>
                    </div>
                    <p className='mt-2 text-sm leading-snug break-words text-gray-800'>
                      {activity.content}
                    </p>
                    <p className='mt-2 text-xs break-words text-gray-500'>
                      {activity.author?.name || 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
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
