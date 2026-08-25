import React, { useMemo } from 'react';
import {
  useTable,
  flexRender,
  createColumnHelper,
  stockFeatures,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search, MoreVertical } from 'lucide-react';
import { AdminCard } from '../common/AdminCard';
import { AdminBadge } from '../common/AdminBadge';
import { AdminStatusDot } from '../common/AdminStatusDot';
import { AdminViewHeader } from '../common/AdminViewHeader';
import type { AdminBadgeTone } from '../common/AdminBadge';
import type { AdminUser, AdminUserStatus } from '../../types/superAdmin';

interface AdminUsersTableProps {
  users: AdminUser[];
  loading: boolean;
  page: number;
  limit: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

const STATUS_TONE_MAP: Record<AdminUserStatus, AdminBadgeTone> = {
  active: 'teal',
  suspended: 'red',
  inactive: 'neutral',
};

const columnHelper = createColumnHelper<typeof stockFeatures, AdminUser>();

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  users,
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
      columnHelper.accessor('name', {
        header: 'User',
        cell: (info) => {
          const user = info.row.original;
          return (
            <div>
              <div className="text-[13px] font-medium text-[#151A26]">{user.name}</div>
              <div className="text-xs text-[#9AA2B1]">{user.email}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => <span className="font-mono text-xs text-[#6B7280]">{info.getValue()}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          return (
            <AdminBadge tone={STATUS_TONE_MAP[status]}>
              <AdminStatusDot status={status} size={6} />
              {status}
            </AdminBadge>
          );
        },
      }),
      columnHelper.accessor('plan', {
        header: 'Plan',
        cell: (info) => (
          <span className="text-xs font-medium text-[#6B7280]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('joined', {
        header: 'Joined',
        cell: (info) => <span className="text-xs text-[#6B7280]">{info.getValue()}</span>,
      }),
      columnHelper.accessor('lastSeen', {
        header: 'Last seen',
        cell: (info) => <span className="text-xs text-[#6B7280]">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="text-right">
              <button
                type="button"
                className="text-[#9AA2B1] hover:text-[#151A26] p-1 rounded-md transition-colors"
                aria-label={`Actions for ${user.name}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useTable({
    features: stockFeatures,
    data: users,
    columns: columns as unknown as ColumnDef<typeof stockFeatures, AdminUser, unknown>[],
    manualPagination: true,
    pageCount: Math.ceil(totalRows / limit),
  });

  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div>
      <AdminViewHeader
        title="User management"
        subtitle="Search, review, and manage every account."
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9AA2B1]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email"
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
                  <td colSpan={7} className="text-center py-8 text-xs text-[#9AA2B1]">
                    Loading users...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-[#9AA2B1]">
                    No users matching &quot;{searchQuery}&quot; found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4.5 py-3.5">
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
            Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
            {Math.min(page * limit, totalRows)} of {totalRows} users
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
    </div>
  );
};
