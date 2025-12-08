'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { BilateralEngagement } from '@/types/modules';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<BilateralEngagement>[] = [
  {
    accessorKey: 'organizationName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Organization' />
    ),
    cell: ({ row }) => (
      <div
        className='max-w-[160px] truncate font-medium'
        title={row.getValue('organizationName')}
      >
        {row.getValue('organizationName')}
      </div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Organization',
      placeholder: 'Filter by organization...',
      variant: 'text'
    }
  },
  {
    accessorKey: 'contactPerson',
    header: 'Contact',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span
          className='max-w-[150px] truncate'
          title={row.getValue('contactPerson')}
        >
          {row.getValue('contactPerson') || '-'}
        </span>
        <span className='text-muted-foreground text-xs'>
          {row.original.contactRole || ''}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Stage',
    cell: ({ row }) => {
      const stage = row.getValue('status') as string;
      const stageColorMap: Record<string, string> = {
        'Cold Email':
          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700',
        'First Engagement':
          'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-100 dark:border-sky-900',
        'Proposal Stage':
          'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-100 dark:border-indigo-900',
        Contracting:
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900',
        Partner:
          'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900',
        Funder:
          'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/50 dark:text-lime-100 dark:border-lime-900',
        'No Relationship':
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
        { label: 'Cold Email', value: 'Cold Email' },
        { label: 'First Engagement', value: 'First Engagement' },
        { label: 'Proposal Stage', value: 'Proposal Stage' },
        { label: 'Contracting', value: 'Contracting' },
        { label: 'Partner', value: 'Partner' },
        { label: 'Funder', value: 'Funder' },
        { label: 'No Relationship', value: 'No Relationship' }
      ]
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'internalOwner',
    header: 'Owner',
    cell: ({ row }) => (
      <div
        className='max-w-[120px] truncate'
        title={row.getValue('internalOwner')}
      >
        {row.getValue('internalOwner')}
      </div>
    )
  },
  {
    accessorKey: 'likelihoodToFund',
    header: 'Temperature',
    cell: ({ row }) => {
      const likelihood = Number(row.getValue('likelihoodToFund') || 0);
      const label =
        likelihood >= 70 ? 'Hot' : likelihood >= 30 ? 'Warm' : 'Cold';
      const colorMap: Record<string, string> = {
        Hot: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900',
        Warm: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900',
        Cold: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700'
      };

      return (
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className={colorMap[label]}>
            {label}
          </Badge>
          <span className='text-muted-foreground text-xs'>{likelihood}%</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'estimatedValue',
    header: 'Estimated Value',
    cell: ({ row }) => {
      const value = row.getValue('estimatedValue') as number;
      const currency = row.original.currency;
      if (!value) return <span>-</span>;
      return (
        <span className='block max-w-[140px] truncate font-medium'>
          {currency} {value.toLocaleString()}
        </span>
      );
    }
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = (row.getValue('tags') as string[]) || [];
      if (!tags.length) return <span>-</span>;
      return (
        <div className='flex max-w-[200px] flex-wrap gap-1'>
          {tags.map((tag) => (
            <Badge key={tag} variant='outline'>
              {tag}
            </Badge>
          ))}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
