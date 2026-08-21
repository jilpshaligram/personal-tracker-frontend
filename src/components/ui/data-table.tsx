import React from 'react';
import { flexRender, useTable, stockFeatures } from '@tanstack/react-table';
import type { ColumnDef, RowData } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from './table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof stockFeatures, TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;

  // Optional pagination props
  currentPage?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  isLoading,
  emptyState,
  currentPage,
  pageSize,
  totalRecords,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData>) {
  const table = useTable({
    features: stockFeatures,
    data,
    columns,
  });

  const hasPagination = currentPage !== undefined && totalRecords !== undefined && totalRecords > 0;

  const startRecordIndex = hasPagination ? (currentPage - 1) * (pageSize || 10) + 1 : 0;
  const endRecordIndex = hasPagination ? Math.min(currentPage * (pageSize || 10), totalRecords) : 0;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between ${
        data.length < 5 ? 'min-h-[400px]' : ''
      }`}
    >
      <div
        className={`overflow-auto relative ${data.length < 5 ? 'min-h-[320px]' : ''} max-h-[60vh] lg:max-h-[calc(100vh-320px)]`}
      >
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading data...</p>
          </div>
        ) : data.length === 0 && emptyState ? (
          emptyState
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-slate-200 bg-slate-50/75 select-none hover:bg-slate-50/75"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {table
              .getFooterGroups()
              .some((group) => group.headers.some((h) => h.column.columnDef.footer)) && (
              <TableFooter>
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow
                    key={footerGroup.id}
                    className="border-t border-slate-200 hover:bg-transparent"
                  >
                    {footerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.footer, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            )}
          </Table>
        )}
      </div>

      {hasPagination && !isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 rounded-b-xl text-xs text-slate-600 mt-auto">
          <div className="flex items-center gap-3">
            <span>
              Showing <span className="font-semibold text-slate-800">{startRecordIndex}</span> to{' '}
              <span className="font-semibold text-slate-800">{endRecordIndex}</span> of{' '}
              <span className="font-semibold text-slate-800">{totalRecords}</span> records
            </span>

            {onPageSizeChange && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 text-xs font-medium rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 cursor-pointer"
                  aria-label="Rows per page"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          {totalPages && totalPages > 1 && onPageChange && currentPage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
