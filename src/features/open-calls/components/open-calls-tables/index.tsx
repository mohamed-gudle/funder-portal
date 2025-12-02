'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { OpenCall } from '@/types/modules';
import { columns } from './columns';
import { useMemo } from 'react';

interface OpenCallTableProps {
  data: OpenCall[];
  totalItems: number;
}

export default function OpenCallTable({
  data,
  totalItems
}: OpenCallTableProps) {
  // Use useMemo to ensure data doesn't cause unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);

  const { table } = useDataTable({
    data: memoizedData,
    columns,
    pageCount: Math.ceil(totalItems / 10),
    shallow: false,
    debounceMs: 500,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10
      }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
