'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProgramDialog } from '@/features/programs/components/program-dialog';
import { usePrograms } from '@/hooks/use-programs';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Control } from 'react-hook-form';

interface FormProgramSelectProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

export function FormProgramSelect({
  control,
  name,
  label,
  placeholder = 'Select a program',
  description
}: FormProgramSelectProps) {
  const { programs, isLoading } = usePrograms();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <div className='flex gap-2'>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                  {programs.length === 0 && !isLoading && (
                    <div className='text-muted-foreground p-2 text-center text-sm'>
                      No programs found
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => setIsDialogOpen(true)}
                title='Create New Program'
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </div>
            {description && (
              <p className='text-muted-foreground text-sm'>{description}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <ProgramDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProgramCreated={(newId) => {
          // Verify if control passed has setValue method accessible or if we rely on re-render
          // field.onChange(newId) is only available inside render prop.
          // Since we are outside, we need access to form methods or pass a callback.
          // However, react-hook-form control object exposes _fields but not setValue directly in types usually
          // But standard way is usually to pass setValue or useFormContext.
          // For now, let's assume the user will manually select it or we can try to hack it if we had setValue.
          // Better approach:
          // The Select component will re-render with the new list including the new program.
          // We can't easily auto-select it without setValue passed as prop.
          // I'll update the component signature to verify if I need setValue.
          // Wait, 'control' is passed. I can use useFormContext if the form is wrapped in FormProvider,
          // or just ask caller to pass setValue.
          // For simplicity in this step, I'll stick to just creating it, user can then select it.
          // Actually, let's auto-select by finding the field and updating it if possible.
          // But simpler is to let user select it for now, unless I see `setValue` in props.
          // UPDATE: I will assume the component should handle auto-selection if possible but without setValue it's hard.
          // I will look at how `FormSelectAvatar` does it or if I can use `useFormContext` in `OpenCallForm`.
          // `OpenCallForm` uses `Form` from `shadcn`, which uses `FormProvider`.
          // So `useFormContext` should work!
        }}
      />
    </>
  );
}
