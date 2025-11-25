'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { BilateralEngagement } from '@/types/modules';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<BilateralEngagement>[] = [
  {
    accessorKey: 'funder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Funder' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Funder',
      placeholder: 'Filter by funder...',
      variant: 'text'
    }
  },
  {
    accessorKey: 'sector',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sector' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Sector',
      variant: 'multiSelect',
      options: [
        { label: 'Energy', value: 'Energy' },
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Clean Cooking', value: 'Clean Cooking' }
      ]
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'priorityProject',
    header: 'Priority Project'
  },
  {
    accessorKey: 'stage',
    header: 'Stage',
    cell: ({ row }) => {
      const stage = row.getValue('stage') as string;
      return <Badge variant='outline'>{stage}</Badge>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Stage',
      variant: 'multiSelect',
      options: [
        { label: 'Identification', value: 'Identification' },
        { label: 'Engagement ongoing', value: 'Engagement ongoing' },
        {
          label: 'Proposal under development',
          value: 'Proposal under development'
        },
        { label: 'Decision pending', value: 'Decision pending' },
        { label: 'Paused', value: 'Paused' },
        { label: 'Closed', value: 'Closed' }
      ]
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'internalOwner',
    header: 'Owner'
  },
  {
    accessorKey: 'nextFollowUpDate',
    header: 'Next Follow-up',
    cell: ({ row }) => {
      const dateStr = row.getValue('nextFollowUpDate') as string;
      if (!dateStr) return <span>-</span>;
      const date = new Date(dateStr);
      return <span>{date.toLocaleDateString()}</span>;
    }
  },
  {
    accessorKey: 'latestEmail',
    header: 'Latest Update',
    cell: ({ row }) => {
      const update = row.getValue('latestEmail') as string;
      return (
        <span className='block max-w-[200px] truncate' title={update}>
          {update || '-'}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
