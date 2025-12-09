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

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  phoneNumber: z.string().optional(),
  speciality: z.string().optional(),
  position: z.string().optional()
});

export default function ProfileEditForm() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teamMember, setTeamMember] = useState<any>(null);

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
    if (!isPending && session?.user) {
      // Fetch team member data by email
      const fetchTeamMember = async () => {
        try {
          const res = await fetch(
            `/api/team/by-email?email=${encodeURIComponent(session.user.email || '')}`
          );
          if (res.ok) {
            const data = await res.json();
            setTeamMember(data);
            form.reset({
              name: data.name || session.user.name || '',
              phoneNumber: data.phoneNumber || '',
              speciality: data.speciality || '',
              position: data.position || ''
            });
          } else {
            // No team member data, use session data
            form.reset({
              name: session.user.name || '',
              phoneNumber: '',
              speciality: '',
              position: ''
            });
          }
        } catch (error) {
          console.error('Error fetching team member:', error);
          form.reset({
            name: session.user.name || '',
            phoneNumber: '',
            speciality: '',
            position: ''
          });
        }
      };

      fetchTeamMember();
    }
  }, [isPending, session, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user) return;

    try {
      setLoading(true);

      // Update or create team member
      if (teamMember) {
        const res = await fetch(`/api/team/${teamMember.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            phoneNumber: values.phoneNumber,
            speciality: values.speciality,
            position: values.position
          })
        });
        if (!res.ok) throw new Error('Failed to update');
      } else {
        // Create new team member record
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: session.user.email,
            phoneNumber: values.phoneNumber || '',
            speciality: values.speciality || 'General',
            position: values.position || 'Team Member',
            profilePhoto: session.user.image || ''
          })
        });
        if (!res.ok) throw new Error('Failed to create');
      }

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session?.user) {
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

            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
