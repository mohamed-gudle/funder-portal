'use client';

import { FormFileUpload } from '@/components/forms/form-file-upload';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormSelectAvatar } from '@/components/forms/form-select-avatar';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { OpenCall } from '@/types/modules';
import { useTeamMembers } from '@/hooks/use-team-members';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ChevronPath } from '@/components/ui/chevron-path';
import { FormMultiSelectAvatar } from '@/components/forms/form-multi-select-avatar';
import { Separator } from '@/components/ui/separator';
import { FormCheckboxGroup } from '@/components/forms/form-checkbox-group';

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

const formSchema = z
  .object({
    title: z.string().min(2, { message: 'Title is required.' }),
    funder: z.string().optional(),
    sector: z.array(z.string()).optional(),
    grantType: z.string().optional(),
    budget: z.string().optional(),
    deadline: z.string().min(1, { message: 'Deadline is required.' }),
    url: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    priorityProject: z.string().optional(),
    internalOwner: z
      .string()
      .min(1, { message: 'Internal owner is required.' }),
    callStatus: z.enum(['Open', 'Closed']),
    priority: z.enum(['High', 'Medium', 'Low']),
    fundingType: z.enum(['Core Funding', 'Programmatic Funding']),
    relatedProgram: z.string().optional(),
    status: z.enum(callStages),
    documents: z.array(z.any()).optional(),
    stagePermissions: z
      .array(
        z.object({
          stage: z.enum(callStages).optional(),
          assignees: z.array(z.string()).optional()
        })
      )
      .optional()
  })
  .refine(
    (data) =>
      data.fundingType !== 'Programmatic Funding' ||
      (data.relatedProgram && data.relatedProgram.trim().length > 0),
    {
      message: 'Related program is required for Programmatic Funding.',
      path: ['relatedProgram']
    }
  );

