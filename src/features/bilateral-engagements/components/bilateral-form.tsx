'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormSelectAvatar } from '@/components/forms/form-select-avatar';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { BilateralEngagement } from '@/types/modules';
import { useTeamMembers } from '@/hooks/use-team-members';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ChevronPath } from '@/components/ui/chevron-path';

const engagementStages = [
  'Cold Email',
  'First Engagement',
  'Proposal Stage',
  'Contracting',
  'Partner',
  'Funder',
  'No Relationship'
] as const;

const formSchema = z.object({
  organizationName: z
    .string()
    .min(2, { message: 'Organization name is required.' }),
  contactPerson: z.string().optional(),
  contactRole: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  internalOwner: z.string().min(1, { message: 'Internal owner is required.' }),
  status: z.enum(engagementStages),
  likelihoodToFund: z.string().optional(),
  estimatedValue: z.string().optional(),
  currency: z.enum(['USD', 'KES', 'EUR', 'GBP']),
  tags: z.string().optional(),
  notes: z.string().optional(),
  documents: z.array(z.any()).optional().default([])
});

export default function BilateralForm({
  initialData,
  pageTitle
}: {
  initialData: BilateralEngagement | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const { teamMembers } = useTeamMembers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: initialData?.organizationName || '',
      contactPerson: initialData?.contactPerson || '',
      contactRole: initialData?.contactRole || '',
      email: initialData?.email || '',
      internalOwner: initialData?.internalOwner || '',
      status: initialData?.status || 'Cold Email',
      likelihoodToFund:
        initialData?.likelihoodToFund?.toString() || (10).toString(),
      estimatedValue: initialData?.estimatedValue?.toString() || '',
      currency: initialData?.currency || 'USD',
      tags: (initialData?.tags || []).join(', '),
      notes: '',
      documents: []
    }
  });

  const currentStatus = form.watch('status');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { tags, likelihoodToFund, estimatedValue, documents, ...rest } =
        values;
      const data = {
        ...rest,
        internalOwner: values.internalOwner || '',
        likelihoodToFund: likelihoodToFund
          ? parseInt(likelihoodToFund)
          : undefined,
        estimatedValue: estimatedValue ? parseInt(estimatedValue) : undefined,
        tags: tags
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined
      };

      const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bilateral-engagements`;

      if (initialData) {
        // Update existing engagement
        const engagementId = initialData.id || (initialData as any)._id;
        const response = await fetch(`${apiUrl}/${engagementId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to update engagement');
        }

        toast.success('Engagement updated successfully');
        await uploadDocuments(documents, engagementId);
      } else {
        // Create new engagement
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to create engagement');
        }

        const created = await response.json();
        toast.success('Engagement created successfully');
        await uploadDocuments(documents, created.id || created._id);
      }
      router.push('/dashboard/bilateral-engagements');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  }

  async function uploadDocuments(
    files: File[] | undefined,
    engagementId?: string
  ) {
    if (!files?.length || !engagementId) return;

    await Promise.all(
      files.map(async (file) => {
        await fetch(`/api/bilateral-engagements/${engagementId}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            url: file.name
          })
        });
      })
    );
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
            steps={[...engagementStages]}
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
              name='organizationName'
              label='Organization / Stakeholder'
              placeholder='Enter organization name'
              required
            />
            <FormInput
              control={form.control}
              name='contactPerson'
              label='Primary Contact'
              placeholder='e.g. Bill Gates'
            />
            <FormInput
              control={form.control}
              name='contactRole'
              label='Contact Role'
              placeholder='e.g. Program Officer'
            />
            <FormInput
              control={form.control}
              name='email'
              label='Email'
              placeholder='contact@example.com'
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
              label='Engagement Stage'
              placeholder='Select stage'
              options={engagementStages.map((stage) => ({
                label: stage,
                value: stage
              }))}
            />
            <FormInput
              control={form.control}
              name='likelihoodToFund'
              label='Likelihood to Fund (%)'
              type='number'
              min={0}
              max={100}
            />
            <FormInput
              control={form.control}
              name='estimatedValue'
              label='Estimated Value'
              type='number'
              min={0}
              placeholder='Potential value'
            />
            <FormSelect
              control={form.control}
              name='currency'
              label='Currency'
              placeholder='Select currency'
              options={[
                { label: 'USD', value: 'USD' },
                { label: 'KES', value: 'KES' },
                { label: 'EUR', value: 'EUR' },
                { label: 'GBP', value: 'GBP' }
              ]}
            />
            <FormInput
              control={form.control}
              name='tags'
              label='Tags'
              placeholder='Climate, Energy, Nairobi'
              description='Comma separated descriptors for filtering'
            />
          </div>

          <FormTextarea
            control={form.control}
            name='notes'
            label='Notes / Latest Update'
            placeholder='Log outreach, meetings, or sentiment...'
            config={{
              maxLength: 2000,
              showCharCount: true,
              rows: 6
            }}
          />

          <FormFileUpload
            control={form.control}
            name='documents'
            label='Documents'
            description='Upload MOUs, proposals, or correspondence.'
            config={{
              maxSize: 10 * 1024 * 1024,
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
            {initialData ? 'Update' : 'Create'} Engagement
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
