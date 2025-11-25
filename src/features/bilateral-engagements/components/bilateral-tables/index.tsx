'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { BilateralEngagement } from '@/types/modules';
import { columns } from './columns';
import { parseAsInteger, useQueryState } from 'nuqs';

interface BilateralTableProps {
  data: BilateralEngagement[];
  totalItems: number;
}

export default function BilateralTable({
  data,
  totalItems
}: BilateralTableProps) {
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
