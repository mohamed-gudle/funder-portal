'use client';

import { FormFileUpload } from '@/components/forms/form-file-upload';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormSelectAvatar } from '@/components/forms/form-select-avatar';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { fakeOpenCalls } from '@/constants/mock-modules';
import { OpenCall } from '@/types/modules';
import { useTeamMembers } from '@/hooks/use-team-members';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title is required.' }),
  funder: z.string().min(2, { message: 'Funder is required.' }),
  sector: z.string().min(1, { message: 'Sector is required.' }),
  grantType: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().min(1, { message: 'Deadline is required.' }),
  url: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  priorityProject: z.string().optional(),
  thematicAlignment: z.string().optional(),
  internalOwner: z.string().optional(),
  status: z.enum([
    'Intake',
    'Reviewing',
    'Go/No-Go',
    'Application preparation',
    'Application submitted',
    'Outcome'
  ]),
  documents: z.array(z.any()).optional()
});

export default function OpenCallForm({
  initialData,
  pageTitle
}: {
  initialData: OpenCall | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const { teamMembers } = useTeamMembers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      funder: initialData?.funder || '',
      sector: initialData?.sector || '',
      grantType: initialData?.grantType || '',
      budget: initialData?.budget || '',
      deadline: initialData?.deadline
        ? new Date(initialData.deadline).toISOString().split('T')[0]
        : '',
      url: initialData?.url || '',
      description: initialData?.description || '',
      priorityProject: initialData?.priorityProject || '',
      thematicAlignment: initialData?.thematicAlignment || '',
      internalOwner: initialData?.internalOwner || '',
      status: initialData?.status || 'Intake',
      documents: []
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { documents, ...rest } = values;
      const data = {
        ...rest,
        grantType: values.grantType || '',
        budget: values.budget || '',
        description: values.description || '',
        internalOwner: values.internalOwner || ''
      };

      if (initialData) {
        await fakeOpenCalls.update(initialData.id, data);
        toast.success('Open call updated successfully');
      } else {
        await fakeOpenCalls.add(data);
        toast.success('Open call created successfully');
      }
      router.push('/dashboard/open-calls');
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
                { label: 'Clean Cooking', value: 'Clean Cooking' },
                { label: 'Water', value: 'Water' },
                { label: 'Health', value: 'Health' }
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
            />
            <FormSelect
              control={form.control}
              name='status'
              label='Status'
              placeholder='Select status'
              options={[
                { label: 'Intake', value: 'Intake' },
                { label: 'Reviewing', value: 'Reviewing' },
                { label: 'Go/No-Go', value: 'Go/No-Go' },
                {
                  label: 'Application preparation',
                  value: 'Application preparation'
                },
                {
                  label: 'Application submitted',
                  value: 'Application submitted'
                },
                { label: 'Outcome', value: 'Outcome' }
              ]}
              disabled={!initialData} // Only editable if updating, or follow workflow rules
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
            <FormInput
              control={form.control}
              name='thematicAlignment'
              label='Thematic Alignment'
              placeholder='Alignment details'
            />
          </div>

          <FormFileUpload
            control={form.control}
            name='documents'
            label='Documents'
            description='Upload concept notes, drafts, etc.'
            config={{
              maxSize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5
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
