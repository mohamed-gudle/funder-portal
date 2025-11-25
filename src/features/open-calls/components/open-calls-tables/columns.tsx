'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { OpenCall } from '@/types/modules';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<OpenCall>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Title',
      variant: 'text'
    }
  },
  {
    accessorKey: 'funder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Funder' />
    )
  },
  {
    accessorKey: 'sector',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sector' />
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: 'Sector',
      variant: 'multiSelect',
      options: [
        { label: 'Energy', value: 'Energy' },
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Clean Cooking', value: 'Clean Cooking' },
        { label: 'Water', value: 'Water' },
        { label: 'Health', value: 'Health' }
      ]
    }
  },
  {
    accessorKey: 'grantType',
    header: 'Grant Type'
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Deadline' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('deadline'));
      const formattedDate = date.toLocaleDateString();
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let color = 'text-green-600';
      if (diffDays <= 7) color = 'text-red-600 font-bold';
      else if (diffDays <= 30) color = 'text-yellow-600';

      return <span className={color}>{formattedDate}</span>;
    }
  },
  {
    accessorKey: 'internalOwner',
    header: 'Owner'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <Badge variant='outline'>{status}</Badge>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: [
        { label: 'Intake', value: 'Intake' },
        { label: 'Reviewing', value: 'Reviewing' },
        { label: 'Go/No-Go', value: 'Go/No-Go' },
        { label: 'Application preparation', value: 'Application preparation' },
        { label: 'Application submitted', value: 'Application submitted' },
        { label: 'Outcome', value: 'Outcome' }
      ]
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
