import React, { useMemo } from 'react';
import {
  useTable,
  flexRender,
  createColumnHelper,
  stockFeatures,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search, Lock } from 'lucide-react';
import { AdminCard } from '../common/AdminCard';
import { AdminBadge } from '../common/AdminBadge';
import { AdminViewHeader } from '../common/AdminViewHeader';
import type { AdminBadgeTone } from '../common/AdminBadge';
import type { AuditLogItem, AuditLogSeverity } from '../../types/admin';

interface AdminAuditLogsTableProps {
  logs: AuditLogItem[];
  loading: boolean;
  page: number;
  limit: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

const SEVERITY_TONE_MAP: Record<AuditLogSeverity, AdminBadgeTone> = {
  critical: 'red',
  warning: 'amber',
  success: 'teal',
  info: 'indigo',
};

const columnHelper = createColumnHelper<typeof stockFeatures, AuditLogItem>();

export const AdminAuditLogsTable: React.FC<AdminAuditLogsTableProps> = ({
  logs,
  loading,
  page,
  limit,
  totalRows,
  onPageChange,
  onLimitChange,
  searchQuery,
  onSearchChange,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('ts', {
        header: 'Timestamp',
        cell: (info) => (
          <span className="text-xs font-mono text-[#6B7280] whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('actor', {
        header: 'Actor',
        cell: (info) => (
          <span className="text-[12.5px] font-medium text-[#151A26]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: (info) => (
          <span className="text-xs font-semibold text-[#2F63EB]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('target', {
        header: 'API Endpoint',
        cell: (info) => <span className="text-xs font-mono text-[#6B7280]">{info.getValue()}</span>,
      }),
      columnHelper.accessor('ip', {
        header: 'IP',
        cell: (info) => <span className="text-xs font-mono text-[#9AA2B1]">{info.getValue()}</span>,
      }),
      columnHelper.accessor('severity', {
        header: 'Severity',
        cell: (info) => {
          const val = info.getValue();
          return <AdminBadge tone={SEVERITY_TONE_MAP[val]}>{val}</AdminBadge>;
        },
      }),
    ],
    []
  );

  const table = useTable({
    features: stockFeatures,
    data: logs,
    columns: columns as unknown as ColumnDef<typeof stockFeatures, AuditLogItem, unknown>[],
    manualPagination: true,
    pageCount: Math.ceil(totalRows / limit),
  });

  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div>
      <AdminViewHeader title="Audit logs" subtitle="Every admin and system action, traced." />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9AA2B1]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search logs by action or actor"
          className="w-full rounded-lg border border-[#E7E9F0] bg-[#F1F3F8] py-2 pl-9 pr-3.5 text-xs text-[#151A26] placeholder-[#9AA2B1] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2F63EB]"
        />
      </div>

      <AdminCard className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#E7E9F0] bg-[#F9FAFC]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4.5 py-3 text-[11px] font-semibold text-[#9AA2B1] uppercase tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#E7E9F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-[#9AA2B1]">
                    Loading logs...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-[#9AA2B1]">
                    No audit logs matching &quot;{searchQuery}&quot; found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4.5 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="border border-slate-200 rounded-md text-xs py-1 px-2 bg-white focus:outline-none"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            Showing {logs.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
            {Math.min(page * limit, totalRows)} of {totalRows} audit logs
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E9F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#151A26] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <span className="text-xs font-medium text-slate-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E9F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#151A26] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[#9AA2B1] mt-3">
        <Lock className="w-3 h-3 shrink-0" />
        <span>
          Log entries are append-only and cannot be edited or deleted, including by admins.
        </span>
      </div>
    </div>
  );
};
