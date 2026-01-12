'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  useUserProfile,
  useCreateTeamMember,
  useUpdateTeamMember
} from '@/hooks/use-api';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  phoneNumber: z.string().optional(),
  speciality: z.string().optional(),
  position: z.string().optional()
});

export default function ProfileEditForm() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [teamMember, setTeamMember] = useState<any>(null);

  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  const createTeamMember = useCreateTeamMember();
  const updateTeamMember = useUpdateTeamMember();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      speciality: '',
      position: ''
    }
  });

  useEffect(() => {
    if (!isPending && session?.user && profileData) {
      setTeamMember(profileData.teamMemberId ? profileData : null);
      form.reset({
        name: profileData.name || '',
        phoneNumber: profileData.phoneNumber || '',
        speciality: profileData.speciality || '',
        position: profileData.position || ''
      });
    }
  }, [isPending, session, profileData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user) return;

    try {
      // Update or create team member
      if (teamMember && teamMember.teamMemberId) {
        await updateTeamMember.mutateAsync({
          id: teamMember.teamMemberId,
          data: {
            name: values.name,
            phoneNumber: values.phoneNumber,
            speciality: values.speciality,
            position: values.position
          }
        });
      } else {
        await createTeamMember.mutateAsync({
          name: values.name,
          email: session.user.email,
          phoneNumber: values.phoneNumber || '',
          speciality: values.speciality || 'General',
          position: values.position || 'Team Member',
          profilePhoto: session.user.image || ''
        });
      }

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

  if (isPending || profileLoading || !session?.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Profile</h3>
        <p className='text-muted-foreground text-sm'>
          Manage your personal information and team details.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                control={form.control}
                name='name'
                label='Full Name'
                placeholder='Enter your full name'
                required
              />
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Email</label>
                <input
                  type='email'
                  value={session.user.email || ''}
                  disabled
                  className='bg-muted flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                />
                <p className='text-muted-foreground text-xs'>
                  Email address is managed by your authentication provider.
                </p>
              </div>
              <FormInput
                control={form.control}
                name='phoneNumber'
                label='Phone Number'
                placeholder='Enter your phone number'
              />
              <FormSelect
                control={form.control}
                name='position'
                label='Position'
                placeholder='Select position'
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
                  {
                    label: 'Project Coordinator',
                    value: 'Project Coordinator'
                  },
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
            </div>

            <Button
              type='submit'
              disabled={
                createTeamMember.isPending || updateTeamMember.isPending
              }
            >
              {createTeamMember.isPending || updateTeamMember.isPending
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
