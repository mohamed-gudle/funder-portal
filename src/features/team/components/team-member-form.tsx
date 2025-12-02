'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { fakeTeamMembers } from '@/constants/mock-modules';
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
        await fakeTeamMembers.update(initialData.id, data);
        toast.success('Team member updated successfully');
      } else {
        await fakeTeamMembers.add(data);
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
            <FormInput
              control={form.control}
              name='position'
              label='Position'
              placeholder='Enter job position'
              required
            />
            <FormInput
              control={form.control}
              name='speciality'
              label='Speciality'
              placeholder='Enter area of speciality'
              required
            />
            <FormInput
              control={form.control}
              name='profilePhoto'
              label='Profile Photo URL'
              placeholder='https://...'
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
