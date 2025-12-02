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
      const formattedDate = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const dateBadge = (() => {
        if (diffDays < 0) {
          return {
            label: 'Past due',
            className:
              'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900'
          };
        }
        if (diffDays === 0) {
          return {
            label: 'Due today',
            className:
              'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-100 dark:border-orange-900'
          };
        }
        if (diffDays <= 7) {
          return {
            label: `Due in ${diffDays}d`,
            className:
              'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900'
          };
        }
        if (diffDays <= 30) {
          return {
            label: 'Due this month',
            className:
              'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-900'
          };
        }
        return {
          label: `In ${diffDays}d`,
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900'
        };
      })();

      return (
        <div className='flex flex-col gap-1'>
          <span className='text-foreground text-sm font-medium'>
            {formattedDate}
          </span>
          <Badge variant='outline' className={dateBadge.className}>
            {dateBadge.label}
          </Badge>
        </div>
      );
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
      const statusColorMap: Record<string, string> = {
        Intake:
          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700',
        Reviewing:
          'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-900',
        'Go/No-Go':
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900',
        'Application preparation':
          'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-100 dark:border-indigo-900',
        'Application submitted':
          'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900',
        Outcome:
          'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-100 dark:border-purple-900'
      };

      const className =
        statusColorMap[status] ||
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/60 dark:text-gray-100 dark:border-gray-700';

      return (
        <Badge variant='outline' className={className}>
          {status}
        </Badge>
      );
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
