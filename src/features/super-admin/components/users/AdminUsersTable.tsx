import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  useTable,
  flexRender,
  createColumnHelper,
  stockFeatures,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search, MoreVertical, Trash2, AlertTriangle } from 'lucide-react';
import { AdminCard } from '../common/AdminCard';
import { AdminBadge } from '../common/AdminBadge';
import { AdminStatusDot } from '../common/AdminStatusDot';
import { AdminViewHeader } from '../common/AdminViewHeader';
import type { AdminBadgeTone } from '../common/AdminBadge';
import type { AdminUser, AdminUserStatus } from '../../types/admin';

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
  onDeleteUser: (id: string) => Promise<void>;
}

const STATUS_TONE_MAP: Record<AdminUserStatus, AdminBadgeTone> = {
  active: 'teal',
  suspended: 'red',
  inactive: 'neutral',
};

const columnHelper = createColumnHelper<typeof stockFeatures, AdminUser>();

interface RowActionsProps {
  user: AdminUser;
  onDelete: (user: AdminUser) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ user, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[#9AA2B1] hover:text-[#151A26] p-1 rounded-md transition-colors"
        aria-label={`Actions for ${user.name}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-50 w-36 rounded-xl border border-[#E7E9F0] bg-white shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(user);
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-0.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete user
          </button>
        </div>
      )}
    </div>
  );
};
interface ConfirmDeleteProps {
  user: AdminUser | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteProps> = ({
  user,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>

        <h3 className="text-[15px] font-semibold text-[#151A26] mb-1">Delete user?</h3>
        <p className="text-xs text-[#6B7280] leading-relaxed mb-5">
          You are about to soft-delete{' '}
          <span className="font-semibold text-[#151A26]">{user.name}</span>{' '}
          <span className="text-[#9AA2B1]">({user.email})</span>. This action can be reversed from
          the backend.
        </p>

        <div className="flex gap-2.5 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-[#E7E9F0] bg-white px-4 py-2 text-xs font-semibold text-[#151A26] hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  onDeleteUser,
}) => {
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteUser(pendingDelete.id);
      setPendingDelete(null);
    } catch {
      setDeleteError('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
        cell: (info) => <RowActions user={info.row.original} onDelete={setPendingDelete} />,
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
    <>
      <ConfirmDeleteDialog
        user={pendingDelete}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!isDeleting) {
            setPendingDelete(null);
            setDeleteError(null);
          }
        }}
      />

      <div>
        <AdminViewHeader
          title="User management"
          subtitle="Search, review, and manage every account."
        />

        {deleteError && (
          <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium px-4 py-2.5">
            {deleteError}
          </div>
        )}

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
    </>
  );
};
