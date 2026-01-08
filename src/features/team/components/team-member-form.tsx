'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { TeamMember } from '@/types/modules';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  speciality: z.string().min(1, { message: 'Speciality is required.' }),
  position: z.string().min(1, { message: 'Position is required.' }),
  role: z.enum(['admin', 'member']),
  profilePhoto: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal(''))
});

export default function TeamMemberForm({
  initialData,
  pageTitle
}: {
  initialData: TeamMember | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phoneNumber: initialData?.phoneNumber || '',
      speciality: initialData?.speciality || '',
      position: initialData?.position || '',
      role: initialData?.role || 'member',
      profilePhoto: initialData?.profilePhoto || ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        ...values,
        profilePhoto: values.profilePhoto || ''
      };

      if (initialData) {
        const res = await fetch(`/api/team/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update');
        toast.success('Team member updated successfully');
      } else {
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create');
        toast.success('Team member created successfully');
      }
      router.push('/dashboard/team');
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
              name='name'
              label='Name'
              placeholder='Enter full name'
              required
            />
            <FormInput
              control={form.control}
              name='email'
              label='Email'
              placeholder='Enter email address'
              type='email'
              required
            />
            <FormInput
              control={form.control}
              name='phoneNumber'
              label='Phone Number'
              placeholder='Enter phone number'
              required
            />
            <FormSelect
              control={form.control}
              name='position'
              label='Position'
              placeholder='Select position'
              required
              options={[
                { label: 'Executive Director', value: 'Executive Director' },
                { label: 'Program Manager', value: 'Program Manager' },
                {
                  label: 'Senior Program Officer',
                  value: 'Senior Program Officer'
                },
                { label: 'Program Officer', value: 'Program Officer' },
                { label: 'Technical Advisor', value: 'Technical Advisor' },
                { label: 'Finance Manager', value: 'Finance Manager' },
                { label: 'Project Coordinator', value: 'Project Coordinator' },
                {
                  label: 'Communications Officer',
                  value: 'Communications Officer'
                }
              ]}
            />
            <FormSelect
              control={form.control}
              name='speciality'
              label='Speciality'
              placeholder='Select area of expertise'
              required
              options={[
                { label: 'Energy', value: 'Energy' },
                {
                  label: 'Water and Sanitation',
                  value: 'Water and Sanitation'
                },
                { label: 'Agriculture', value: 'Agriculture' },
                { label: 'Clean Cooking', value: 'Clean Cooking' },
                { label: 'Health', value: 'Health' },
                { label: 'Education', value: 'Education' },
                { label: 'Climate Change', value: 'Climate Change' }
              ]}
            />
            <FormSelect
              control={form.control}
              name='role'
              label='Role'
              placeholder='Select role'
              required
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'Member', value: 'member' }
              ]}
            />
          </div>

          <Button type='submit'>
            {initialData ? 'Update' : 'Create'} Team Member
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
