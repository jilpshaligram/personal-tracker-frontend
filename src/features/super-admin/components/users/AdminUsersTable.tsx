import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';
import { AdminCard } from '../common/AdminCard';
import { AdminBadge } from '../common/AdminBadge';
import { AdminStatusDot } from '../common/AdminStatusDot';
import { AdminViewHeader } from '../common/AdminViewHeader';
import type { AdminBadgeTone } from '../common/AdminBadge';
import type { AdminUser, AdminUserStatus } from '../../types/superAdmin';

interface AdminUsersTableProps {
  users: AdminUser[];
}

const STATUS_TONE_MAP: Record<AdminUserStatus, AdminBadgeTone> = {
  active: 'teal',
  suspended: 'red',
  inactive: 'neutral',
};

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div>
      <AdminViewHeader
        title="User management"
        subtitle="Search, review, and manage every account."
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E9F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#151A26] hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E9F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#151A26] hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9AA2B1]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-[#E7E9F0] bg-[#F1F3F8] py-2 pl-9 pr-3.5 text-xs text-[#151A26] placeholder-[#9AA2B1] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2F63EB]"
        />
      </div>

      <AdminCard className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E7E9F0] bg-[#F9FAFC]">
                {['User', 'ID', 'Status', 'Plan', 'Joined', 'Last seen', ''].map((header) => (
                  <th
                    key={header}
                    className="px-4.5 py-3 text-[11px] font-semibold text-[#9AA2B1] uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E9F0]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4.5 py-3.5">
                    <div className="text-[13px] font-medium text-[#151A26]">{user.name}</div>
                    <div className="text-xs text-[#9AA2B1]">{user.email}</div>
                  </td>
                  <td className="px-4.5 py-3.5 text-xs font-mono text-[#6B7280]">{user.id}</td>
                  <td className="px-4.5 py-3.5">
                    <AdminBadge tone={STATUS_TONE_MAP[user.status]}>
                      <AdminStatusDot status={user.status} size={6} />
                      {user.status}
                    </AdminBadge>
                  </td>
                  <td className="px-4.5 py-3.5 text-xs font-medium text-[#6B7280]">{user.plan}</td>
                  <td className="px-4.5 py-3.5 text-xs text-[#6B7280]">{user.joined}</td>
                  <td className="px-4.5 py-3.5 text-xs text-[#6B7280]">{user.lastSeen}</td>
                  <td className="px-4.5 py-3.5 text-right">
                    <button
                      type="button"
                      className="text-[#9AA2B1] hover:text-[#151A26] p-1 rounded-md transition-colors"
                      aria-label={`Actions for ${user.name}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-[#9AA2B1]">
                    No users matching &quot;{searchQuery}&quot; found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
};
