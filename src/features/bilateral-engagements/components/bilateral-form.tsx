'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { fakeBilateralEngagements } from '@/constants/mock-modules';
import { BilateralEngagement } from '@/types/modules';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  funder: z.string().min(2, { message: 'Funder is required.' }),
  sector: z.string().min(1, { message: 'Sector is required.' }),
  engagementType: z.string().optional(),
  priorityProject: z.string().optional(),
  internalOwner: z.string().optional(),
  stage: z.enum([
    'Identification',
    'Engagement ongoing',
    'Proposal under development',
    'Decision pending',
    'Paused',
    'Closed'
  ]),
  latestEmail: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
  confidenceLevel: z.enum(['High', 'Medium', 'Low']).optional(),
  notes: z.string().optional(),
  importanceScore: z.string().optional()
});

export default function BilateralForm({
  initialData,
  pageTitle
}: {
  initialData: BilateralEngagement | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      funder: initialData?.funder || '',
      sector: initialData?.sector || '',
      engagementType: initialData?.engagementType || '',
      priorityProject: initialData?.priorityProject || '',
      internalOwner: initialData?.internalOwner || '',
      stage: initialData?.stage || 'Identification',
      latestEmail: initialData?.latestEmail || '',
      nextFollowUpDate: initialData?.nextFollowUpDate
        ? new Date(initialData.nextFollowUpDate).toISOString().split('T')[0]
        : '',
      confidenceLevel: initialData?.confidenceLevel || 'Medium',
      notes: '',
      importanceScore: initialData?.importanceScore?.toString() || ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { notes, ...rest } = values;
      const data = {
        ...rest,
        engagementType: values.engagementType || '',
        priorityProject: values.priorityProject || '',
        internalOwner: values.internalOwner || '',
        latestEmail: values.latestEmail || '',
        nextFollowUpDate: values.nextFollowUpDate || '',
        importanceScore: values.importanceScore
          ? parseInt(values.importanceScore)
          : undefined
      };

      if (initialData) {
        await fakeBilateralEngagements.update(initialData.id, data);
        toast.success('Engagement updated successfully');
      } else {
        await fakeBilateralEngagements.add(data);
        toast.success('Engagement created successfully');
      }
      router.push('/dashboard/bilateral-engagements');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
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
              name='funder'
              label='Funder'
              placeholder='Enter funder name'
              required
            />
            <FormSelect
              control={form.control}
              name='sector'
              label='Sector'
              placeholder='Select sector'
              required
              options={[
                { label: 'Energy', value: 'Energy' },
                { label: 'Agriculture', value: 'Agriculture' },
                { label: 'Clean Cooking', value: 'Clean Cooking' }
              ]}
            />
            <FormInput
              control={form.control}
              name='engagementType'
              label='Engagement Type'
              placeholder='e.g. Early Discussion'
            />
            <FormInput
              control={form.control}
              name='priorityProject'
              label='Priority Project'
              placeholder='Linked project'
            />
            <FormInput
              control={form.control}
              name='internalOwner'
              label='Internal Owner'
              placeholder='Assign an owner'
            />
            <FormSelect
              control={form.control}
              name='stage'
              label='Stage'
              placeholder='Select stage'
              options={[
                { label: 'Identification', value: 'Identification' },
                { label: 'Engagement ongoing', value: 'Engagement ongoing' },
                {
                  label: 'Proposal under development',
                  value: 'Proposal under development'
                },
                { label: 'Decision pending', value: 'Decision pending' },
                { label: 'Paused', value: 'Paused' },
                { label: 'Closed', value: 'Closed' }
              ]}
            />
            <FormInput
              control={form.control}
              name='nextFollowUpDate'
              label='Next Follow-up Date'
              type='date'
            />
            <FormSelect
              control={form.control}
              name='confidenceLevel'
              label='Confidence Level'
              placeholder='Select confidence'
              options={[
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' }
              ]}
            />
            <FormInput
              control={form.control}
              name='importanceScore'
              label='Importance Score (1-10)'
              type='number'
              min={1}
              max={10}
            />
          </div>

          <FormTextarea
            control={form.control}
            name='latestEmail'
            label='Latest Email / Update'
            placeholder='Paste email text or update here...'
            config={{
              maxLength: 2000,
              showCharCount: true,
              rows: 6
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
