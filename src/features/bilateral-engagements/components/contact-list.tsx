'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, User, Mail, Phone, Briefcase, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  isPrimaryPointOfContact: z.boolean()
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface Contact {
  _id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  isPrimaryPointOfContact: boolean;
  createdAt: string;
}

interface ContactListProps {
  engagementId?: string;
}

export function ContactList({ engagementId: propId }: ContactListProps) {
  const params = useParams();
  const engagementId = propId || (params.id as string);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      phone: '',
      isPrimaryPointOfContact: false
    }
  });

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/bilateral-engagements/${engagementId}/contacts`
      );
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (engagementId) {
      fetchContacts();
    }
  }, [engagementId]);

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch(
        `/api/bilateral-engagements/${engagementId}/contacts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }
      );

      if (!res.ok) throw new Error('Failed to create contact');

      toast.success('Contact added successfully');
      setIsOpen(false);
      form.reset();
      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add contact');
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Counterparty Contacts</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size='sm'>
              <Plus className='mr-2 h-4 w-4' />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
            </DialogHeader>
            <Form
              form={form}
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder='Program Officer' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john@example.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='+1234567890' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isPrimaryPointOfContact'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Primary Point of Contact</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Save Contact
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='py-4 text-center text-sm text-gray-500'>
            Loading...
          </div>
        ) : contacts.length === 0 ? (
          <div className='py-4 text-center text-sm text-gray-500'>
            No contacts added yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-gray-500' />
                      {contact.name}
                      {contact.isPrimaryPointOfContact && (
                        <Badge variant='secondary' className='text-xs'>
                          Primary
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{contact.role || '-'}</TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-1 text-sm'>
                      {contact.email && (
                        <div className='flex items-center gap-2'>
                          <Mail className='h-3 w-3 text-gray-400' />
                          <a
                            href={`mailto:${contact.email}`}
                            className='hover:underline'
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className='flex items-center gap-2 text-gray-500'>
                          <Phone className='h-3 w-3' />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
