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
      const stageColorMap: Record<string, string> = {
        Identification:
          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700',
        'Engagement ongoing':
          'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-100 dark:border-sky-900',
        'Proposal under development':
          'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-100 dark:border-indigo-900',
        'Decision pending':
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900',
        Paused:
          'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-100 dark:border-orange-900',
        Closed:
          'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-100 dark:border-rose-900'
      };

      const className =
        stageColorMap[stage] ||
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/60 dark:text-gray-100 dark:border-gray-700';

      return (
        <Badge variant='outline' className={className}>
          {stage}
        </Badge>
      );
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
      const formattedDate = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const now = new Date();
      const diffDays = Math.ceil(
        (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const followUpBadge = (() => {
        if (diffDays < 0) {
          return {
            label: 'Overdue',
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
            label: `In ${diffDays}d`,
            className:
              'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900'
          };
        }
        return {
          label: 'Scheduled',
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900'
        };
      })();

      return (
        <div className='flex flex-col gap-1'>
          <span className='text-foreground text-sm font-medium'>
            {formattedDate}
          </span>
          <Badge variant='outline' className={followUpBadge.className}>
            {followUpBadge.label}
          </Badge>
        </div>
      );
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
