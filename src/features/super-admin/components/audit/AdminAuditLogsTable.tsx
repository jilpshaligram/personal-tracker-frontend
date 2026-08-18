import React from 'react';
import { Download, Lock } from 'lucide-react';
import { AdminCard } from '../common/AdminCard';
import { AdminBadge } from '../common/AdminBadge';
import { AdminViewHeader } from '../common/AdminViewHeader';
import type { AdminBadgeTone } from '../common/AdminBadge';
import type { AuditLogItem, AuditLogSeverity } from '../../types/superAdmin';

interface AdminAuditLogsTableProps {
  logs: AuditLogItem[];
}

const SEVERITY_TONE_MAP: Record<AuditLogSeverity, AdminBadgeTone> = {
  critical: 'red',
  warning: 'amber',
  success: 'teal',
  info: 'indigo',
};

export const AdminAuditLogsTable: React.FC<AdminAuditLogsTableProps> = ({ logs }) => {
  return (
    <div>
      <AdminViewHeader
        title="Audit logs"
        subtitle="Every admin and system action, traced."
        right={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E9F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#151A26] hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        }
      />

      <AdminCard className="p-0! overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E7E9F0] bg-[#F9FAFC]">
                {['Timestamp', 'Actor', 'Action', 'Target', 'IP', 'Severity'].map((header) => (
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
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4.5 py-3 text-xs font-mono text-[#6B7280] whitespace-nowrap">
                    {log.ts}
                  </td>
                  <td className="px-4.5 py-3 text-[12.5px] font-medium text-[#151A26]">
                    {log.actor}
                  </td>
                  <td className="px-4.5 py-3 text-xs font-semibold text-[#2F63EB]">{log.action}</td>
                  <td className="px-4.5 py-3 text-xs font-mono text-[#6B7280]">{log.target}</td>
                  <td className="px-4.5 py-3 text-xs font-mono text-[#9AA2B1]">{log.ip}</td>
                  <td className="px-4.5 py-3">
                    <AdminBadge tone={SEVERITY_TONE_MAP[log.severity]}>{log.severity}</AdminBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="flex items-center gap-1.5 text-xs text-[#9AA2B1] mt-3">
        <Lock className="w-3 h-3 shrink-0" />
        <span>
          Log entries are append-only and cannot be edited or deleted, including by super admins.
        </span>
      </div>
    </div>
  );
};
