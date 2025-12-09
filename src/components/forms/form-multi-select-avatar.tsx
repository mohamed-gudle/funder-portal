'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { FieldValues, FieldPath, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseFormFieldProps } from '@/types/base-form';
import { UserOption } from './form-select-avatar'; // Reuse existing type

interface FormMultiSelectAvatarProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: UserOption[];
  placeholder?: string;
  emptyText?: string;
}

export function FormMultiSelectAvatar<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  placeholder = 'Select users...',
  emptyText = 'No user found.',
  description,
  required,
  className
}: FormMultiSelectAvatarProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = (field.value as string[]) || [];

        const handleSelect = (value: string) => {
          const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
          field.onChange(newValues);
        };

        const handleRemove = (value: string, e: React.MouseEvent) => {
          e.stopPropagation();
          const newValues = selectedValues.filter((v) => v !== value);
          field.onChange(newValues);
        };

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='h-auto min-h-10 w-full justify-between px-3 py-2'
                >
                  <div className='flex flex-wrap items-start gap-1'>
                    {selectedValues.length === 0 && (
                      <span className='text-muted-foreground font-normal'>
                        {placeholder}
                      </span>
                    )}
                    {selectedValues.map((val) => {
                      const option = options.find((o) => o.value === val);
                      if (!option) return null;
                      return (
                        <Badge
                          key={val}
                          variant='secondary'
                          className='flex h-7 items-center gap-1 py-0.5 pr-1 pl-1'
                        >
                          <Avatar className='h-5 w-5'>
                            <AvatarImage src={option.image} />
                            <AvatarFallback className='text-[10px]'>
                              {option.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className='font-normal'>{option.label}</span>
                          <div
                            className='ring-offset-background focus:ring-ring hover:bg-muted-foreground/20 ml-1 cursor-pointer rounded-full p-0.5 outline-none focus:ring-2 focus:ring-offset-2'
                            onClick={(e) => handleRemove(val, e)}
                          >
                            <X className='text-muted-foreground hover:text-foreground h-3 w-3' />
                          </div>
                        </Badge>
                      );
                    })}
                  </div>
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = selectedValues.includes(
                          option.value
                        );
                        return (
                          <CommandItem
                            key={option.value}
                            value={option.label} // Use label for search
                            onSelect={() => handleSelect(option.value)}
                            className='gap-2'
                          >
                            <div
                              className={cn(
                                'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50 [&_svg]:invisible'
                              )}
                            >
                              <Check className={cn('h-4 w-4')} />
                            </div>
                            <Avatar className='h-6 w-6'>
                              <AvatarImage src={option.image} />
                              <AvatarFallback className='text-xs'>
                                {option.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span>{option.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