export default function OpenCallForm({
  initialData,
  pageTitle
}: {
  initialData: OpenCall | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const { teamMembers } = useTeamMembers();

  // Pre-populate stage permissions to ensure all stages are present in the form state
  const defaultStagePermissions = callStages.map((stage) => {
    const existing = initialData?.stagePermissions?.find(
      (p) => p.stage === stage
    );
    return {
      stage,
      assignees:
        existing?.assignees?.map((a: any) =>
          typeof a === 'object' ? a._id || a.id : a
        ) || []
    };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      funder: initialData?.funder || '',
      sector: Array.isArray(initialData?.sector)
        ? initialData?.sector
        : initialData?.sector
          ? [initialData.sector]
          : [],
      grantType: initialData?.grantType || '',
      budget: initialData?.budget || '',
      deadline: initialData?.deadline
        ? new Date(initialData.deadline).toISOString().split('T')[0]
        : '',
      url: initialData?.url || '',
      description: initialData?.description || '',
      priorityProject: initialData?.priorityProject || '',
      internalOwner: initialData?.internalOwner || '',
      callStatus: initialData?.callStatus || 'Open',
      priority: initialData?.priority || 'Medium',
      fundingType: initialData?.fundingType || 'Core Funding',
      relatedProgram: initialData?.relatedProgram || '',
      status: initialData?.status || 'In Review',
      documents: [],
      stagePermissions: defaultStagePermissions
    }
  });

  const currentStatus = form.watch('status');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { documents, ...rest } = values;
      const data = {
        ...rest,
        sector: values.sector || [],
        // Ensure grantType etc are strings even if not required by schema but by DB
        grantType: values.grantType || '',
        budget: values.budget || '',
        description: values.description || '',
        internalOwner: values.internalOwner || '',
        relatedProgram:
          values.fundingType === 'Programmatic Funding'
            ? values.relatedProgram || ''
            : undefined,
        stagePermissions: (
          values.stagePermissions ||
          callStages.map((stage) => ({ stage, assignees: [] }))
        ).map((permission, index) => ({
          stage: permission.stage || callStages[index],
          assignees: permission.assignees || []
        }))
      };

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/open-calls`;

      if (initialData) {
        // Update existing open call
        const response = await fetch(`${apiUrl}/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to update open call');
        }

        toast.success('Open call updated successfully');
      } else {
        // Create new open call
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to create open call');
        }

        toast.success('Open call created successfully');
      }
      router.push('/dashboard/open-calls');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-left text-2xl font-bold'>
              {pageTitle}
            </CardTitle>
          </div>

          <ChevronPath
            steps={[...callStages]}
            currentStep={currentStatus}
            onStepClick={(step) =>
              form.setValue('status', step as any, { shouldDirty: true })
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='title'
              label='Title'
              placeholder='Enter open call title'
              required
            />
            <FormInput
              control={form.control}
              name='funder'
              label='Funder'
              placeholder='Enter funder name'
            />
            <FormCheckboxGroup
              control={form.control}
              name='sector'
              label='Sector'
              description='Pick all sectors that apply'
              options={[
                { label: 'Energy', value: 'Energy' },
                { label: 'Agriculture', value: 'Agriculture' },
                { label: 'Clean Cooking', value: 'Clean Cooking' },
                { label: 'Water', value: 'Water' },
                { label: 'Health', value: 'Health' }
              ]}
              className='md:col-span-2'
            />
            <FormSelect
              control={form.control}
              name='fundingType'
              label='Funding Type'
              placeholder='Select funding type'
              required
              options={[
                { label: 'Core Funding', value: 'Core Funding' },
                { label: 'Programmatic Funding', value: 'Programmatic Funding' }
              ]}
            />
            <FormSelect
              control={form.control}
              name='grantType'
              label='Grant Type'
              placeholder='Select grant type'
              options={[
                { label: 'Traditional Grant', value: 'Traditional Grant' },
                { label: 'Challenge Fund', value: 'Challenge Fund' },
                { label: 'Innovation Grant', value: 'Innovation Grant' },
                { label: 'Research Grant', value: 'Research Grant' },
                { label: 'Other', value: 'Other' }
              ]}
            />
            <FormInput
              control={form.control}
              name='budget'
              label='Estimated Budget'
              placeholder='e.g. $50,000 - $100,000'
            />
            <FormSelect
              control={form.control}
              name='priority'
              label='Prioritization'
              placeholder='Select priority'
              required
              options={[
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' }
              ]}
            />
            <FormSelect
              control={form.control}
              name='callStatus'
              label='Call Status'
              placeholder='Is this call active?'
              required
              options={[
                { label: 'Open', value: 'Open' },
                { label: 'Closed', value: 'Closed' }
              ]}
            />
            <FormInput
              control={form.control}
              name='deadline'
              label='Deadline'
              type='date'
              required
            />
            <FormInput
              control={form.control}
              name='url'
              label='URL'
              placeholder='https://...'
            />
            <FormSelectAvatar
              control={form.control}
              name='internalOwner'
              label='Internal Owner'
              placeholder='Assign an owner'
              options={teamMembers}
              required
            />
            <FormSelect
              control={form.control}
              name='status'
              label='Pipeline Stage'
              placeholder='Select stage'
              options={callStages.map((stage) => ({
                label: stage,
                value: stage
              }))}
            />
            <FormInput
              control={form.control}
              name='relatedProgram'
              label='Related Program'
              placeholder='Program link if Programmatic Funding'
            />
          </div>

          <FormTextarea
            control={form.control}
            name='description'
            label='Description'
            placeholder='Enter description or summary'
            config={{
              maxLength: 1000,
              showCharCount: true,
              rows: 4
            }}
          />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormSelectAvatar
              control={form.control}
              name='priorityProject'
              label='Project Owner'
              placeholder='Select project owner'
              description='The team member responsible for this project'
              options={teamMembers}
            />
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Stage Assignments</h3>
            <p className='text-sm text-gray-500'>
              Assign specific team members to be responsible for each stage of
              the call.
            </p>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {callStages.map((stage, index) => (
                <FormMultiSelectAvatar
                  key={stage}
                  control={form.control}
                  name={`stagePermissions.${index}.assignees`}
                  label={`${stage} Owner(s)`}
                  options={teamMembers}
                  placeholder={`Start typing to assign for ${stage}...`}
                />
              ))}
            </div>
          </div>

          <FormFileUpload
            control={form.control}
            name='documents'
            label='Documents'
            description='Upload concept notes, drafts, etc.'
            config={{
              maxSize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5,
              acceptedTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain'
              ]
            }}
          />

          <Button type='submit'>
            {initialData ? 'Update' : 'Create'} Open Call
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
