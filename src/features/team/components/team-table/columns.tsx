'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { TeamMember } from '@/types/modules';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

export const columns: ColumnDef<TeamMember>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'profilePhoto',
    header: 'Photo',
    cell: ({ row }) => {
      const photoUrl = row.original.profilePhoto;
      return (
        <div className='relative h-10 w-10 overflow-hidden rounded-full'>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={row.original.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='bg-secondary flex h-full w-full items-center justify-center text-xs'>
              {row.original.name.charAt(0)}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableColumnFilter: true,
    meta: {
      label: 'Name',
      variant: 'text'
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'position',
    header: 'Position'
  },
  {
    accessorKey: 'speciality',
    header: 'Speciality'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
