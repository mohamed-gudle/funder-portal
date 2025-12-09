'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title is required.' }),
  docType: z.enum([
    'general',
    'sector',
    'specialty',
    'engagement',
    'application',
    'organization',
    'other'
  ]),
  sectors: z.string().optional(),
  specialties: z.string().optional(),
  engagementStages: z.string().optional(),
  applicationTypes: z.string().optional(),
  organizations: z.string().optional(),
  region: z.string().optional(),
  year: z.string().optional(),
  tags: z.string().optional(),
  sensitivity: z.enum(['public', 'internal', 'confidential']),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  file: z.array(z.any()).min(1, { message: 'Please upload a document.' })
});

type FormValues = z.infer<typeof formSchema>;

function appendField(formData: FormData, key: string, value?: string | null) {
  if (!value) return;
  formData.append(key, value);
}

export function KnowledgeUploadDrawer({
  open,
  onOpenChange,
  onUploaded
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      docType: 'general',
      sectors: '',
      specialties: '',
      engagementStages: '',
      applicationTypes: '',
      organizations: '',
      region: '',
      year: '',
      tags: '',
      sensitivity: 'internal',
      sourceUrl: '',
      file: []
    }
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    appendField(formData, 'title', values.title);
    appendField(formData, 'docType', values.docType);
    appendField(formData, 'sectors', values.sectors);
    appendField(formData, 'specialties', values.specialties);
    appendField(formData, 'engagementStages', values.engagementStages);
    appendField(formData, 'applicationTypes', values.applicationTypes);
    appendField(formData, 'organizations', values.organizations);
    appendField(formData, 'region', values.region);
    appendField(formData, 'year', values.year);
    appendField(formData, 'tags', values.tags);
    appendField(formData, 'sensitivity', values.sensitivity);
    appendField(formData, 'sourceUrl', values.sourceUrl);

    if (values.file?.[0]) {
      formData.append('file', values.file[0]);
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to upload document');
      }

      toast.success('Document uploaded');
      form.reset({
        title: '',
        docType: 'general',
        sectors: '',
        specialties: '',
        engagementStages: '',
        applicationTypes: '',
        organizations: '',
        region: '',
        year: '',
        tags: '',
        sensitivity: 'internal',
        sourceUrl: '',
        file: []
      });
      onUploaded();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full max-w-xl overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Upload document</SheetTitle>
          <SheetDescription>
            Attach a document and tag it for retrieval.
          </SheetDescription>
        </SheetHeader>

        <div className='px-4 pb-4'>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5'
          >
            <div className='grid grid-cols-1 gap-4'>
              <FormInput
                control={form.control}
                name='title'
                label='Title'
                placeholder='e.g. Primary Care Playbook'
                required
              />
              <FormSelect
                control={form.control}
                name='docType'
                label='Document type'
                options={[
                  { label: 'General', value: 'general' },
                  { label: 'Sector', value: 'sector' },
                  { label: 'Specialty', value: 'specialty' },
                  { label: 'Engagement', value: 'engagement' },
                  { label: 'Application', value: 'application' },
                  { label: 'Organization', value: 'organization' },
                  { label: 'Other', value: 'other' }
                ]}
              />
              <FormInput
                control={form.control}
                name='sectors'
                label='Sectors'
                placeholder='Comma separated (health, energy, ...)'
              />
              <FormInput
                control={form.control}
                name='specialties'
                label='Specialties'
                placeholder='Comma separated (primary-care, immunization, ...)'
              />
              <FormInput
                control={form.control}
                name='engagementStages'
                label='Engagement stages'
                placeholder='Comma separated (discovery, proposal, ...)'
              />
              <FormInput
                control={form.control}
                name='applicationTypes'
                label='Application types'
                placeholder='Comma separated (concept-note, full-proposal, ...)'
              />
              <FormInput
                control={form.control}
                name='organizations'
                label='Organizations'
                placeholder='Comma separated (WHO, Gates, ...)'
              />
              <FormInput
                control={form.control}
                name='region'
                label='Region'
                placeholder='e.g. SSA, Global'
              />
              <FormInput
                control={form.control}
                name='year'
                label='Year'
                placeholder='2024'
              />
              <FormInput
                control={form.control}
                name='sourceUrl'
                label='Source URL'
                placeholder='https://...'
              />
              <FormInput
                control={form.control}
                name='tags'
                label='Tags'
                placeholder='Comma separated (tone:formal, audience:donor)'
              />
              <FormSelect
                control={form.control}
                name='sensitivity'
                label='Sensitivity'
                options={[
                  { label: 'Public', value: 'public' },
                  { label: 'Internal', value: 'internal' },
                  { label: 'Confidential', value: 'confidential' }
                ]}
              />
              <FormFileUpload
                control={form.control}
                name='file'
                label='Document'
                required
                config={{
                  acceptedTypes: [
                    'application/pdf',
                    'text/plain',
                    'text/markdown',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  ],
                  maxSize: 15 * 1024 * 1024,
                  multiple: false,
                  maxFiles: 1
                }}
              />
            </div>

            <SheetFooter>
              <Button type='submit' disabled={submitting}>
                {submitting ? 'Uploading...' : 'Upload document'}
              </Button>
            </SheetFooter>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
