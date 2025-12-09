import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePrograms } from '@/hooks/use-programs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const programSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  sectors: z.string().optional() // Comma separated for simplicity, or handle as array
});

interface ProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgramCreated: (programId: string) => void;
}

export function ProgramDialog({
  open,
  onOpenChange,
  onProgramCreated
}: ProgramDialogProps) {
  const { createProgram } = usePrograms();

  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: '',
      description: '',
      sectors: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof programSchema>) => {
    try {
      const sectors = values.sectors
        ? values.sectors.split(',').map((s) => s.trim())
        : [];

      const newProgram = await createProgram({
        name: values.name,
        description: values.description,
        status: 'Active'
        // sectors not currently in hook type but can be passed
      });

      toast.success('Program created successfully');
      form.reset();
      onProgramCreated(newProgram.id);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create program');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Program</DialogTitle>
          <DialogDescription>
            Add a new program to link with funding opportunities.
          </DialogDescription>
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
                  <Input placeholder='Program name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Describe the program...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sectors'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sectors (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder='Health, Education, Tech' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
