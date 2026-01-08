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
    header: () => <div>Photo</div>,
    cell: ({ row }) => {
      const photoUrl =
        row.original.profilePhoto ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.email}`;
      return (
        <div className='relative h-10 w-10 overflow-hidden rounded-full'>
          <Image
            src={photoUrl}
            alt={row.original.name}
            fill
            className='object-cover'
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div
        className='max-w-[150px] truncate font-medium'
        title={row.getValue('name')}
      >
        {row.getValue('name')}
      </div>
    ),
    meta: {
      label: 'Name',
      variant: 'text'
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate' title={row.getValue('email')}>
        {row.getValue('email')}
      </div>
    )
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => (
      <div className='max-w-[150px] truncate' title={row.getValue('position')}>
        {row.getValue('position')}
      </div>
    )
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <div className='max-w-[100px] capitalize' title={row.getValue('role')}>
        {row.getValue('role')}
      </div>
    )
  },
  {
    accessorKey: 'speciality',
    header: 'Speciality',
    cell: ({ row }) => (
      <div
        className='max-w-[150px] truncate'
        title={row.getValue('speciality')}
      >
        {row.getValue('speciality')}
      </div>
    )
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
    cell: ({ row }) => (
      <div
        className='max-w-[120px] truncate'
        title={row.getValue('phoneNumber')}
      >
        {row.getValue('phoneNumber')}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
