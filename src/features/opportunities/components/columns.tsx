'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Opportunity } from '@/types/modules';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='max-w-[300px] truncate' title={row.getValue('title')}>
          {row.getValue('title')}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Title',
      variant: 'text'
    }
  },
  {
    accessorKey: 'organization',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Organization' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Organization',
      variant: 'text'
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline'
  },
  {
    accessorKey: 'energy_sector',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sector' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Sector',
      variant: 'text' // Using text for now as we don't have a fixed list yet, or we could extract unique values if we had data upfront.
    }
  },
  {
    accessorKey: 'relevance_score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Relevance' />
    ),
    cell: ({ row }) => {
      const score = parseFloat(row.getValue('relevance_score'));
      let color = 'bg-red-100 text-red-800';
      if (score >= 0.8) color = 'bg-green-100 text-green-800';
      else if (score >= 0.5) color = 'bg-yellow-100 text-yellow-800';

      return (
        <Badge className={color} variant='outline'>
          {score}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
