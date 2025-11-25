'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { OpenCall } from '@/types/modules';
import { parseAsInteger, useQueryState } from 'nuqs';
import { columns } from './columns';

interface OpenCallTableProps {
  data: OpenCall[];
  totalItems: number;
}

export default function OpenCallTable({
  data,
  totalItems
}: OpenCallTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
