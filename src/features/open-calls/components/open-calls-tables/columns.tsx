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
    cell: ({ row }) => (
      <div
        className='max-w-[200px] truncate font-medium'
        title={row.getValue('title')}
      >
        {row.getValue('title')}
      </div>
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
    ),
    cell: ({ row }) => (
      <div className='max-w-[150px] truncate' title={row.getValue('funder')}>
        {row.getValue('funder')}
      </div>
    )
  },
  {
    accessorKey: 'sector',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sector' />
    ),
    cell: ({ row }) => {
      const sectorValue = row.getValue('sector') as string[] | string;
      const sectors = Array.isArray(sectorValue)
        ? sectorValue
        : sectorValue
          ? [sectorValue]
          : [];

      if (!sectors.length) return <span>-</span>;

      return (
        <div className='flex flex-wrap gap-1'>
          {sectors.map((sector) => (
            <Badge key={sector} variant='secondary'>
              {sector}
            </Badge>
          ))}
        </div>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const sectorValue = row.getValue(id) as string[] | string | undefined;
      const sectors = Array.isArray(sectorValue)
        ? sectorValue
        : sectorValue
          ? [sectorValue]
          : [];

      return value.some((filterValue: string) => sectors.includes(filterValue));
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
    header: 'Grant Type',
    cell: ({ row }) => (
      <div className='max-w-[150px] truncate' title={row.getValue('grantType')}>
        {row.getValue('grantType') || '-'}
      </div>
    )
  },
  {
    accessorKey: 'fundingType',
    header: 'Funding Type',
    cell: ({ row }) => (
      <div
        className='max-w-[150px] truncate'
        title={row.getValue('fundingType')}
      >
        {row.getValue('fundingType')}
      </div>
    )
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
    header: 'Owner',
    cell: ({ row }) => (
      <div
        className='max-w-[150px] truncate'
        title={row.getValue('internalOwner')}
      >
        {row.getValue('internalOwner')}
      </div>
    )
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const priorityColorMap: Record<string, string> = {
        High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900',
        Medium:
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900',
        Low: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900'
      };

      return (
        <Badge
          variant='outline'
          className={
            priorityColorMap[priority] ||
            'border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100'
          }
        >
          {priority}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Priority',
      variant: 'multiSelect',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ]
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColorMap: Record<string, string> = {
        'In Review':
          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700',
        'Go/No-Go':
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900',
        'Proposal Writing':
          'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-100 dark:border-indigo-900',
        'Internal Review':
          'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-900',
        'Submission Stage':
          'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-100 dark:border-cyan-900',
        Submitted:
          'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900',
        Accepted:
          'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/50 dark:text-lime-100 dark:border-lime-900',
        Rejected:
          'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-100 dark:border-rose-900'
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
        { label: 'In Review', value: 'In Review' },
        { label: 'Go/No-Go', value: 'Go/No-Go' },
        { label: 'Proposal Writing', value: 'Proposal Writing' },
        { label: 'Internal Review', value: 'Internal Review' },
        { label: 'Submission Stage', value: 'Submission Stage' },
        { label: 'Submitted', value: 'Submitted' },
        { label: 'Accepted', value: 'Accepted' },
        { label: 'Rejected', value: 'Rejected' }
      ]
    }
  },
  {
    accessorKey: 'callStatus',
    header: 'Call Status',
    cell: ({ row }) => {
      const callStatus = row.getValue('callStatus') as string;
      const callStatusMap: Record<string, string> = {
        Open: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900',
        Closed:
          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700'
      };
      return (
        <Badge
          variant='outline'
          className={
            callStatusMap[callStatus] ||
            'border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100'
          }
        >
          {callStatus}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
