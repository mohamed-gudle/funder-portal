'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseFormFieldProps } from '@/types/base-form';

interface UserOption {
  label: string;
  value: string;
  image?: string;
  initials?: string;
  disabled?: boolean;
}

interface FormSelectAvatarProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: UserOption[];
  placeholder?: string;
}

function FormSelectAvatar<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  options,
  placeholder = 'Select a user',
  disabled,
  className
}: FormSelectAvatarProps<TFieldValues, TName>) {
  const selectedOption = options.find(
    (opt) => opt.value === control._formValues?.[name]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className='ml-1 text-red-500'>*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage src={option.image} alt={option.label} />
                      <AvatarFallback className='text-xs'>
                        {option.initials || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormSelectAvatar, type UserOption };
